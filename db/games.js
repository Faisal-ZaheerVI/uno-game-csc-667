const { result } = require('../db');
const db = require('../db');

const CREATE_GAME = 'INSERT INTO games (direction, title, created) VALUES (0, $1, $2) RETURNING id';
const INSERT_CARD_QUERY = 'INSERT INTO game_cards (card_id, game_id, user_id, "order", discarded, draw_pile) VALUES (${card_id}, ${game_id}, ${user_id}, ${order}, 0, 1)';
const INSERT_USER = 'INSERT INTO game_players (game_id, user_id, current_player, "order") VALUES (${game_id}, ${user_id}, 0, ${order}) RETURNING game_id AS id';

// Sets up a valid default game state when a game is created.
// Could add number of users we want per game (i.e. 4 players)
const create = (user_id) => 
    // Inserts new game into game table
    db.one(CREATE_GAME, ['test_title', "now()"])
    .then(({ id }) => 
        // Inserts user who created the new game into game_players table
        db.one(INSERT_USER, {game_id: id, user_id, order: 0})
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
            ... cards.map((card) => db.any(INSERT_CARD_QUERY, {card_id: card.id, game_id: id, user_id: 5, order: Math.floor(Math.random()*100) }))
        ])
    )
    // Return the game_id as id (for front end to redirect as /games/id)
    .then(([{ id }]) => ({ id }));

const join = (user_id, game_id) => 
    userCount(game_id).then(({ count }) => 
        db.one(INSERT_USER, {game_id, user_id, order: parseInt(count) + 1})
    );

const userCount = (game_id) => 
        db.one('SELECT COUNT(*) FROM game_players WHERE game_id=${game_id}', 
        { game_id }
        );

module.exports = {
    create, 
    join, 
    userCount
}
