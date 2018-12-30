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
        })
        .then(() => firebase.app().delete());
}

function addUser(name) {
    if (!name) {
        return console.error('Second parameter is missing');
    }
    console.log(`Add User with internalName ${name}.`);
    firebase.database().ref('/users')
        .push({
            interalName: name,
            responded: false,
            mailUpdate: '',
        })
        .then(() => {
            console.log(`User added.`);
            firebase.app().delete();

        })
        .catch(error => console.error(error))
        .then(() => firebase.app().delete());
}

function addInvitedPerson(name, userId) {
    if (!name) {
        return console.error('Second parameter is missing');
    }
    if (!userId) {
        return console.error('Third parameter is missing');
    }
    console.log(`Add invited person ${name} to user ${userId}`);
    firebase.database().ref(`/users/${userId}`)
        .push({
            name: name,
            participate: 'Yes',
            food: 'Meat',
            allergies: '',
        })
        .then(() => console.log(`Added invited Person ${name} to ${userId}.`))
        .catch((error) => console.error(`Could not add ${name} because of an error. \n ${error}`))
        .then(() => firebase.app().delete());
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
        .then(() => console.log(`${name} added to presents.`))
        .then(() => firebase.app().delete());
}

const Actions = {
    showUsers: 'showusers',
    addUser: 'adduser',
    addPresent: 'addpresent',
    addInvitedPerson: 'addinvitedperson',
};

const [ _, __, action, name, ref ] = process.argv;
console.log(`${action} is called`);
switch (action.toLowerCase()) {
    case Actions.showUsers:
        logUser();
        break;
    case Actions.addUser:
        addUser(name);
        break;
    case Actions.addInvitedPerson:
        addInvitedPerson(name, ref);
        break;
    case Actions.addPresent:
        addPresent(name);
        break;
    default:
        console.log('Cases are', Object.keys(Actions).join(', '))
}
