const express = require('express');
const router = express.Router();
const Games = require('../db/games');
const Users = require('../db/users');
const { ensureAuthenticated } = require('../config/auth');
const { result } = require('../db');

/* GAME BY URL (only for users part of the game) */
router.get("/:id", ensureAuthenticated, function (req, res, next) {

    const { id } = req.params; // Game_id

    Games.userListByGame(id)
    // .then((response) => response.json())
    .then((results) => {
        let inGame = false;
        for(let i = 0; i < results.length; i++) {
            if(results[i].user_id == req.user.id) {
                inGame = true;
            }
        }
        if(inGame) {
            res.render('game', { id, name: req.user.username });
        } else {
            res.redirect('../lobby');
            res.render('lobby', {
                name: req.user.username
            });
        }
    })
    .catch(console.log);
});

/* CREATE GAME */
router.post("/create", (req, res) => {

    // Req.user.id gets the user_id of the current logged in user.
    Games.create(req.user.id, req.body.title)
    .then((id) => { 
        console.log(id);
        return id; 
    })
    // .then(({ id }) => res.json({ id }))
    .then(({id}) => {
        res.redirect(`/games/${id}`);
        res.render('game', { id, name: req.user.username });
    })
    .catch(console.log);
});

/* JOIN A SPECIFIC GAME (by ID) */
router.post("/:id/join", (req, res) => {
    const { id } = req.params; // Game_id to join specific game by URL

    // Current logged in user (req.user.id) wants to join game by game_id = id
    Games.join(req.user.id, id)
    .then(({id}) => {
        console.log({id});
        return ({id});
    })
    .then(({ id }) => res.json({ id }))
    .catch(console.log);
    
});

/* LISTS ALL GAMES FROM DATABASE */
router.post("/list", (req, res) => {
    Games.listGames()
    .then((results) => res.json(results))
    .catch(console.log);
});

/* GETS LIST OF USERS IN SPECIFIC GAME (by game_id) */
router.get("/:id/users", (req, res) => {
    const { id } = req.params;

    Games.userListByGame(id)
    .then((results) => res.json(results))
    .catch(console.log);
});

router.get("/:id/gamestate", (req, res) => {
    const { id } = req.params;

    Games.getGameState(id)
    .then((results) => res.json(results))
    .catch(console.log);
})

/* PLAYS A CARD IN GAME #(:id) */
router.post("/:id/play/:card", (req, res, next) => {
    const { id, card } = req.params; // Game_id = id, card_id = card
    let userId = req.user.id; // Activer user's id
    console.log(req.user.username, "played card #", card, "in game #", id);
    // PLAY CARD VALIDATION:
    Promise.all([Games.userListByGame(id), Games.getCardFromGame(id, card), Games.getUserFromGame(id, userId)])
    .then(([users, gameCard, gameUser]) => {
        // Make sure there are 4 players who joined the game before doing any interactions.
        if(users.length == 4) {
            for(let i = 0; i < users.length; i++) {
                // Make sure user is in the game
                if(users[i].user_id == userId) {
                    // User is in the game.
                    // Make sure the user holds this card:
                    if(gameCard.user_id == userId && gameCard.discarded == 0 
                        && gameCard.draw_pile == 0) {
                            // User does hold the card.
                            // Make sure it's the user's turn:
                            if(gameUser.current_player) {
                                // It is the user's turn.
                                console.log("It is the player's turn!");
                                // Can the card be played? (i.e. cant play Red 1 on Blue 2)
                            }
                    }
                }
            }
        }
    })
    // Games.userListByGame(id)
    // .then((users) => {
    //     let userId = req.user.id;
    //     let userInGame = false;
    //     for(let i = 0; i < users.length; i++) {
    //         if(users[i].user_id == userId) {
    //             userInGame = true;
    //         }
    //     }
    //     if(userInGame) {
    //         Games.getCardFromGame(id, card)
    //         .then((result) => {
    //             if(result.user_id == userId && result.discarded == 0 
    //                 && result.draw_pile == 0) {
    //                 console.log("User has the card!");
    //             }
    //             else {
    //                 console.log("User doesn't have the card");
    //             }
    //         });
    //     }
    //     else {
            
    //     }
    // })
    .catch(console.log);

    Games.getGameState(id)
    .then((results) => res.json(results))
    .catch(console.log);

    // If true, update the gameState
    // Then broadcast gameState to all users

    // If invalid, just update gameState
});

/* DRAWS A CARD IN GAME #(:id) */
router.post("/:id/draw", (req, res, next) => {

});

module.exports = router;
