function fetchUser(user) {
    return fetch(`/users/${user.user_id}`, { method: 'get' })
    .then((response) => response.json())
    .then((results) => {
        // User returned is an object with fields (id, username, ...)
        return results.username;
    })
    .catch(console.log);
}

function createGameUsersListing(user) {
    // Each user is an Object with fields (user_id, game_id, current_player, and order)
    return `<p>${user}</p>`;
}

window.addEventListener('DOMContentLoaded', (event) => {
    let usersListing = document.getElementById('current-players');
    let username = '';
    fetch(`/games/${5}/users`, { method: 'get' })
    .then((response) => response.json())
    .then((results) => {
        let newUsersListing = '';
        for(var i = 0; i < results.length; i++) {
            // Creates HTML template and fills data for each active game listing.
            fetchUser(results[i])
            .then((response) => {
                console.log(response);
                return response;
            })

            newUsersListing += createGameUsersListing(username);
        }

        usersListing.innerHTML = newUsersListing;

        return results;
    })
    .catch(console.log);
});

/* FRONT-END GAME LOGIC */

