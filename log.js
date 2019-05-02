const request = require('request');
const { url } = require('./url');

function send(text) {
    request.post(
        {
            headers : { 'Content-type' : 'application/json' },
            url,
            form : JSON.stringify({ text }),
        },
        (error, res, body) => null
    );
}

module.exports.log = (text) => {
    if(text.toString().trim()) {
        console.log(text.toString().trim());
        send(new Date().toString().split(' ').splice(0, 5).join(' ') + ": " + text.toString().trim());
    }
};