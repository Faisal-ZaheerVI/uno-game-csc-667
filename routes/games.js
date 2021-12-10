const express = require('express');
const { route } = require('.');
const router = express.Router();
const Games = require('../db/games');
const Users = require('../db/users');

/* GAME BY URL (only for users part of the game) */
router.get("/:id", function (req, res, next) {
    // Pass authentication function if user trying to go to game link is
    // currently part of the game??

    const { id } = req.params; // Game_id

    res.render('game', { id });
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
    .then((results) => {
        return results;
    })
    .then((results) => res.json(results))
    .catch(console.log);
});

/* PLAYS A CARD IN GAME #(:id) */
router.post("/:id/play", (req, res, next) => {

});

/* DRAWS A CARD IN GAME #(:id) */
router.post("/:id/draw", (req, res, next) => {

});

module.exports = router;
