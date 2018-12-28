const firebase = require('firebase-admin');
var Promise = require('promise');

const serviceAccount = require('./serviceAccount.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://marriage-test.firebaseio.com/'
});

function logUser() {
    firebase.database().ref('/response/')
        .once('value')
        .then((respose) => {
            respose.forEach(user => console.log(user.val()))
        });
}

function addUser(name) {
    console.log('Add user');
}


function addPresent(name) {
    if (!name) {
        return console.error('Second parameter is missing');
    }
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
    addUser: 'adduser',
    addPresent: 'addpresent',
};

const [ _, __, action, name ] = process.argv;
console.log(`${action} called ${name ? `with ${name}` : null}`);
switch (action.toLowerCase()) {
    case Actions.showUsers:
        logUser();
        break;
    case Actions.addPresent:
        addPresent(name);
        break;
    default:
        console.log('Cases are', Object.keys(Actions).join(', '))
}
