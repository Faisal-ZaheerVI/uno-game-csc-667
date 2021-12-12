const socket = io();

// Adds each db game to games list on lobby page with unique listing(title, id)
// with button to redirect to each unique game page.
function createGameListing(gameData) {
    return `<div class="games-table">
                <div class="games-row">
                    <div class="games-column"> ${gameData.title} </div>
                    <div class="games-column">0/4</div>
                    <div class="games-column">In Progress</div>
                    <div class="games-column">
                        <div id="activegame${gameData.id}" class="game-listing" data-id="${gameData.id}">Join</div>
                    </div>
                </div>
            </div>`;
}

// onclick="window.location.href='/games/${gameData.id}/join'"
// formaction="/games/${gameData.id}/join"

// Upon loading the /lobby page, page will fetch and display all games from db.
window.addEventListener('DOMContentLoaded', (event) => {
    let gamesListing = document.getElementById('games-container');
    // Retrieves list of games from db from fetch call to /games/list
    fetch(`/games/list`, { method: 'post' })
    .then((response) => response.json())
    .then((results) => {
        let newGamesListing = '';
        for(var i = 0; i < results.length; i++) {
            // Creates HTML template and fills data for each active game listing.
            newGamesListing += createGameListing(results[i]);
        }
        
        // Appends all active games to 'games-container' div in lobby.ejs
        gamesListing.innerHTML = newGamesListing;

        // Adds click event to each created game's Join button
        for(var i = 0; i < results.length; i++) {
            document.querySelector(`#activegame${results[i].id}`)
                    .addEventListener('click', event => {
                        event.preventDefault();
                
                        const { id } = event.target.dataset;
                        console.log(id);
                
                        fetch(`/games/${id}/join`, { method: 'post' })
                        .then((response) => response.json())
                        .then(({ id }) => {
                            if({id}.id != -1) {
                                console.log("Front-end side worked!");
                                window.location.replace(`/games/${id}`);
                            } else {
                                console.log("GAME IS FULL!!! (Front-end)");
                            }
                        })
                        .catch(console.log);
                    });
        }
        return results;
    })
    .catch(console.log);

    // gamesListing.scrollTop = gamesListing.scrollHeight;
});

// Create a game by clicking element with id="create" - UNCOMMENT?
// document.querySelector('#create').addEventListener('click', event => {
//     event.preventDefault();
    
//     fetch(`/games/create`, { method: 'post' })
//     .then((response) => response.json())
//     .then(({ id }) => {
//         window.location.replace(`/games/${id}`);
//     })
//     .catch(console.log);
// });

// Join a game by clicking element with id="game-listing"
// document.querySelector('.game-listing-test').addEventListener('click', event => {
//     event.preventDefault();

//     const { id } = event.target.dataset;

//     fetch(`/games/${id}/join`, { method: 'post' })
//     .then((response) => response.json())
//     .then(({ id }) => {
//         if({id}.id != -1) {
//             console.log("Front-end side worked!");
//             window.location.replace(`/games/${id}`);
//         } else {
//             console.log("GAME IS FULL!!! (Front-end)");
//         }
//     })
//     .catch(console.log);
// });

/* CHAT JS */
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

const chatForm = document.getElementById('lobby-chat-form');
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get message text by id
    const msg = event.target.elements.lobbymsg.value;

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
