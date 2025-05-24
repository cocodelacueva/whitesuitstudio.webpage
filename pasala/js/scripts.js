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

var urlsDownload = {
    "android": "https://play.google.com/store/apps/details?id=com.whitesuit.pasala",
    "ios": "https://apps.apple.com/ar/app/pasala/id6743722902"
}; 


function isAndroid() {
    return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

// function to check if the user is windows device
function isWindows() {
    return navigator.platform.toUpperCase().indexOf('WIN') >= 0;
}

document.addEventListener('DOMContentLoaded', function () {
    cookiesPolicy()

    // function to check if mac or android

    if ( isAndroid() || isWindows() ) {
        var ctas = document.querySelector('.main-cta');

        if (ctas) {
            ctas.setAttribute('href', urlsDownload.android);
            ctas.setAttribute('target', '_blank');
        }
    }
});