// Adds each db game to games list on lobby page with unique listing(title, id)
// with button to redirect to each unique game page.
function createGameListing(gameData) {
    return `<div class="games-table">
                <div class="games-row">
                    <div class="games-column"> ${gameData.title} </div>
                    <div class="games-column">0/4</div>
                    <div class="games-column">In Progress</div>
                    <div class="games-column">
                        <button class="game-listing" type="button" data-id="${gameData.id}"" onclick="window.location.href='/games/${gameData.id}'">Join</button>
                    </div>
                </div>
            </div>`;
}

window.addEventListener('DOMContentLoaded', (event) => {
    let gamesListing = document.getElementById('games-container');
    console.log("test");
    fetch(`/games/list`, { method: 'post' })
    .then((response) => response.json())
    .then((results) => {
        let newGamesListing = '';
        for(var i = 0; i < results.length; i++) {
            newGamesListing += createGameListing(results[i]);
        }
        // results.array.forEach((game) => {
        //     newGamesListing += createGameListing(game);
        // });
        gamesListing.innerHTML = newGamesListing;
    })
    .catch(console.log);
});

// Create a game by clicking element with id="create"
document.querySelector('#create').addEventListener('click', event => {
    event.preventDefault();
    
    fetch(`/games/create`, { method: 'post' })
    .then((response) => response.json())
    .then(({ id }) => {
        window.location.replace(`/games/${id}`);
    })
    .catch(console.log);
});

// Attempted to make all buttons workable (found alternative fix with onclick for buttons for now)

// document.querySelectorAll('.game-listing').forEach((game) => {
//     console.log("new test");
//     console.log(game);
//     game.addEventListener('click', event => {
//         event.preventDefault();

//         const { id } = event.target.dataset;
//         console.log(id);

//         fetch(`/games/${id}/join`, { method: 'post' })
//         .then((response) => response.json())
//         .then(({ id }) => {
//             window.location.replace(`/games/${id}`);
//         })
//         .catch(console.log);
//     });
// });

// Join a game by clicking element with id="game-listing"
document.querySelector('.game-listing-test').addEventListener('click', event => {
    event.preventDefault();

    const { id } = event.target.dataset;

    fetch(`/games/${id}/join`, { method: 'post' })
    .then((response) => response.json())
    .then(({ id }) => {
        window.location.replace(`/games/${id}`);
    })
    .catch(console.log);
});
