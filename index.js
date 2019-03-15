const firebase = require('firebase-admin');
const fs = require('fs');
const crypto = require('crypto');

const serviceAccount = require('./serviceAccount.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://marriage-test.firebaseio.com/'
});

function createLoginDatabase() {
    console.log('Creating login database...');

    firebase.database().ref('/users/')
        .once('value')
        .then(response => response.val())
        .then((respose) => {
            const inviteKeys = Object.keys(respose);
            const authKeys = inviteKeys.map(inviteKey => {
                return {
                    key: inviteKey,
                    name: respose[inviteKey].interalName,
                    loginCode: crypto.randomBytes(4).toString('hex'),
                }
            });
            fs.writeFileSync('./passwd.json', JSON.stringify(authKeys));
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

function addUsers() {
    const database = firebase.database();

    console.log(`Add Users from "./invites.json".`);
    const invites = JSON.parse(fs.readFileSync('./invites.json'));

    const add = invites.map(invite => {
        return database
        .ref('/users')
        .push({
            interalName: invite.interalName,
            responded: false,
            mailUpdate: '',
        })
        .then(ref => ref.child('persons'))
        .then((ref) => {
            console.log(ref);

        return Promise.all(invite.persons
            .map(person => ref.push({
                name: person.name,
                participate: 'Yes',
                food: person.food ? person.food : 'Meat',
                allergies: '',
            }))

        )})
        .catch(error => console.error(error))
    });

    Promise.all(add)
        .then(() => firebase.app().delete());
}


const Actions = {
    createLoginDatabase: 'createlogindatabase',
    addUsers: 'addusers',
};

const [ _, __, action, name, ref ] = process.argv;
switch (action.toLowerCase()) {
    case Actions.createLoginDatabase:
        createLoginDatabase();
        break;
    case Actions.addUsers:
        addUsers(name);
        break;
    default:
        console.log('Cases are', Object.keys(Actions).join(', '))
}
