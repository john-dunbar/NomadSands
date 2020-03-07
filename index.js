//express routing initialization
const express = require('express');

const router = express.Router();
const app = express();

//session initialization
const session = require("express-session");

app.use(session({
    secret: '***REMOVED***',
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

//database initialization
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';


// Declare the redirect route
router.get('/oauth/redirect', function (req, res) {
    // The req.query object has the query params that
    // were sent to this route. We want the `code` param
    const requestToken = req.query.code

    const data = new FormData();
    data.append('client_id', '***REMOVED***');
    data.append('client_secret', '***REMOVED***');
    data.append('grant_type', 'authorization_code');
    data.append('scope', 'identify');
    data.append('redirect_uri', 'https://www.nomadsands.com/oauth/redirect');
    data.append('code', requestToken);

    console.log('before fetch');
    fetch('https://discordapp.com/api/oauth2/token', {
            method: 'POST',
            body: data,
        })

        .then(fetchResp => fetchResp.json())
        .then(tokenData => fetch('https://discordapp.com/api/users/@me', {
            headers: {
                authorization: `${tokenData.token_type} ${tokenData.access_token}`,
            },
        }))
        .then(userData => userData.json())
        .then(data => {
            console.log(data.username)
            req.session.user_id = data.username
            res.redirect('/?username=' + data.username)
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

    if (!req.session.user_id) {
        console.log(req.session.user_id);
        res.sendFile(path.join(__dirname, '/html/non-authenticated/home.html'));
    } else {
        console.log(req.session.user_id);
        res.sendFile(path.join(__dirname, '/html/authenticated/home_auth.html'));
    }

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
    req.session.destroy();
    res.redirect('/');

});

router.post('/newMatchWithThumbnail', upload.single('matchThumbnail'), function (req, res) {
    //console.error(req.body);
    //console.error(req.file.filename);
    var jsonDoc = {
        matchThumbnail: "uploads/" + req.file.filename,
        gameName: req.body.gameName,
        matchOrganizer: "session user",
        maxPlayers: req.body.maxPlayers,
        playerCount: 0,
        matchTitle: req.body.matchTitle,
        matchDate: req.body.matchDate,
        matchTime: req.body.matchTime
    };

    console.error(jsonDoc);

    insertMatch(jsonDoc).then(function (val) {
        res.send(val);
    });

});

router.post('/newMatch', upload.none(), function (req, res) {
    //console.error(req.body);
    var jsonDoc = {
        matchThumbnail: req.body.matchThumbnail,
        gameName: req.body.gameName,
        matchOrganizer: "session user",
        maxPlayers: req.body.maxPlayers,
        playerCount: 0,
        matchTitle: req.body.matchTitle,
        matchDate: req.body.matchDate,
        matchTime: req.body.matchTime
    };



    insertMatch(jsonDoc).then(function (val) {
        console.error(val.ops[0]._id);
        res.send(val);
    });

});

async function findAllMatches(matchQuery) {

    const client = await mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {

        const db = client.db('nomadSands');

        let collection = db.collection('matchList');

        let res = await collection.find().toArray();


        return res;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }

}

async function findGames(gameQuery) {

    const client = await mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {

        const db = client.db('nomadSands');

        let collection = db.collection('gameList');

        let res = await collection.aggregate(
            [
                {
                    $unwind: '$data'
            },
                {
                    $replaceRoot: {
                        newRoot: '$data'
                    }
            },
                {
                    $match: {
                        'name': {
                            $regex: '.*' + gameQuery + '.*',
                            $options: '-i'
                        }
                    }
            }
                                              ]
        ).toArray();


        return res;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }

}

async function insertMatch(matchDoc) {

    const client = await mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        var docId = "";
        const db = client.db('nomadSands');

        let collection = db.collection('matchList');

        let res = await collection.insertOne(matchDoc);

        return res;


    } catch (err) {
        console.error(err);
    } finally {

        client.close();
    }

}


//add the router
app.use('/', router);
app.listen(3000, "localhost");
