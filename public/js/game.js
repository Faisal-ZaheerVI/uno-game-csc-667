const socket = io();

socket.on('updateGameState', gameData => {
    console.log("Hello world!");
    console.log(gameData);
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
    let usersListing = document.getElementById('current-players');
    let username = '';
    fetch(`/games/${1}/users`, { method: 'get' })
    .then((response) => response.json())
    .then((results) => {
        // console.log(results);
    })
    .catch(console.log);

    let initGameState = createGameState(1, 1); // Change hard coded values
    socket.emit('updateGameState', initGameState);
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

// Example updating gameState for game 17
// socket.on(`gameState: 17`, gameData => {
//     console.log(gameData);
// });

// Creates initial gameState object
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
        drawpile: 0, // Id of top of deck card_id (To change format?)
        winner: 0 // Order # of user that has won (if 0, game will continue running)
    }
}

function updateGameState(gameState) {
    
}
