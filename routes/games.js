const express = require('express');
const { route } = require('.');
const router = express.Router();
const Games = require('../db/games');

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
    Games.create(req.user.id)
    .then((id) => { 
        console.log(id);
        return id; 
    })
    .then(({ id }) => res.json({ id }))
    .catch(console.log);

    // Currently hard coded as if user_id = 5 (username = admin) has created new game
    // Games.create(5)
    // .then((id) => { 
    //     console.log(id);
    //     return id; 
    // })
    // .then(({ id }) => res.json({ id }))
    // .catch(console.log);
});

/* JOIN A SPECIFIC GAME (by ID) */
router.post("/:id/join", (req, res) => {
    const { id } = req.params; // Game_id to join specific game by URL

    // Games.join(req.user.id, id)
    // .then(({ id }) => {
    //     if({id}.id == -1) {
    //         let errors = [];
    //         errors.push({message: "Game is full!"});
    //         res.render('lobby', { errors, name: req.user.username });
    //     } else {
    //         // res.json({ id });
    //         res.redirect('/games/'+{id}.id, { id });
    //     }
    // })
    // .catch(console.log);

    // Current logged in user (req.user.id) wants to join game by game_id = id
    Games.join(req.user.id, id)
    .then(({ id }) => res.json({ id }))
    .catch(console.log);
    
});

/* LISTS ALL GAMES FROM DATABASE */
router.post("/list", (req, res) => {
    Games.listGames()
    .then((results) => {
        return results;
    })
    .then((results) => res.json(results))
    .catch(console.log);
});

module.exports = router;
