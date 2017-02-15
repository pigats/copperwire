const database = require('./firebase');

module.exports = function(verb, device, controlId) {
    return Promise.all([
        database.ref(`controls/${controlId}`).once('value'),
        database.ref(`deviceTypes/${device.val().type}`).once('value')
    ]).then(values => {
        let control, deviceType;
        [control, deviceType] = values;
        return database.ref(`controlTypes/${control.val().type}`).once('value').then(controlType => {
            console.info(verb, deviceType.val().name, control.val().name, '@', device.val().ip); 
            switch(controlType.val().name) {
                case 'switch' : return 'off';
                case 'select' : return 'selected';
                case 'slider' : return 42;
            };
        });
    });
}
