const firebase = require('firebase-admin');

firebase.initializeApp({
    credential: firebase.credential.cert({
        type: "service_account",
        project_id: "infrared-62fe7",
        private_key_id: "afdea1be8cfe090d0f94bb9a080f0dcc725b53ca",
        private_key: process.env['FIREBASE_PRIVATE_KEY'],
        client_email: "firebase-adminsdk-7uuzv@infrared-62fe7.iam.gserviceaccount.com",
        client_id: "109338466662992976837",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://accounts.google.com/o/oauth2/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7uuzv%40infrared-62fe7.iam.gserviceaccount.com",
    }),
    databaseURL: 'https://infrared-62fe7.firebaseio.com'
});

module.exports = firebase.database();
