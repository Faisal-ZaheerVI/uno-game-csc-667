console.log("hi");

document.querySelector('#create').addEventListener('click', event => {
    event.preventDefault();
    
    fetch(`/games/create`, { method: 'post' })
    .then((response) => response.json())
    .then(({ id }) => {
        window.location.replace(`/games/${id}`);
    })
    .catch(console.log);
});

document.querySelector('#game-listing').addEventListener('click', event => {
    event.preventDefault();

    const { id } = event.target.dataset;

    fetch(`/games/${id}/join`, { method: 'post' })
    .then((response) => response.json())
    .then(({ id }) => {
        window.location.replace(`/games/${id}`);
    })
    .catch(console.log);
});
