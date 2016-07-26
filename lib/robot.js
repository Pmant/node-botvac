var api = require(__dirname + '/api');
var crypto = require('crypto');

function Robot(name, serial, secret) {
    this._baseUrl = 'https://nucleo.neatocloud.com/vendors/neato/robots/';
    this.name = name;
    this._serial = serial;
    this._secret = secret;
    this.eco = false;
    this.spotWidth = 100;
    this.spotHeight = 100;
    this.spotRepeat = false;

    //updated when getState() is called
    this.isCharging = null;
    this.isDocked = null;
    this.isScheduleEnabled = null;
    this.dockHasBeenSeen = null;
    this.charge = null;
    this.canStart = null;
    this.canStop = null;
    this.canPause = null;
    this.canResume = null;
    this.canGoToBase = null;
}

Robot.prototype.getState = function getState(callback) {
    doAction(this, 'getRobotState', null, (function (error, result) {
        if (typeof callback === 'function') {
            if ('message' in result) {
                callback(result.message, result);
            } else {
                this.isCharging = result.details.isCharging;
                this.isDocked = result.details.isDocked;
                this.isScheduleEnabled = result.details.isScheduleEnabled;
                this.dockHasBeenSeen = result.details.dockHasBeenSeen;
                this.charge = result.details.charge;
                this.canStart = result.availableCommands.start;
                this.canStop = result.availableCommands.stop;
                this.canPause = result.availableCommands.pause;
                this.canResume = result.availableCommands.resume;
                this.canGoToBase = result.availableCommands.goToBase;
                callback(error, result);
            }
        }
    }).bind(this));
};

Robot.prototype.getSchedule = function getSchedule(callback) {
    doAction(this, 'getSchedule', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('data' in result && 'enabled' in result.data) {
                callback(null, result.data.enabled);
            } else {
                callback('message' in result ? result.message: 'failed', result);
            }
        }
    });
};

Robot.prototype.enableSchedule = function enableSchedule(callback) {
    doAction(this, 'enableSchedule', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.disableSchedule = function disableSchedule(callback) {
    doAction(this, 'disableSchedule', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};



Robot.prototype.sendToBase = function sendToBase(callback) {
    doAction(this, 'sendToBase', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.stopCleaning = function stopCleaning(callback) {
    doAction(this, 'stopCleaning', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.pauseCleaning = function pauseCleaning(callback) {
    doAction(this, 'pauseCleaning', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.resumeCleaning = function resumeCleaning(callback) {
    doAction(this, 'resumeCleaning', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.startSpotCleaning = function startSpotCleaning(eco, width, height, repeat, callback) {
    if (typeof eco === 'function') {
        callback = eco;
        eco = this.eco;
        width = this.spotWidth;
        height = this.spotHeight;
        repeat = this.spotRepeat;
    } else if (typeof width  === 'function') {
        callback = width;
        width = this.spotWidth;
        height = this.spotHeight;
        repeat = this.spotRepeat;
    } else if (typeof height === 'function') {
        callback = height;
        height = this.spotHeight;
        repeat = this.spotRepeat;
    } else if (typeof repeat === 'function') {
        callback = repeat;
        repeat = this.spotRepeat;
    }

    if (typeof width !== 'number' || width < 100) {
        width = 100;
    }
    if (typeof height !== 'number' || height < 100) {
        height = 100;
    }
    var params = {
        category: 3, //1: manual, 2: house, 3: spot (see spotWidth/spotHeight)
        mode: eco ? 1 : 2, //1: eco, 2: turbo
        modifier: repeat ? 2 : 1, //spot: clean spot 1 or 2 times
        spotWidth: width,
        spotHeight: height
    };
    doAction(this, 'startCleaning', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.startManualCleaning = function startSpotCleaning(eco, callback) {
    if (typeof eco === 'function') {
        callback = eco;
        eco = this.eco;
    }

    var params = {
        category: 1, //1: manual, 2: house, 3: spot (spotWidth/spotHeight)
        mode: eco ? 1 : 2, //1: eco, 2: turbo
        modifier: 1 //spot: clean spot 1 or 2 times
    };
    doAction(this, 'startCleaning', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.startCleaning = function startSpotCleaning(eco, callback) {
    if (typeof eco === 'function') {
        callback = eco;
        eco = this.eco;
    }

    var params = {
        category: 2, //1: manual, 2: house, 3: spot (see spotWidth/spotHeight)
        mode: eco ? 1 : 2, //1: eco, 2: turbo
        modifier: 1 //spot: clean spot 1 or 2 times
    };
    doAction(this, 'startCleaning', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if ('result' in result && result.result == 'ok') {
                callback(null, result.result);
            } else {
                callback('message' in result ? result.message: 'failed', 'result' in result ? result.result : result);
            }
        }
    });
};

function doAction(robot, command, params, callback) {
    if (robot._serial && robot._secret) {
        var payload = {
            reqId: '1',
            cmd: command
        };
        if (params) {
           payload.params = params;
        }
        payload = JSON.stringify(payload);
        var date = new Date().toUTCString();
        var data = [robot._serial.toLowerCase(), date, payload].join("\n");
        var hmac = crypto.createHmac('sha256', robot._secret).update(data).digest('hex');
        var headers = {
            Date: date,
            Authorization: 'NEATOAPP ' + hmac
        };

        cert = __dirname + '/cert/neatocloud.com.crt';
        api.request(robot._baseUrl + robot._serial + '/messages', payload, 'POST', headers, cert, function (error, body) {
            if (typeof callback === 'function') {
                callback(error, body);
            }
        });
    } else {
        if (typeof callback === 'function') {
            callback('no serial or secret');
        }
    }
}

module.exports = Robot;