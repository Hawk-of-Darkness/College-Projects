document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const welcomeContainer = document.getElementById('welcome-container');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');

    let selectedShape = '';
    let registeredShapes = {};

    function switchToLogin() {
        loginContainer.style.display = 'block';
        registerContainer.style.display = 'none';
        welcomeContainer.style.display = 'none';
    }

    function switchToRegister() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
        welcomeContainer.style.display = 'none';
    }

    function switchToWelcome() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'none';
        welcomeContainer.style.display = 'block';
        welcomeContainer.innerHTML = `<h2>Welcome, ${registeredShapes.username}!</h2>`;
    }

    function selectShape(shape, page) {
        selectedShape = shape;
        console.log(`Selected Shape: ${selectedShape}`);

        if (page === 'register') {
           
            console.log('Shape selected for registration.');
        }
    }

    function login(event) {
        event.preventDefault();
        const enteredUsername = document.getElementById('login-username').value;

        if (registeredShapes.username && registeredShapes.shape) {
            if (registeredShapes.username === enteredUsername && registeredShapes.shape === selectedShape) {
                switchToWelcome();
            } else {
                alert('Invalid credentials. Try again!');
            }
        } else {
            alert('Please register first.');
        }
    }

    function register(event) {
        event.preventDefault();
        const enteredUsername = document.getElementById('register-username').value;

        if (selectedShape && enteredUsername) {
           
            registeredShapes = {
                username: enteredUsername,
                shape: selectedShape,
            };

           
            alert('Registration successful! Now you can log in.');
            switchToLogin();
        } else {
            alert('Please select a shape and enter a username.');
        }
    }

    loginForm.addEventListener('submit', login);
    registerForm.addEventListener('submit', register);

    loginLink.addEventListener('click', switchToLogin);
    registerLink.addEventListener('click', switchToRegister);

    const shapeButtons = document.querySelectorAll('.grid-item');
    shapeButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const page = this.getAttribute('data-page');
            const shape = this.getAttribute('data-shape');
            selectShape(shape, page);
        });
    });
});