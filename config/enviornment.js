const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'Placment_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ramanrana88940@gmail.com',
            pass: '******'
        }
    },
    google_client_id: "968917730265-gahshu7of123p0qsrrgh3el1i4tg00p7.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/employees/auth/google/callback",

    jwt_secret: 'Placment',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}






module.exports = development