const fs = require("fs");

const data = JSON.parse(fs.readFileSync('./my-awesome-marriage-export.json'));

const responses = data.users;

const responseKeys = Object.keys(data.users);

const food = responseKeys.reduce((acc, responseKey) => {
    const userKeys = Object.keys(responses[responseKey].persons);
    return userKeys.reduce((innerAcc, userKey) => {
        const user = responses[responseKey].persons[userKey];
        if (user.participate === 'Nein') {
            return innerAcc;
        }
        const userFood = user.food;
        if (!['Fleisch', 'Vegetarisch', 'Vegan', 'Nichts'].includes(userFood)) {
            console.log(`${user.name} failed with ${user.food}`);
        }
        return {
            meet: userFood === 'Fleisch' ? innerAcc.meet + 1 : innerAcc.meet,
            vegetarian: userFood === 'Vegetarisch' ? innerAcc.vegetarian + 1 : innerAcc.vegetarian,
            vegan: userFood === 'Vegan' ? innerAcc.vegan + 1 : innerAcc.vegan,
            nothing: userFood === 'Nichts' ? innerAcc.nothing + 1 : innerAcc.nothing
        };
        
    }, acc);
}, {
    meet: 0,
    vegetarian: 0,
    vegan: 0,
    nothing: 0
});

const songs = responseKeys.reduce((acc, responseKey) => {
    const song = responses[responseKey].song
    if (song && song.length > 3) {
        acc.push(song);
    }
    return acc;
}, []);


const allergies = responseKeys.reduce((acc, responseKey) => {
    const userKeys = Object.keys(responses[responseKey].persons);
    return userKeys.reduce((innerAcc, userKey) => {
        const user = responses[responseKey].persons[userKey];
        if (user.participate === 'Nein') {
            return innerAcc;
        }
        const allergie = user.allergies;
        if (allergie && allergie.length > 3 && allergie.toLowerCase() !== 'nein') {
            innerAcc.push(`${allergie} - ${user.name}`);
        }
        return(innerAcc);
    }, acc);
}, []);


console.log(food);
console.log('Insgesamt:', food.meet + food.vegetarian + food.vegan + food.nothing);

console.log('Songs: ', songs);
console.log('Insgesamt:', songs.length);

console.log('Allergien: ', allergies);
console.log('Insgesamt:', allergies.length);

