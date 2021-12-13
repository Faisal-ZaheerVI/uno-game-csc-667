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
            res.render('game', { id });
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
        res.render('game', { id });
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
    // VALIDATION:
    // Make sure user is in the game
    // Make sure the user holds this card
    // Make sure it's the user's turn

    // If true, update the gameState
    // Then broadcast gameState to all users

    // If invalid, just update gameState

    const { id, card } = req.params; // Game_id
    console.log(id);
    console.log(card);
});

/* DRAWS A CARD IN GAME #(:id) */
router.post("/:id/draw", (req, res, next) => {

});

module.exports = router;
