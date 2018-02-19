window.onload = () => {
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