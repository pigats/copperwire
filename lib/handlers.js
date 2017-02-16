const database = require('./firebase');
const fakeApi = require('./fakeApi');
const citrusLight = require('./citrusLight');

module.exports = function(deviceType) {
    switch(deviceType) {
        case citrusLight.deviceTypeId: 
            return citrusLight.handler;
        default:
            return {
                get: (device, control) => fakeApi('GET', device, control),
                set: (device, control, setting) => fakeApi('POST', device, control, setting)
            }
    }
}
