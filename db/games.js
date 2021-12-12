const db = require('../db');
var format = require('pg-format'); // To SQL insert nested array of array values with one query

// Constants
const MAX_PLAYERS = 4;

// SQL statement presets:
const CREATE_GAME = 'INSERT INTO games (direction, user_id, title, created) VALUES (0, $1, $2, $3) RETURNING id';
const INSERT_CARD_QUERY = 'INSERT INTO game_cards (card_id, game_id, user_id, "order", discarded, draw_pile) VALUES (${card_id}, ${game_id}, ${user_id}, ${order}, 0, 1)';
const INSERT_USER_INTO_GAME = 'INSERT INTO game_players (game_id, user_id, current_player, "order") VALUES (${game_id}, ${user_id}, ${current_player}, ${order}) RETURNING game_id AS id';
const LIST_OF_GAMES = 'SELECT * FROM games';
const ALL_PLAYERS_IN_GAME = 'SELECT * FROM game_players WHERE game_id=${game_id}';
const NUM_PLAYERS_IN_GAME = 'SELECT COUNT(*) FROM game_players WHERE game_id=${game_id}';
const INSERT_SHUFFLED_CARDS = 'INSERT INTO game_cards (card_id, game_id, user_id, "order", discarded, draw_pile) VALUES %L';
const UPDATE_CARDS_NEW_PLAYER = 'UPDATE game_cards SET %L WHERE game_id = %i RETURNING game_id AS id';
const SELECT_ALL_CARDS_IN_GAME = 'SELECT * from game_cards WHERE game_id=${game_id}';

// Sets up a valid default game state when a game is created.
// Could add number of users we want per game (i.e. 4 players)
const create = (user_id, title) => 
    // Inserts new game into game table
    db.one(CREATE_GAME, [user_id, title, "now()"])
    .then(({ id }) => 
        // Inserts user who created the new game into game_players table
        db.one(INSERT_USER_INTO_GAME, {game_id: id, user_id, current_player: 1, order: 1})
    )
    .then(({ id }) =>
        // Get cards from the lookup table
        // Promise.all() takes multiple promises and waits for all to be resolved before
        // going to next step, provides all promises' results as inputs.
        Promise.all([{ id }, db.any('SELECT * FROM cards')])
    )
    // Change this! Currently creating ~104 promises/seperate queries to shuffle deck...
    .then(([ {id}, cards ]) => {
        // Shuffle cards here (to implement):
        let rawCards = cards;     
        let shuffledCards = shuffle(rawCards, id, user_id);
        var sql = format(INSERT_SHUFFLED_CARDS, shuffledCards);
        return Promise.all([{id}, db.any(sql)]);
        
        // Insert them in shuffled order into games_cards table
        // return Promise.all([
        //     { id }, 
        //     ... cards.map((card) => db.any(INSERT_CARD_QUERY, {card_id: card.id, game_id: id, user_id: user_id, order: Math.floor(Math.random()*100) }))
        // ]);
    })
    // Return the game_id as id (for front end to redirect as /games/id)
    .then(([{ id }]) => ({ id }));

const join = (user_id, game_id) => 
    userCount(game_id)
    .then(({ count }) => {
        // If Game isn't full (less than MAX_PLAYERS (4) players), insert player trying to join into the game.
        if({count}.count < MAX_PLAYERS) {
            console.log("Joining game...");
            // Check if user has already joined
            return db.any(ALL_PLAYERS_IN_GAME, {game_id})
                    .then((results) => {
                        let playerExists = false;
                        for(var i = 0; i < results.length; i++) {
                            if(results[i].user_id == user_id) {
                                playerExists = true;
                            }
                        }
                        if(!playerExists) {
                            // New player is inserted into the game.
                            return db.one(INSERT_USER_INTO_GAME, {game_id, user_id, current_player: 0, order: parseInt(count) + 1})
                            .then(({ id }) => {
                                return Promise.all([{id}, db.any(SELECT_ALL_CARDS_IN_GAME, {game_id: id})]);
                            })
                            .then(([{ id }, game_cards]) => {
                                let cards = game_cards;
                                let newCards = [];
                                let count = 0;
                                for (var i = 0; i < cards.length; i++) {
                                    if(cards[i].draw_pile == 1 && count < 8) {
                                        cards[i].user_id = user_id;
                                        newCards.push({user_id: cards[i].user_id, game_id: id, card_id: cards[i].card_id, order: cards[i].order, draw_pile: 0});
                                        count++;
                                    }
                                }

                                const update = 'UPDATE game_cards SET user_id=${user_id}, draw_pile=0 WHERE game_id=${game_id} AND "order"=${order} RETURNING game_id AS id';

                                return Promise.all([
                                    { id }, 
                                    ... newCards.map((card) => db.any(update, {user_id, game_id: id, order: card.order}))
                                ]);

                                // return db.any(update, id);

                                // user_id, game_id, card_id, "order", discarded, draw_pile
                                // var sql = format(UPDATE_CARDS_NEW_PLAYER, newCards, id);
                                // return Promise.all([{id}, db.any(sql)]);
                                // return db.any(sql);
                            })
                            .then(([{ id }]) => ({ id }));
                            // .then((gameId) => db.any(SELECT_ALL_CARDS_IN_GAME, {game_id: gameId}))
                            // return newPlayer(user_id, game_id, count);
                        } else {
                            // User has already joined the game.
                            console.log("Already joined the game.");
                            return {id: results[0].game_id};
                        }
                    })
        } 
        else {
            // Game is full, user can't join this game.
            console.log("Game is currently full. Join canceled.");
            return {id: -1};
        }
    });

const userCount = (game_id) => 
        db.one(NUM_PLAYERS_IN_GAME, 
        { game_id }
        );

const listGames = () => {
    return db.any(LIST_OF_GAMES);
}

const userListByGame = (game_id) => 
        db.any(ALL_PLAYERS_IN_GAME, 
        { game_id }
        );

const shuffle = (cards, game_id, user_id) => {
    let j, x, i;
    let cardsArray = []; // Nested arrays of values to insert in one format SQL query
    // FIELDS: card_id, game_id, user_id, "order", discarded, draw_pile
    // Cards.length = 108?
    for(i = cards.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = cards[i];
        cards[i] = cards[j];
        cards[j] = x;
        if (i < 8) {
            // Set last 7 shuffled cards to Player 1's hand
            cardsArray.push([cards[i].id, game_id, user_id, i, 0, 0]);
        } else {
            // Set to Draw Pile (sets default to user_id bc can't currently set user_id = 0 aka violates foreign key)
            cardsArray.push([cards[i].id, game_id, user_id, i, 0, 1]);
        }
    }
    return cardsArray;
}

const newPlayer = (user_id, game_id, count) => {
    // Return game_id! --> Ex: {id: game_id}
    return db.one(INSERT_USER_INTO_GAME, {game_id, user_id, current_player: 0, order: parseInt(count) + 1})
            .then((id) => db.any(SELECT_ALL_CARDS_IN_GAME, {game_id: id}))
            .then((game_cards) => {
                console.log(game_cards);
                let cards = game_cards;
                let newCards = [];
                let count = 0;
                for (var i = 0; i < cards.length; i++) {
                    if(cards[i].draw_pile == 1 && count < 8) {
                        cards[i].user_id = user_id;
                        newCards.push([cards[i].user_id, game_id, cards[i].card_id, cards[i].order, 0]);
                        count++;
                    }
                }
                // user_id, game_id, card_id, "order", discarded, draw_pile
                var sql = format(UPDATE_CARDS_NEW_PLAYER, newCards);
                return db.any(sql);
            })
}

module.exports = {
    create, 
    join, 
    userCount,
    listGames,
    userListByGame
}
