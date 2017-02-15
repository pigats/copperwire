const database = require('./lib/firebase');
const handlers = {
    0: require('./lib/appleTv')
};

database.ref('devices').on('child_added', device => {
    syncDeviceSettings(device);
});

database.ref('deviceTypes').on('child_changed', type => {
    database.ref('devices').once('value').then(devices => {
        Object.keys(devices.val()).forEach(deviceId => {
            if(devices.val()[deviceId].type === type.key) {
                database.ref(`devices/${deviceId}`).once('value').then(syncDeviceSettings);
                Object.keys(devices.val()[deviceId].settings).forEach(settingId => {
                    database.ref(`settings/${settingId}`).once('value').then(setting => {
                        if(!Object.keys(type.exportVal().controls).includes(setting.val().control)) {
                            database.ref(`settings/${setting.key}`).remove();
                            database.ref(`devices/${deviceId}/settings/${setting.key}`).remove();
                        }
                    }).catch(error => console.error(error));
                });
            }
        });
    }).catch(error => console.error(error));
});

database.ref('settings').on('child_changed', setting => {
    Promise.all([
        database.ref(`devices/${setting.val().device}`).once('value'),
        database.ref(`controls/${setting.val().control}`).once('value')
    ]).then(values => {
        let device, control;
        [device, control] = values;
        return handlers[device.val().type].set(device, control, setting);
    });
});

function syncDeviceSettings(device) {
    const deviceType = device.val().type;
    const get = handlers[deviceType];
    const filter = [];

    database.ref(`deviceTypes/${deviceType}/controls`).once('value').then(controls => {
        controlIds = Object.keys(controls.exportVal());

        database.ref(`devices/${device.key}/settings/`).once('value').then(settings => {
            if(settings.val() !== null) {
                Object.keys(settings.exportVal()).forEach(settingId => {
                    filter.push(
                        new Promise((resolve, reject) =>
                            database.ref(`settings/${settingId}`).once('value').then(setting => {
                                controlIds = controlIds.filter(id => id !== setting.val().control);
                                resolve();
                            }).catch(error => console.error(error))
                        )
                    );
                });
            }
        }).then(() => {
            Promise.all(filter).then(() => {
                controlIds.forEach(controlId => {
                    database.ref(`controls/${controlId}`).once('value').then(control =>
                        get(device, control).then(value => {
                            let setting = database.ref('settings').push({
                                control: controlId,
                                device: device.key,
                                value
                            });
                            database.ref(`devices/${device.key}/settings/${setting.key}`).set(true)
                        })
                    );
                });
            });
        }).catch(error => console.error(error));
    }).catch(error => console.error(error));
}
