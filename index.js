const firebase = require('firebase-admin');
var Promise = require('promise');

const serviceAccount = require('./serviceAccount.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://marriage-test.firebaseio.com/'
});

function logUser() {
    const responses = firebase.database().ref('/response/');
    responses.once('value').then((snapshot) => {
        snapshot.forEach(user => {
            console.log(user.val());
        });
    });
}

function addPresent(name) {
    console.log('Add Present');
    firebase.database().ref('/wishlist')
        .push({
            title: name,
            description: '',
            link: '',
            pictureUrl: '',
            reservedBy: '',
         })
        .then(() => console.log(`${name} added to presents`));
}

const Actions = {
    showUsers: 'showusers',
    showPresents: 'showpresents',
    addPresent: 'addpresent',
};

const [ _, __, action, name ] = process.argv;
console.log(`${action} called ${name ? `with ${name}` : null}`);
switch (action.toLowerCase()) {
    case Actions.showUsers:
        logUser();
        break;
    case Actions.showPresents:
        // showPresents();
        break;
    case Actions.addPresent:
        addPresent(name);
        break;
    default:
        console.log('Cases are', Object.keys(Actions).join(', '))
}
