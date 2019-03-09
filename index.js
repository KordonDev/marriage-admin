const firebase = require('firebase-admin');

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
    firebase.database()
        .ref('/users')
        .push({
            interalName: name,
            responded: false,
            mailUpdate: '',
        })
        .then(ref => ref.child('persons'))
        .then((ref) => Promise.all([ 'Filipe', 'Marlies' ]
            .map(name => ref.push({
                name,
                participate: 'Yes',
                food: 'Meat',
                allergies: '',
            }))
        ))
        .catch(error => console.error(error))
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
