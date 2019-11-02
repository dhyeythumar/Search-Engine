// *********Importing the libraries********** //
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);

const port = 3000;
const app = express(); // creating express application

app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

// *********Importing the routes********** //
const publicRoutes = require('./routes/public.js');
const authRoutes = require('./routes/auth.js');
const db = require('./util/database.js');
const errorController = require('./controllers/error.js');

const options = {
    clearExpired: true,
    checkExpirationInterval: 3650000,
    expiration: new Date(Date.now() + 3600000),
    createDatabaseTable: true,
    connectionLimit: 6,
    endConnectionOnClose: true
}
const session_store = new mysqlStore(options, db);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    key: 'user_sid',
    secret: 'asdfghjklqwertyuiop',
    store: session_store,
    maxAge: 3600000,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    }
}));

// *********Setting the routes********** //
app.use(publicRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
