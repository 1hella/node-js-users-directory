window.onload = () => {
    let emailNumber = 0;
    const addEmailButton = document.getElementById('add-email');
    const emailDiv = document.getElementsByClassName('emails')[0];
    addEmailButton.addEventListener('click', () => {
        emailDiv.innerHTML += `<input type="email" name="email${emailNumber}" id="email${emailNumber}">`
        emailNumber++;
    });
};