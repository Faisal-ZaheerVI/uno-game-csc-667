const db = require('../db');

const CREATE_GAME = 'INSERT INTO games (direction, user_id, title, created) VALUES (0, $1, $2, $3) RETURNING id';
const INSERT_CARD_QUERY = 'INSERT INTO game_cards (card_id, game_id, user_id, "order", discarded, draw_pile) VALUES (${card_id}, ${game_id}, ${user_id}, ${order}, 0, 1)';
const INSERT_USER_INTO_GAME = 'INSERT INTO game_players (game_id, user_id, current_player, "order") VALUES (${game_id}, ${user_id}, ${current_player}, ${order}) RETURNING game_id AS id';
const LIST_OF_GAMES = 'SELECT * FROM games';
const ALL_PLAYERS_IN_GAME = 'SELECT * FROM game_players WHERE game_id=${game_id}';
const NUM_PLAYERS_IN_GAME = 'SELECT COUNT(*) FROM game_players WHERE game_id=${game_id}';

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
    .then(([ {id}, cards ]) =>
        // Shuffle cards here (to implement):     
        
        
        // Insert them in shuffled order into games_cards table
        Promise.all([
            { id }, 
            ... cards.map((card) => db.any(INSERT_CARD_QUERY, {card_id: card.id, game_id: id, user_id: user_id, order: Math.floor(Math.random()*100) }))
        ])
    )
    // Return the game_id as id (for front end to redirect as /games/id)
    .then(([{ id }]) => ({ id }));

const join = (user_id, game_id) => 
    userCount(game_id)
    .then(({ count }) => {
        // If Game isn't full (less than 4 players), insert player trying to join into the game.
        if({count}.count < 4) {
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
                            return db.one(INSERT_USER_INTO_GAME, {game_id, user_id, order: parseInt(count) + 1});
                        } else {
                            console.log("Already joined the game.");
                            return {id: results[0].game_id};
                        }
                    })

            // return db.one(INSERT_USER_INTO_GAME, {game_id, user_id, order: parseInt(count) + 1});
        }
        console.log("Game is currently full. Join canceled.");
        return {id: -1};
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

module.exports = {
    create, 
    join, 
    userCount,
    listGames,
    userListByGame
}
