var api = require(__dirname + '/api');
var robot = require(__dirname + '/robot');

/**
 * Initializes a botvac client with an authorization token.
 * @param {String} t - Token used to authorize calls to Neato API.
 * @param {String} [tokenType] - Token type, optional. Valid values: OAuth, token must be an OAuth access token, see https://developers.neatorobotics.com/guides/oauth-flow. Any other token type value requires a session token issued by a login with email and password.
 */
function Client(t, tokenType) {
    this._baseUrl = 'https://beehive.neatocloud.com';
    this._token = t;
    switch (tokenType) {
        case 'OAuth':
            this._tokenType = 'Bearer ';
            break;
        default:
            this._tokenType = 'Token token=';
            break;
    }
}

Client.prototype.authorize = function (email, password, force, callback) {
    if (!this._token || force) {
        api.request(this._baseUrl + '/sessions', {email: email, password: password}, 'POST', null, (function (error, body) {
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
        api.request(this._baseUrl + '/users/me/robots', null, 'GET', {Authorization: this._tokenType + this._token}, (function (error, body) {
            if (!error && body) {
                var robots = [];
                for (var i = 0; i < body.length; i++) {
                    robots.push(new robot(body[i].name, body[i].serial, body[i].secret_key, this._tokenType + this._token));
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

module.exports = Client;
