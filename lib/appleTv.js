const database = require('./firebase');
const fakeApi = require('./fakeApi');

module.exports = {
    get: (device, control) => fakeApi('GET', device, control),
    set: (device, control, setting) => fakeApi('POST', device, control, setting)
}
