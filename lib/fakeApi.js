const database = require('./firebase');

module.exports = function(verb, device, control, setting) {
    return database.ref(`deviceTypes/${device.val().type}`).once('value').then(deviceType => {
        return database.ref(`controlTypes/${control.val().type}`).once('value').then(controlType => {
            switch(verb) {
                case 'GET' :
                    console.info(verb, deviceType.val().name, control.val().name, '@', device.val().ip);
                    switch(controlType.val().name) {
                        case 'switch' : return false;
                        case 'select' : return '';
                        case 'slider' : return 42;
                    };
                    break;
                case 'POST' :
                    console.info(verb, deviceType.val().name, control.val().name, setting.val().value, '@', device.val().ip);
                    const ref = database.ref(`devices/${device.key}`);
                    ref.update({ updating: true });
                    setTimeout(() => { ref.update({ updating: null }) }, 1000);
                    break;
            };
        });
    });
}
