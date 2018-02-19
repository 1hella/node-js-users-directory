window.onload = () => {
    let emailNumber = 0;
    const addEmailButton = document.getElementById('add-email');
    const emailDiv = document.getElementsByClassName('emails')[0];
    addEmailButton.addEventListener('click', () => {
        let id = `email${ emailNumber }`;
        let input = document.createElement("input");

        input.setAttribute('type', 'email');
        input.setAttribute('name', id);
        input.setAttribute('id', id);

        emailDiv.appendChild(input);
        emailNumber++;
    });
};