const cookiesPolicy = () => {

    // verifico localStorage para ver si acepto cookies
    if (localStorage.getItem('cookiesAccepted')) {
        return;
    }

    // Si no, muestro el mensaje de cookies
    const cookiesMessage = document.createElement('div');   
    cookiesMessage.className = 'cookies-policy-message';
    cookiesMessage.innerHTML = `
        <p>We use cookies to improve your experience. By using our site, you accept our <a href="https://whitesuit.studio/cookies-policy.html" target="_blank">Cookies Policy</a>.</p>
        <button class="accept-cookies">ok</button>
    `;
    document.body.appendChild(cookiesMessage);
    // Agrego evento al botón de aceptar cookies
    const acceptButton = cookiesMessage.querySelector('.accept-cookies');
    if (acceptButton) {
        acceptButton.addEventListener('click', function () {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiesMessage.remove();
        });
    }

}

document.addEventListener('DOMContentLoaded', function () {
    cookiesPolicy()
});