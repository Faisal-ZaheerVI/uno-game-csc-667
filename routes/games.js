const express = require('express');
const router = express.Router();
const Games = require('../db/games');

/* GAME BY URL */
router.get("/:id", function (req, res, next) {
    const { id } = req.params;

    res.render('game', { id });
});

/* CREATE GAME */
router.post("/create", (req, res) => {

    // Currently hard coded as if user_id = 5 (username = admin) has created new game
    Games.create(5)
    .then((id) => { 
        console.log(id);
        return id; 
    })
    .then(({ id }) => res.json({ id }))
    .catch(console.log);
});

/* JOIN A GAME */
router.post("/:id/join", (req, res) => {
    const { id } = req.params;

    // Currently hard coded as if user_id = 1 (username = test1) has joined
    Games.join(1, id).then(({ id }) => res.json({ id }));
});

module.exports = router;
