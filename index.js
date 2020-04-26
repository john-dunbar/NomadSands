//express routing initialization
const express = require('express');
require('dotenv').config();

const router = express.Router();
const app = express();

//session initialization
const session = require("express-session");

const MongoStore = require('connect-mongo')(session);

const MongoInterface = require('./mongoInterface.js');

const mongoInterface = new MongoInterface();

const DiscordInterface = require('./discordInterface.js');

const discordInterface = new DiscordInterface();

app.use(session({
    secret: process.env.SESSION_PASSWORD,
    store: new MongoStore({
        client: mongoInterface.mongoConnection
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
    const requestToken = req.query.code
    let token = {};

    const data = new FormData();
    data.append('client_id', process.env.DISCORD_ID);
    data.append('client_secret', process.env.DISCORD_PASSWORD);
    data.append('grant_type', 'authorization_code');
    data.append('scope', 'identify');
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
                        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
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
            res.redirect('/');
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
    findGames(req.query.term).then(function (val) {
        res.send(val);
    });

});

router.get('/allMatches', function (req, res) {
    console.error("request for matches");
    findAllMatches(req.query.term).then(function (val) {
        res.send(val);
    });

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

    res.redirect('https://discordapp.com/api/oauth2/authorize?client_id=' + process.env.DISCORD_ID + '&redirect_uri=https%3A%2F%2Fwww.nomadsands.com%2Foauth%2Fredirect&response_type=code&scope=identify%20guilds.join');

});



router.post('/newMatchWithThumbnail', upload.single('matchThumbnail'), function (req, res) {
    //console.error(req.body);
    //console.error(req.file.filename);
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

    console.error(jsonDoc);

    mongoInterface.insertDocument('matchList', jsonDoc).then(function (val) {
        res.send(val);
    });

});

router.post('/newMatch', upload.none(), function (req, res) {

    discordInterfacce.createGuild(req.session.id, req.body.matchTitle).then(guild => {
        var jsonDoc = {
            matchThumbnail: req.body.matchThumbnail,
            gameName: req.body.gameName,
            guildId: guild.id,
            matchOrganizer: req.session.username,
            organizerAvatar: req.session.avatar,
            organizerUserId: req.session.userId,
            maxPlayers: req.body.maxPlayers,
            playerCount: 0,
            matchTitle: req.body.matchTitle,
            matchDate: req.body.matchDate,
            matchTime: req.body.matchTime
        };

        mongoInterface.insertDocument('matchList', jsonDoc).then(function (val) {

            res.send(val);

        });
    });

});

//add the router
app.use('/', router);
app.listen(3000, "localhost");
