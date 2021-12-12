const socket = io();

socket.on('updateGameState', gameState => {
    updateGamePage(gameState);
});

function fetchUser(user) {
    return fetch(`/users/${user.user_id}`, { method: 'get' })
    .then((response) => response.json())
    .then((results) => {
        // User returned is an object with fields (id, username, ...)
        return results.username;
    })
    .catch(console.log);
}

// function createGameUsersListing(user) {
//     // Each user is an Object with fields (user_id, game_id, current_player, and order)
//     return `<p>${user}</p>`;
// }

window.addEventListener('DOMContentLoaded', (event) => {
    let URL = window.location.href;
    let gameId = URL.split('/')[4];
    // fetch('/user', { method:'get' })
    // .then((response) => response.json())
    // .then((user) => {
    //     // let initGameState = createGameState(user.id, gameId);
    //     // socket.emit('updateGameState', initGameState);
    // })

    fetch(`/games/${gameId}/gamestate`)
    .then((response) => response.json())
    .then((results) => {
        let gameState = updateGameState(results);
        socket.emit('updateGameState', gameState);
    })
    .catch(console.log);
});

function uno() {
  alert("Winner winner chicken dinner!")
}

// GAME CHAT JS
socket.on('message', message => {
    fetch('/user', { method: 'get' })
    .then((response) => response.json())
    .then((user) => {
        // Returns user object with fields user.id and user.username
        console.log(message);
        outputMessage(message, user.username);
    })
    .catch(console.log);
});

const chatForm = document.getElementById('game-chat-form');
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get message text by id
    const msg = event.target.elements.gamemsg.value;

    // Emitting a message to the server
    socket.emit('chatMessage', msg);
});

// Output message to DOM
function outputMessage(message, username) {
    // Creates div element for each message to add to chat-messages container.
    const div = document.createElement('div');
    div.classList.add('message');
    // TODO: Replace Date object with Moment.js?
    div.innerHTML = `<p class="chat-user">${username} <span>${new Date().toLocaleString()}</span> </p>
    <p class="chat-text">
        ${message}
    </p>`;
    let chatMsgs = document.querySelector('.chat-messages')
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

/* GAME INTERACTIONS JAVASCRIPT (FRONT-END) */

// Playing a Card:
const myDeck = document.getElementById('mydeck')
myDeck.addEventListener('click', event => {
    event.preventDefault();

    // Need game_id and card_id

    // Getting card_id
    const { id } = event.target.dataset;

    // REMOVE CARD FROM DOM CODE:
    // const card = document.getElementById(`card-${id}`);
    // myDeck.removeChild(card);

    console.log("Clicked on card #", id);
    fetch(`/games/1/play/${id}`, {method: 'POST'})
    .then()
    .catch(console.log);

});

// Creates initial gameState object (CLEAN UP LATER)
function createGameState(userId, gameId) {
    return {
        // Current game's id
        game_id: gameId,
        // gameState info for all 4 users
        users: [
            { 
                user_id: userId, // Id of player
                current_player: 1, // Is it their turn? (0 = No, 1 = Yes)
                order: 1, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            },
            { 
                user_id: 0, // Id of player
                current_player: 0, // Is it their turn? (0 = No, 1 = Yes)
                order: 2, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            },
            { 
                user_id: 0, // Id of player
                current_player: 0, // Is it their turn? (0 = No, 1 = Yes)
                order: 3, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            },
            { 
                user_id: 0, // Id of player
                current_player: 0, // Is it their turn? (0 = No, 1 = Yes)
                order: 4, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            }
        ],
        discard: 0, // Id of recent card in discard (TO change format if cards run out?)
        draw_pile: 0, // Id of top of deck card_id (To change format?)
        winner: 0 // Order # of user that has won (if 0, game will continue running)
    }
}

/* 
--- gameData ---
gameData[0] = game_players array
gameData[1] = game_cards array
gameData[2] = direction

--- game_players array (objects) ---
fields: user_id, game_id, current_player, order

--- game_cards array (objects) ---
fields: card_id, user_id, game_id, order, discarded, draw_pile

*/

function updateGameState(gameData) {
    let gameState = {
        // Current game's id
        game_id: 0,
        // gameState info for all 4 users
        users: [
            { 
                user_id: 0, // Id of player
                current_player: 0, // Is it their turn? (0 = No, 1 = Yes)
                order: 1, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            },
            { 
                user_id: 0, // Id of player
                current_player: 0, // Is it their turn? (0 = No, 1 = Yes)
                order: 2, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            },
            { 
                user_id: 0, // Id of player
                current_player: 0, // Is it their turn? (0 = No, 1 = Yes)
                order: 3, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            },
            { 
                user_id: 0, // Id of player
                current_player: 0, // Is it their turn? (0 = No, 1 = Yes)
                order: 4, // What order do they play (1-4)
                cards: [0, 0, 0, 0, 0, 0, 0] // Id of cards they have (card_id)
            }
        ],
        discard: [], // Id of recent card in discard (TO change format if cards run out?)
        draw_pile: [], // Id of top of deck card_id (To change format?)
        direction: 0,
        winner: 0 // Order # of user that has won (if 0, game will continue running)
    };

    let game_players = gameData[0];
    let game_cards = gameData[1];
    let game_direction = gameData[2].direction;

    // fields: user_id, game_id, current_player, order
    let player1 = game_players[0];
    let player2 = game_players[1];
    let player3 = game_players[2];
    let player4 = game_players[3];

    let player1Cards = [];
    let player2Cards = [];
    let player3Cards = [];
    let player4Cards = [];

    let discardedCards = [];
    let drawpileCards = [];

    let winner = 0;

    for(let i = 0; i < game_cards.length; i++) {
        if(game_cards[i].user_id == player1.user_id &&
            game_cards[i].draw_pile == 0) {
                player1Cards.push(game_cards[i].card_id);
            }
        else if(game_cards[i].user_id == player2.user_id &&
            game_cards[i].draw_pile == 0) {
                player2Cards.push(game_cards[i].card_id);
            }
        else if(game_cards[i].user_id == player3.user_id &&
            game_cards[i].draw_pile == 0) {
                player3Cards.push(game_cards[i].card_id);
            }
        else if(game_cards[i].user_id == player4.user_id &&
            game_cards[i].draw_pile == 0) {
                player4Cards.push(game_cards[i].card_id);
            }
        else if(game_cards[i].discard == 1) {
            discardedCards.push(game_cards[i].card_id);
        }
        else if(game_cards[i].draw_pile == 1) {
            drawpileCards.push(game_cards[i].card_id);
        }
    }

    if(player1Cards.length < 1) {
        winner = 1;
    } else if (player2Cards.length < 1) {
        winner = 2;
    } else if (player3Cards.length < 1) {
        winner = 3;
    } else if (player4Cards.length < 1) {
        winner = 4;
    }

    // Update the gameState object value
    gameState.game_id = player1.game_id;
    gameState.users[0] = {
        user_id: player1.user_id, // Id of player
        current_player: player1.current_player, // Is it their turn? (0 = No, 1 = Yes)
        order: player1.order, // What order do they play (1-4)
        cards: player1Cards
    };
    gameState.users[1] = {
        user_id: player2.user_id, // Id of player
        current_player: player2.current_player, // Is it their turn? (0 = No, 1 = Yes)
        order: player2.order, // What order do they play (1-4)
        cards: player2Cards
    };
    gameState.users[2] = {
        user_id: player3.user_id, // Id of player
        current_player: player3.current_player, // Is it their turn? (0 = No, 1 = Yes)
        order: player3.order, // What order do they play (1-4)
        cards: player3Cards
    };
    gameState.users[3] = {
        user_id: player4.user_id, // Id of player
        current_player: player4.current_player, // Is it their turn? (0 = No, 1 = Yes)
        order: player4.order, // What order do they play (1-4)
        cards: player4Cards
    };
    gameState.discard = discardedCards;
    gameState.draw_pile = drawpileCards;
    gameState.direction = game_direction;
    gameState.winner = winner;

    // Update gameState object
    return gameState;
}

// gameState = {
//     game_id,
//     users: [
//         {
//             user_id,
//             current_player,
//             order,
//             cards = []
//         },
//     ],
//     discard = [],
//     draw_pile = [],
//     direction,
//     winner
// }

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function updateGamePage(gameState) {
    const myDeck = document.getElementById('mydeck');
    removeAllChildNodes(myDeck);
    for(let i = 0; i < gameState.users[0].cards.length; i++) {
        let card = document.createElement('div');
        card.setAttribute("id", `card-${gameState.users[0].cards[i]}`);
        card.innerHTML = `<img class="firstCard" src="../assets/Green_0.png" data-id="${gameState.users[0].cards[i]}">`
        myDeck.appendChild(card);
    }
}
