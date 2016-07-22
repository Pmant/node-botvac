var r = require('request');
var fs = require('fs');

function request(url, payload, method, headers, cert, callback) {
    if (!url || url === '') {
        if (typeof callback === 'function') callback('no url specified');
        return;
    }

    var options = {
        method: method === 'GET' ? 'GET' : 'POST',
        url: url,
        headers: {
            'Accept': 'application/vnd.neato.nucleo.v1'
        }
    };

    if (options.method === 'POST') {
        options.form = payload;
    }

    if (typeof headers === 'object') {
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                options.headers[header] = headers[header];
            }
        }
    }

    if (cert) {
        options.agentOptions = {
            ca: fs.readFileSync(cert)
        };
    }

    r(options, function (error, response, body) {
        try {
            body = JSON.parse(body);
        } catch (e) {

        }
        if (typeof callback === 'function') callback(error, body);
    });
}

exports.request = request;