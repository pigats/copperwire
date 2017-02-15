const database = require('./firebase');
const fakeApi = require('./fakeApi');

module.exports = function handler(device, controlId) {
    return fakeApi('GET', device, controlId);
}
