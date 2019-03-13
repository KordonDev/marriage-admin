const firebase = require('firebase-admin');
const fs = require('fs');

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

/*
    Rückgabe:
    {
        loginCode": "hochzeit",
        "key": "-LUzHKiHRmiVcMft",
        "name": "Hochzeitspaar"
    }
*/

function addUser(name) {
    const database = firebase.database();

    const invites = JSON.parse(fs.readFileSync('./invites.json'));

    console.log(`Add User with internalName ${name}.`);
    const add = invites.map(invite => {
        return database
        .ref('/users')
        .push({
            interalName: invite.interalName,
            responded: false,
            mailUpdate: '',
        })
        .then(ref => ref.child('persons'))
        .then((ref) => Promise.all(invite.persons
            .map(person => ref.push({
                name: person.name,
                participate: 'Yes',
                food: person.food ? person.food : 'Meat',
                allergies: '',
            }))
        ))
        .catch(error => console.error(error))
    });

    Promise.all(add)
        .then(() => firebase.app().delete());
}


const Actions = {
    showUsers: 'showusers',
    addUser: 'adduser',
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
    default:
        console.log('Cases are', Object.keys(Actions).join(', '))
}
