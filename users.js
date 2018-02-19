window.onload = () => {
    if (document.getElementsByTagName('tr').length === 1) {
        // no users
        let link = '<h3>No users. Add some <a href="/">here</a>!</h3>';
        document.getElementsByTagName('section')[0].innerHTML = link;
    } else {
        setEventListeners();
    }
}

function setEventListeners() {
    let deleteButtons = document.getElementsByClassName('delete');
    let deleteListener = (e) => {
        e.preventDefault();
        let url = 'users';
        if (e.target.dataset.index) {
            let index = e.target.dataset.index;
            url += `?u=${index}`;
        }

        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', url);

        xhr.onreadystatechange = () => {
            const DONE = 4;
            const OK = 200;
            if (xhr.readyState === DONE && xhr.status === OK) {
                location.reload();
            } else {
                console.log('Error: ' + xhr.status);
            }
        }

        xhr.send(null);
    };

    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', deleteListener);
    }
}