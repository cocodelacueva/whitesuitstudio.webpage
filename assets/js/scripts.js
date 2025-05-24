const cookiesPolicy = () => {

    // verifico localStorage para ver si acepto cookies
    if (localStorage.getItem('cookiesAccepted')) {
        console.log('Cookies already accepted');
        return;
    }

    // Si no, muestro el mensaje de cookies
    const cookiesMessage = document.createElement('div');   
    cookiesMessage.className = 'cookies-policy-message';
    cookiesMessage.innerHTML = `
        <p>We use cookies to improve your experience. By using our site, you accept our <a href="/cookies-policy-message.html" target="_blank">Cookies Policy</a>.</p>
        <button class="accept-cookies">ok</button>
    `;
    document.body.appendChild(cookiesMessage);
    console.log('Cookies policy message displayed');
    // Agrego evento al botón de aceptar cookies
    const acceptButton = cookiesMessage.querySelector('.accept-cookies');
    if (acceptButton) {
        acceptButton.addEventListener('click', function () {
            localStorage.setItem('cookiesAccepted', 'true');
            console.log('Cookies accepted');
            cookiesMessage.remove();
        });
    } else {
        console.warn('Accept button not found in cookies message');
    }

}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM is fully loaded');
    cookiesPolicy()
});