var api = require(__dirname + '/api');
var crypto = require('crypto');

function Robot(name, serial, secret, token) {
    this._nucleoBaseUrl = 'https://nucleo.neatocloud.com:4443/vendors/neato/robots/';
    this._beehiveBaseUrl = 'https://beehive.neatocloud.com/users/me/robots/';
    this.name = name;
    this._serial = serial;
    this._secret = secret;
    this._token = token;

    //updated when getState() is called
    this.isBinFull = null;
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
    this.eco = null;
    this.noGoLines = null;
    this.navigationMode = null;
    this.spotWidth = null;
    this.spotHeight = null;
    this.spotRepeat = null;
    this.cleaningBoundaryId = null;
}

Robot.prototype.getState = function getState(callback) {
    doAction(this, 'getRobotState', null, (function (error, result) {
        if (typeof callback === 'function') {
            if (result === undefined) {
                if (!error) {
                    error = 'no result';
                }
                callback(error, null);
            } else if (result && 'message' in result) {
                callback(result.message, result);
            } else {
                this.isBinFull = result.alert == "dustbin_full";
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

                // Read cleaning parameters from last run
                this.eco = result.cleaning.mode === 1;
                // 4: house cleaning with noGoLines
                if (result.cleaning.category === 4) {
                    this.noGoLines = true;
                }
                // 2: house cleaning without noGoLines
                else if (result.cleaning.category === 2) {
                    this.noGoLines = false;
                }
                // 1+3: spot+manual cleaning. Set nogolines to default = false only if not set already
                else if (this.noGoLines === null) {
                    this.noGoLines = false;
                }
                this.navigationMode = result.cleaning.navigationMode;
                this.spotWidth = result.cleaning.spotWidth;
                this.spotHeight = result.cleaning.spotHeight;
                this.spotRepeat = result.cleaning.modifier === 2;
                this.cleaningBoundaryId = result.cleaning.boundaryId;
                callback(error, result);
            }
        }
    }).bind(this));
};

Robot.prototype.getSchedule = function getSchedule(detailed, callback) {
    if (typeof detailed === 'function') {
        callback = detailed;
        detailed = false;
    }
    doAction(this, 'getSchedule', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'data' in result && (detailed !== undefined) && detailed ) {
                callback(null, result.data);
            } else if (result && 'data' in result && 'enabled' in result.data) {
                callback(null, result.data.enabled);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result);
            }
        }
    });
};

Robot.prototype.enableSchedule = function enableSchedule(callback) {
    doAction(this, 'enableSchedule', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.disableSchedule = function disableSchedule(callback) {
    doAction(this, 'disableSchedule', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};



Robot.prototype.sendToBase = function sendToBase(callback) {
    doAction(this, 'sendToBase', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.stopCleaning = function stopCleaning(callback) {
    doAction(this, 'stopCleaning', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.pauseCleaning = function pauseCleaning(callback) {
    doAction(this, 'pauseCleaning', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.resumeCleaning = function resumeCleaning(callback) {
    doAction(this, 'resumeCleaning', null, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.startSpotCleaning = function startSpotCleaning(eco, width, height, repeat, navigationMode, callback) {
    if (typeof eco === 'function') {
        callback = eco;
        eco = this.eco;
        width = this.spotWidth;
        height = this.spotHeight;
        repeat = this.spotRepeat;
        navigationMode = this.navigationMode;
    } else if (typeof width === 'function') {
        callback = width;
        width = this.spotWidth;
        height = this.spotHeight;
        repeat = this.spotRepeat;
        navigationMode = this.navigationMode;
    } else if (typeof height === 'function') {
        callback = height;
        height = this.spotHeight;
        repeat = this.spotRepeat;
        navigationMode = this.navigationMode;
    } else if (typeof repeat === 'function') {
        callback = repeat;
        repeat = this.spotRepeat;
        navigationMode = this.navigationMode;
    } else if (typeof navigationMode === 'function') {
        callback = navigationMode;
        navigationMode = this.navigationMode;
    }

    if (typeof width !== 'number' || width < 100) {
        width = this.width;
    }
    if (typeof height !== 'number' || height < 100) {
        height = this.height;
    }
    if (typeof navigationMode !== 'number' || navigationMode < 1 || navigationMode > 2) {
        navigationMode = this.navigationMode;
    }
    var params = {
        category: 3, //1: manual, 2: house, 3: spot, 4: house with enabled nogolines
        mode: eco ? 1 : 2, //1: eco, 2: turbo
        modifier: repeat ? 2 : 1, //spot: clean spot 1 or 2 times
        navigationMode: navigationMode, //1: normal, 2: extra care
        spotWidth: width,
        spotHeight: height
    };
    doAction(this, 'startCleaning', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.startManualCleaning = function startSpotCleaning(eco, navigationMode, callback) {
    if (typeof eco === 'function') {
        callback = eco;
        eco = this.eco;
        navigationMode = this.navigationMode;
    } else if (typeof navigationMode === 'function') {
        callback = navigationMode;
        navigationMode = this.navigationMode;
    }

    var params = {
        category: 1, //1: manual, 2: house, 3: spot, 4: house with enabled nogolines
        mode: eco ? 1 : 2, //1: eco, 2: turbo
        modifier: 1, //spot: clean spot 1 or 2 times
        navigationMode: navigationMode //1: normal, 2: extra care
    };
    doAction(this, 'startCleaning', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

Robot.prototype.startCleaning = function startSpotCleaning(eco, navigationMode, noGoLines, callback) {
    if (typeof eco === 'function') {
        callback = eco;
        eco = this.eco;
        navigationMode = this.navigationMode;
        noGoLines = this.noGoLines;
    } else if (typeof navigationMode === 'function') {
        callback = navigationMode;
        navigationMode = this.navigationMode;
        noGoLines = this.noGoLines;
    } else if (typeof noGoLines === 'function') {
        callback = noGoLines;
        noGoLines = this.noGoLines;
    }

    var params = {
        category: noGoLines ? 4 : 2, //1: manual, 2: house, 3: spot, 4: house with enabled nogolines and/or boundaries
        mode: eco ? 1 : 2, //1: eco, 2: turbo
        modifier: 1, //spot: clean spot 1 or 2 times
        navigationMode: navigationMode //1: normal, 2: extra care
    };
    doAction(this, 'startCleaning', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

/**
 * A default action callback
 * @callback defaultActionCallback
 * @param {string} [error] - An error message if an error occur
 * @param {string|*} maps - "ok" on success or the request result if an error occur
 */

/**
 * Start cleaning a specific boundary (of type polygone)
 *
 * @param {bool} eco - enable eco cleaning or do a turbo clean
 * @param {bool} extraCare - enable extra care
 * @param {string} boundaryId - A {@link Boundary} id to clean (uuid-v4)
 * @param {defaultActionCallback} callback - a callback called when executing the action or an error
 */
Robot.prototype.startCleaningBoundary = function startSpotCleaning(eco, extraCare, boundaryId, callback) {
    if (typeof eco === 'function') {
        callback = eco;
        eco = this.eco;
        navigationMode = this.navigationMode;
        noGoLines = this.noGoLines;
    } else if (typeof navigationMode === 'function') {
        callback = navigationMode;
        navigationMode = this.navigationMode;
        noGoLines = this.noGoLines;
    } else if (typeof noGoLines === 'function') {
        callback = noGoLines;
        noGoLines = this.noGoLines;
    }

    var params = {
        boundaryId: boundaryId, // Boundary to clean
        category: 4, // 4: house with enabled nogolines and/or boundaries
        mode: eco ? 1 : 2, //1: eco, 2: turbo
        navigationMode: extraCare ? 2 : 1 //1: normal, 2: extra care
    };
    doAction(this, 'startCleaning', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

/**
 * A Map
 * @typedef {Object} Map
 * @property {string} id - The title
 * @property {string} name - The artist
 * @property {string} raw_floor_map_url - url pointing to a png image of the raw floor map
 * @property {string} url - url pointing to a png image of the floor map
 * @property {number} url_valid_for_seconds - number of seconds the map urls are valid
 */

/**
 * Callback for persistent maps.
 *
 * @callback getPersistentMapsCallback
 * @param {string} [error] - An error message if an error occur
 * @param {Map[]} maps - The list of {@link Map} for this robot
 */

/**
 * Add two numbers together, then pass the results to a callback function.
 *
 * @param {getPersistentMapsCallback} callback - A callback called on receiving the maps or an error
 */
Robot.prototype.getPersistentMaps = function getPersistentMaps(callback) {
    robotRequest(this, 'beehive', 'GET', '/persistent_maps', null, callback);
}

/**
 * A Boundary (zone or no go line)
 *
 * @typedef {Object} Boundary
 * @property {string} color - color hex code for a type polygone or '#000000' for a type polyline
 * @property {bool} enabled - always true, unknown usage
 * @property {string} id - boundary id (uuid-v4)
 * @property {string} name - polygone name or empty string for a type polyline
 * @property {number[]} [relevancy] - array of 2 number, center of a type polygone
 * @property {string} type - either polyline (for a no go lines) or polygon (for a zone)
 * @property {number[][]} vertices - array of array of two points, coordinates of the points
 */

/**
 * Callback for map boundaries.
 *
 * @callback getMapBoundariesCallback
 * @param {error} error - An integer.
 * @param {Boundary[]|*} - An array of {@link Boundary} for the specified {@link Map} or the request result if an error occur
 */

/**
 * Add two numbers together, then pass the results to a callback function.
 *
 * @param {string} mapId - An id from a {@link Map} to request its list of {@link Boundary}
 * @param {getMapBoundariesCallback} callback - A callback called on receiving the boundaries or an error
 */
Robot.prototype.getMapBoundaries = function getMapBoundaries(mapId, callback) {
    doAction(this, 'getMapBoundaries', { mapId: mapId }, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'data' in result && 'boundaries' in result.data) {
                callback(null, { mapId: mapId, boundaries: result.data.boundaries });
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result);
            }
        }
    });
}

/**
 * Callback when setting map boundaries.
 *
 * @callback setMapBoundariesCallback
 * @param {error} error - An integer.
 * @param {Boundary[]} - An array of {@link Boundary} for the specified {@link Map}
 */

/**
 * Add two numbers together, then pass the results to a callback function.
 *
 * @param {string} mapId - An id from a {@link Map} to set its list of {@link Boundary}
 * @param {Boundary[]} boundaries - List of all new {@link Boundary} for the given {@link Map}
 * @param {setMapBoundariesCallback} callback - A callback called on receiving the boundaries or an error
 */
Robot.prototype.setMapBoundaries = function setMapBoundaries(mapId, boundaries, callback) {
    doAction(this, 'setMapBoundaries', { mapId: mapId, boundaries: boundaries }, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'data' in result && 'boundaries' in result.data) {
                callback(null, { mapId: mapId, boundaries: result.data.boundaries });
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result);
            }
        }
    });
}

/**
 * A findMe callback
 * @callback findMeCallback
 * @param {string} [error] - An error message if an error occur
 * @param {string} result - "ok" on success or the request result if an error occur
 */

/**
 * Let the robot emit a sound and light to find him
 *
 * @param {findMeCallback} callback - a callback called when executing the action or an error
 */
Robot.prototype.findMe = function findMe(callback) {
    var params = {};
    doAction(this, 'findMe', params, function (error, result) {
        if (typeof callback === 'function') {
            if (error) {
                callback(error, result);
            } else if (result && 'result' in result && result.result === 'ok') {
                callback(null, result.result);
            } else {
                callback(result && 'message' in result ? result.message : 'failed', result && 'result' in result ? result.result : result);
            }
        }
    });
};

var robotMessagesRequestId = 1;
function doAction(robot, command, params, callback) {
    var payload = {
        reqId: robotMessagesRequestId++,
        cmd: command
    };
    if (params) {
        payload.params = params;
    }
    robotRequest(robot, 'nucleo', 'POST', '/messages', payload, callback);
}

function robotRequest(robot, service, type, endpoint, payload, callback) {
    if (robot._serial && robot._secret) {
        payload = JSON.stringify(payload);
        var date = new Date().toUTCString();
        var data = [robot._serial.toLowerCase(), date, payload].join("\n");
        var headers = {
            Date: date
        };
        var url;
        if (service === 'nucleo') {
            var hmac = crypto.createHmac('sha256', robot._secret).update(data).digest('hex');
            headers.Authorization = 'NEATOAPP ' + hmac;
            url = robot._nucleoBaseUrl + robot._serial + endpoint
        } else if (service === 'beehive') {
            headers.Authorization = robot._token;
            url = robot._beehiveBaseUrl + robot._serial + endpoint
        } else {
            callback('Service' + service + 'unknown');
        }
        api.request(url, payload, type, headers, function (error, body) {
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
