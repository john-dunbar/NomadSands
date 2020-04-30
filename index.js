//express routing initialization
const express = require('express');
require('dotenv').config();

const router = express.Router();
const app = express();

//session initialization
const session = require("express-session");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const MongoStore = require('connect-mongo')(session);

const MongoInterface = require('./mongoInterface.js');

const mongoInterface = new MongoInterface();

const DiscordInterface = require('./discordInterface.js');

const discordInterface = new DiscordInterface();

mongoInterface.connect().then((connection) => {
    console.log("db connected " + connection);
    //session undefined error with below code
    /*
    app.use(session({
        secret: process.env.SESSION_PASSWORD,
        store: new MongoStore({
            client: connection,
            dbName: 'nomadSands'
        })
    }));
    */
});

app.use(session({
    secret: process.env.SESSION_PASSWORD,
    store: new MongoStore({
        url: 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST,
        dbName: 'nomadSands'
    })
}));

//path for public files
const path = require('path');
app.use(express.static(__dirname + '/public'));

//parser for requests/queries
const bodyParser = require('body-parser');

//support json encoded bodies
app.use(bodyParser.json());

//support url encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

const multer = require('multer');
var upload = multer({
    dest: 'public/uploads/'
})
const fetch = require('node-fetch');
const FormData = require('form-data');

// Declare the redirect route
router.get('/oauth/redirect', function (req, res) {
    // user has given permission, time to use the returned code
    // from Discord to get the auth token for the user

    console.log("discord oauth redirect from: " + req.query.url);
    console.log("state returned from discord: " + req.query.state);
    console.log("comparing prev to " + req.session.id);

    bcrypt.compare(req.session.id + "loginRequest", req.query.state)
        .then((result) => {

            console.log("login request? " + result);

            if (result === true) {

                const requestToken = req.query.code
                let token = {};
                let guildsTemp = {};

                const data = new FormData();
                data.append('client_id', process.env.DISCORD_ID);
                data.append('client_secret', process.env.DISCORD_PASSWORD);
                data.append('grant_type', 'authorization_code');
                data.append('scope', 'identify');
                data.append('scope', 'guilds');
                data.append('scope', 'guild.join');
                data.append('redirect_uri', 'https://www.nomadsands.com/oauth/redirect');
                data.append('code', requestToken);

                console.log('before fetch');
                fetch('https://discordapp.com/api/oauth2/token', {
                        method: 'POST',
                        body: data,
                    })

                    .then(fetchResp => fetchResp.json())
                    .then(tokenData => {

                            token = tokenData;

                            var fetchedUser = fetch('https://discordapp.com/api/users/@me', {
                                headers: {
                                    authorization: `${token.token_type} ${token.access_token}`,
                                },
                            });

                            return fetchedUser;
                        }

                    )
                    .then(userData => userData.json())
                    .then(data => {
                        console.error("token type: " + token.token_type);

                        //insert user data into database
                        var jsonDoc = {
                            userId: data.id,
                            userName: data.username,
                            userAvatar: data.avatar,
                            sessionId: req.session.id,
                            accessToken: token.access_token,
                            tokenType: token.token_type,
                            expiresIn: token.expires_in,
                            refreshToken: token.refresh_token,
                            scope: token.scope
                        };

                        mongoInterface.insertDocument('visitorList', jsonDoc);

                        //save session data for user authorization check on redirect
                        req.session.username = data.username;
                        req.session.avatar = data.avatar;
                        req.session.userId = data.id;

                    })
                    .then(() => {
                        fetch('https://discordapp.com/api/users/@me/guilds', {
                                headers: {
                                    authorization: `${token.token_type} ${token.access_token}`,
                                },
                            })
                            .then(userGuilds => userGuilds.json())
                            .then(guilds => {
                                req.session.guilds = guilds;
                                res.redirect('/');
                            });
                    });
            }



        });

    bcrypt.compare(req.session.id + "botAuth", req.query.state)
        .then((result) => {

            console.log("bot request? " + result);
            if (result === true) {

            }

        });

});




//check if users are logged in before routing

app.use(['/createMatch', '/myMatches', '/logout'], function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.sendFile(path.join(__dirname, '/html/non-authenticated/home.html'));
    } else {
        next();
    }
})

router.get('/', function (req, res) {

    if (!req.session.username) {
        console.log(req.session.username);
        res.sendFile(path.join(__dirname, '/html/non-authenticated/home.html'));
    } else {
        console.log(req.session.user_id);
        res.sendFile(path.join(__dirname, '/html/authenticated/home_auth.html'));
    }

});

router.get('/viewMatches', function (req, res) {

    //for some reason at this point after logging out, it still loads the authenticated version
    /*
    if (!req.session.username) {
        console.log(req.session.username);
        res.sendFile(path.join(__dirname, '/html/non-authenticated/matchList.html'));
    } else {
        console.log(req.session.user_id);
        res.sendFile(path.join(__dirname, '/html/authenticated/home_auth.html'));
    }*/

    res.sendFile(path.join(__dirname, '/html/non-authenticated/matchList.html'));

});


router.get('/autocomplete', function (req, res) {
    mongoInterface.findGames(req.query.term).then(function (val) {
        res.send(val);
    });

});

router.get('/allMatches', function (req, res) {
    console.error("request for matches");
    mongoInterface.findAllMatches(req.query.term).then(function (val) {
        res.send(val);
    });

});

router.get('/getUserGuilds', function (req, res) {

    let result = [];

    console.log("guild list: ");
    console.log(req.session.guilds);
    if (req.session.guilds) {

        for (let i = 0; i < req.session.guilds.length; i++) {

            if (req.session.guilds[i].owner === true) {
                result.push(req.session.guilds[i]);
                console.log(req.session.guilds[i].name);
            }
        }
    } else {
        console.log("no guilds exist");
    }

    res.send(result);

});

router.get('/logout', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        req.logout();
        res.redirect('/');
    });

});

router.get('/discordLogin', function (req, res) {

    console.log("login request");

    let state = req.session.id + "loginRequest";

    bcrypt.hash(state, saltRounds, (err, hash) => {
        res.redirect('https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=' + process.env.DISCORD_ID + '&scope=identify%20guilds%20guilds.join&state=' + hash + '&redirect_uri=https%3A%2F%2Fwww.nomadsands.com%2Foauth%2Fredirect');
    });

});

router.get('/discordBotAuth', function (req, res) {

    //let guildID = req.query.discordServerID;

    let state = req.session.id + "botAuth";

    console.log("creating hash of " + req.session.id);

    bcrypt.hash(state, saltRounds, (err, hash) => {
        res.redirect('https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=' + process.env.DISCORD_ID + '&scope=bot&permissions=1&state=' + state + '&redirect_uri=https%3A%2F%2Fwww.nomadsands.com%2Foauth%2Fredirect');
    });

});


router.post('/newMatchWithThumbnail', upload.single('matchThumbnail'), function (req, res) {

    var jsonDoc = {
        matchThumbnail: "uploads/" + req.file.filename,
        gameName: req.body.gameName,
        matchOrganizer: req.session.username,
        maxPlayers: req.body.maxPlayers,
        playerCount: 0,
        matchTitle: req.body.matchTitle,
        matchDate: req.body.matchDate,
        matchTime: req.body.matchTime
    };

    mongoInterface.insertDocument('matchList', jsonDoc)
        .then(function (val) {
            res.send(val);
        });

});

router.post('/newMatch', upload.none(), function (req, res) {

    //discordInterface.createGuild(req.session.id, req.body.matchTitle).then(guild => {
    var jsonDoc = {
        matchThumbnail: req.body.matchThumbnail,
        gameName: req.body.gameName,
        //guildId: guild.id,
        matchOrganizer: req.session.username,
        organizerAvatar: req.session.avatar,
        organizerUserId: req.session.userId,
        maxPlayers: req.body.maxPlayers,
        playerCount: 0,
        matchTitle: req.body.matchTitle,
        matchDate: req.body.matchDate,
        matchTime: req.body.matchTime,
        discordServer: req.body.discordServerID,
        botIsMember: false
    };

    mongoInterface.insertDocument('matchList', jsonDoc)
        .then((result) => {

            res.send(result);

        });
    //});

});

//add the router
app.use('/', router);
app.listen(3000, "localhost");
