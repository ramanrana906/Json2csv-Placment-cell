const express= require('express');
const env = require('./config/enviornment');
const app = express();

const port =  8000;
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy.js');
const passportJWT =require('./config/passport-jwt-strategy');
const passportGoogle =require('./config/passport-google-Oauth2-strategy');


const MongoStore = require('connect-mongo');
const sassMiddleware =require('node-sass-middleware');
const flash = require('connect-flash');
const customMware =require('./config/middleware')
const path = require('path');

if(env.name=='development'){
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'CSS'),
        debug: true,
        outputStyle: 'extended',
        prefix: "/css", // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
    }));
 }

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, env.asset_path)));
console.log(__dirname + "/" + env.asset_path);
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'Placment_cell',
    // TODO change the secret before deployment in production mode
    secret: 'env.session_cookie_key',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store :  MongoStore.create ({
        
                 mongoUrl:`mongodb://localhost/${env.db}`,
           autoRemove:'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error while running the server:${err}`);
    }
    console.log(`server is running on port ${port}`);
})