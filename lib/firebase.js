const firebase = require('firebase-admin');

firebase.initializeApp({
    credential: firebase.credential.cert('./infrared-62fe7-firebase-adminsdk-7uuzv-afdea1be8c.json'),
    databaseURL: 'https://infrared-62fe7.firebaseio.com'
});

module.exports = firebase.database();
