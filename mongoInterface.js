require('dotenv').config();

class MongoInterface {
    test = "";

    //database initialization
    mongo = require('mongodb').MongoClient;
    url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + '/nomadSands';

    mongoConnection;

    constructor() {
        this.connect();
    }

    async connect() {
        mongoConnection = await mongo.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    async insertDocument(destination, document) {

        try {

            let collection = db.collection(destination);

            let res = await collection.insertOne(document);

            return res;

        } catch (err) {
            console.error(err);
        }

    }

    async findAllMatches(matchQuery) {

        try {

            let collection = db.collection('matchList');

            let res = await collection.find().toArray();

            return res;

        } catch (err) {

            console.log(err);
        }

    }

    async findGames(gameQuery) {

        try {

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
        }

    }

    async findUser(sessionId) {

        var query = {
            'sessionId': sessionId
        };

        try {

            let collection = db.collection('visitorList');

            let res = await collection.find({
                'sessionId': sessionId
            }).toArray();

            console.error("result of userFind: " + res[0].accessToken);

            return res[0];

        } catch (err) {

            console.log(err);
        }

    }

}

module.exports = MongoInterface;
