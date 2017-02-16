const database = require('./firebase');
const fakeApi = require('./fakeApi');
const request = require('http-request');

module.exports = citrusLight = {
    deviceTypeId: '-Kd6ZhRrhX1BW6eU12J5',
    handler: {
        get: (device, control) => fakeApi('GET', device, control),
        set: (device, control, setting) => {
            if(control.val().name === 'light') {
                console.info('switching citrus light', (setting.val().value === true ? 'on' : 'off'), '@', device.val().ip);
                const ref = database.ref(`devices/${device.key}`);
                ref.update({ updating: true });
                request.post(`${device.val().ip}/citrus-light/power`, function(err, res) {
                    if(err) {
                        console.error('something went wrong, should GET light status');
                    }
                    ref.update({ updating: null });
                });
            } else {
                return fakeApi('GET', device, control, setting);
            }
        }
    }
}
