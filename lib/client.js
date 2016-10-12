var api = require(__dirname + '/api');
var robot = require(__dirname + '/robot');
var crypto = require('crypto');

function Client(t) {
    this._baseUrl = 'https://beehive.neatocloud.com';
    this._token = t;
}

Client.prototype.authorize = function (email, password, force, callback) {
    if (!this._token || force) {
        api.request(this._baseUrl + '/sessions', {email: email, password: password}, 'POST', null, null, (function (error, body) {
            if (!error && body.access_token) {
                this._token = body.access_token;
                callback();
            } else {
                if (typeof callback === 'function') {
                    if (error) {
                        callback(error);
                    } else if (body.message) {
                        callback(body.message);
                    } else {
                        callback('unkown error');
                    }
                }
            }
        }).bind(this));
    } else {
        callback();
    }

};

Client.prototype.getRobots = function (callback) {
    if (this._token) {
        api.request(this._baseUrl + '/dashboard', null, 'GET', {Authorization: 'Token token=' + this._token}, null, (function (error, body) {
            if (!error && body && body.robots) {
                var robots = [];
                for (var i = 0; i < body.robots.length; i++) {
                    robots.push(new robot(body.robots[i].name, body.robots[i].serial, body.robots[i].secret_key));
                }
                callback(null, robots);
            } else {
                if (typeof callback === 'function') {
                    if (error) {
                        callback(error);
                    } else if (body.message) {
                        callback(body.message);
                    } else {
                        callback('unkown error');
                    }
                }
            }
        }).bind(this));
    } else {
        if (typeof callback === 'function') {
            callback('not authorized');
        }
    }
};

Client.prototype.reauthorize = function (email, password, callback) {
    Client.authorize(email, password, true, callback);
};


function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

module.exports = Client;