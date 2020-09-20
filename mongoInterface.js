"use strict";

require('dotenv').config();
const mongodb = require('mongodb');
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST;

class MongoInterface {
    //database initialization

    constructor() {}

    async connect() {
        this.mongoConnection = await mongo.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        return this.mongoConnection;
    }

    async insertDocument(destination, document) {
        try {
            const db = this.mongoConnection.db('nomadSands');
            let collection = db.collection(destination);
            let res = await collection.insertOne(document);
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    async findAllMatches(matchQuery) {
        try {
            const db = this.mongoConnection.db('nomadSands');
            let collection = db.collection('matchList');
            let res = await collection.find().toArray();
            return res;
        } catch (err) {
            console.log(err);
        }
    }

    async searchMatches(matchQuery) {
        try {
            const db = this.mongoConnection.db('nomadSands');
            let collection = db.collection('matchList');
            let res = await collection.find({
                "$or": [{
                    "matchOrganizer": {
                        "$regex": new RegExp(matchQuery, "i")
                    }
                }, {
                    "gameName": {
                        "$regex": new RegExp(matchQuery, "i")
                    }
                }, {
                    "matchTitle": {
                        "$regex": new RegExp(matchQuery, "i")
                    }
                }]
            }).toArray();
            return res;
        } catch (err) {
            console.log(err);
        }
    }

    async findGames(gameQuery) {
        try {
            const db = this.mongoConnection.db('nomadSands');
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
            const db = this.mongoConnection.db('nomadSands');
            let collection = db.collection('visitorList');
            let res = await collection.find({
                'sessionId': sessionId
            }).toArray();
            return res[0];
        } catch (err) {
            console.log(err);
        }
    }

    async deleteMatch(matchId) {
        var query = {
            '_id': mongodb.ObjectId(matchId)
        };
        try {
            const db = this.mongoConnection.db('nomadSands');
            let collection = db.collection('matchList');
            let res = await collection.deleteOne(query);
            console.error("deleted " + matchId + "? " + res);
            return res;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = MongoInterface;
