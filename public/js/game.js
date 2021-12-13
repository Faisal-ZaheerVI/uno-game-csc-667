const socket = io();

socket.on('updateGameState', gameState => {
    // console.log("Gamestate=", gameState);
    updateGamePage(gameState);
    // getGameData(gameState.game_id);
});

// ON PAGE LOAD:
window.addEventListener('DOMContentLoaded', (event) => {
    let URL = window.location.href;
    let gameId = URL.split('/')[4];
    getGameData(gameId);
});

// Fetches gameState data from back-end:
function getGameData(gameId) {
    fetch(`/games/${gameId}/gamestate`, { method:'get' })
    .then((response) => response.json())
    .then((gameData) => {
        // if(gameData[0].length == 4) {
        //     // players = gameData[0].length;
        //     createGameState(myId, gameData);
        // }
        createGameState(gameData);
    })
    .catch(console.log);
}

/* 
--- gameData info ---
gameData[0] = game_players array
gameData[1] = game_cards array
gameData[2] = direction (int)

--- game_players -> array of objects ---
fields: user_id, game_id, current_player, order

--- game_cards -> array of objects ---
fields: card_id, user_id, game_id, order, discarded, draw_pile
*/

// Creates initial gameState object and passes to updateGamePage:
function createGameState(gameData) {
    let gameState = {
        // Current game's id
        game_id: 0,
        // gameState info for all 4 users
        users: [],
        discard: [], // Id of recent card in discard (TO change format if cards run out?)
        draw_pile: [], // Id of top of deck card_id (To change format?)
        direction: 0,
        winner: 0 // Order # of user that has won (if 0, game will continue running)
    };

    let game_players = gameData[0];
    let game_cards = gameData[1];
    let game_direction = gameData[2].direction;

    // fields: user_id, game_id, current_player, order
    let player1, player2, player3, player4;
    let player1active, player2active, player3active, player4active;
    player1active = player2active = player3active = player4active = false;

    // Setting other active players as determined by game_players
    for(let i = 0; i < game_players.length; i++) {
        switch(i) {
            case 0: player1 = game_players[i]; player1active = true; break;
            case 1: player2 = game_players[i]; player2active = true; break;
            case 2: player3 = game_players[i]; player3active = true; break;
            case 3: player4 = game_players[i]; player4active = true; break;
        }
    }

    let player1Cards = [];
    let player2Cards = [];
    let player3Cards = [];
    let player4Cards = [];
    let discardedCards = [];
    let drawpileCards = [];
    let winner = 0;

    for(let i = 0; i < game_cards.length; i++) {
        if(game_cards[i].draw_pile == 1) {
            drawpileCards.push(game_cards[i].card_id);
        }
        else if(game_cards[i].discard == 1) {
            discardedCards.push(game_cards[i].card_id);
        }
        else {
            if(player1active) {
                if(game_cards[i].user_id == player1.user_id &&
                    game_cards[i].draw_pile == 0) {
                        player1Cards.push(game_cards[i].card_id);
                }
            }
            if(player2active) {
                if(game_cards[i].user_id == player2.user_id &&
                    game_cards[i].draw_pile == 0) {
                        player2Cards.push(game_cards[i].card_id);
                }
            }
            if(player3active) {
                if(game_cards[i].user_id == player3.user_id &&
                    game_cards[i].draw_pile == 0) {
                        player3Cards.push(game_cards[i].card_id);
                    }
            }
            if(player4active) {
                if(game_cards[i].user_id == player4.user_id &&
                    game_cards[i].draw_pile == 0) {
                        player4Cards.push(game_cards[i].card_id);
                    }
            }
        }
    }

    if(player1Cards.length < 1 && player1active) {
        winner = player1.order;
    } else if (player2Cards.length < 1 && player2active) {
        winner = player2.order;
    } else if (player3Cards.length < 1 && player3active) {
        winner = player3.order;
    } else if (player4Cards.length < 1 && player4active) {
        winner = player4.order;
    }

    // Update the gameState object value
    gameState.game_id = player1.game_id;

    if(player1active) {
        gameState.users.push({
            user_id: player1.user_id, // Id of player
            current_player: player1.current_player, // Is it their turn? (0 = No, 1 = Yes)
            order: player1.order, // What order do they play (1-4)
            cards: player1Cards
        });
    }
    if(player2active) {
        gameState.users.push({
            user_id: player2.user_id, // Id of player
            current_player: player2.current_player, // Is it their turn? (0 = No, 1 = Yes)
            order: player2.order, // What order do they play (1-4)
            cards: player2Cards
        });
    }
    if(player3active) {
        gameState.users.push({
            user_id: player3.user_id, // Id of player
            current_player: player3.current_player, // Is it their turn? (0 = No, 1 = Yes)
            order: player3.order, // What order do they play (1-4)
            cards: player3Cards
        });
    }
    if(player4active) {
        gameState.users.push({
            user_id: player4.user_id, // Id of player
            current_player: player4.current_player, // Is it their turn? (0 = No, 1 = Yes)
            order: player4.order, // What order do they play (1-4)
            cards: player4Cards
        });
    }

    gameState.discard = discardedCards;
    gameState.draw_pile = drawpileCards;
    gameState.direction = game_direction;
    gameState.winner = winner;

    // Update gameState object
    socket.emit('updateGameState', gameState);
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
    /* UPDATE CURRENT USER'S CARDS */
    const myDeck = document.getElementById('mydeck');
    removeAllChildNodes(myDeck);

    fetch('/user', { method: 'get' })
    .then((response) => response.json())
    // Returns user object with fields user.id and user.username
    .then((user) => {
        let currentUser;

        // console.log("gameState users is=", gameState.users);

        for(let i = 0; i < gameState.users.length; i++) {
            if(gameState.users[i].user_id == user.id) {
                // console.log("Active userid =",user.id);
                // console.log(gameState.users[i]);
                currentUser = gameState.users[i];
            }
        }
        // console.log("Current user var is=",currentUser);
        let currentUserOrder = currentUser.order;
        // let orderIndex = currentUserOrder + 1;
        let orderArr = [1,2,3,4]; // 3,4,1,2
        while(orderArr[0] != currentUserOrder) {
            let value = orderArr.shift();
            orderArr.push(value);
        }

        for(let i = 0; i < currentUser.cards.length; i++) {
            let card = document.createElement('div');
            let cardId = currentUser.cards[i];
            card.setAttribute("id", `card-${cardId}`);
            card.innerHTML = `<img src="../assets/card_${cardId}.png" data-id="${cardId}">`
            myDeck.appendChild(card);
        }

        /* UPDATING OTHER PLAYER'S CARDS */
        const deck2 = document.getElementById('deck2');
        const deck3 = document.getElementById('deck3');
        const deck4 = document.getElementById('deck4');
        removeAllChildNodes(deck2);
        removeAllChildNodes(deck3);
        removeAllChildNodes(deck4);

        for (let i = 0; i < gameState.users.length; i++) {
            for(let j = 1; j < orderArr.length; j++) {
                if(gameState.users[i].order == orderArr[j]) {
                    for(let k = 0; k < gameState.users[i].cards.length; k++) {
                        let card = document.createElement('div');
                        let cardId = gameState.users[i].cards[k];
                        card.setAttribute("id", `card-${cardId}`);
                        card.innerHTML = `<img src="../assets/card_deck.png" alt="player-${orderArr[j]}-card">`
                        // myDeck.appendChild(card);
                        switch(j) {
                            case 1:
                                deck2.appendChild(card);
                                break;
                            case 2:
                                deck3.appendChild(card);
                                break;
                            case 3:
                                deck4.appendChild(card);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }

        // Update discarded card on front-end?
    })
    .catch(console.log);
}

function uno() {
  alert("Winner winner chicken dinner!")
}

// GAME CHAT JAVASCRIPT:
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
const myDeck = document.getElementById('mydeck');
myDeck.addEventListener('click', event => {
    event.preventDefault();
    // Need game_id and card_id
    // Getting card_id
    const { id } = event.target.dataset;
    let URL = window.location.href;
    let gameId = URL.split('/')[4];

    // REMOVE CARD FROM DOM CODE:
    // const card = document.getElementById(`card-${id}`);
    // myDeck.removeChild(card);

    console.log("Clicked on card #", id);
    playCard(gameId, id);
});

function playCard(gameId, cardId) {
    fetch(`/games/${gameId}/play/${cardId}`, {method: 'POST'})
    .then((response) => response.json())
    .then((gameData) => createGameState(gameData))
    .catch(console.log);
}
