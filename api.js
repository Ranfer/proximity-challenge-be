const fs = require("fs");
const fastcsv = require("fast-csv");
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

const autoFi = require('./db/model/autoFi.model');

const layout = require('../BE/data-layout');

router.get('/start', (req, res) => start(req, res));
router.get('/stop', (req, res) => stop(req, res));
router.post('/upload/:provider', (req, res) => upload(req, res));




const mongoServer = new MongoMemoryServer({
    instance: {
        port: 3006
    }
});

const upload = async (req, res) => {
    try {
        if (mongoServer.getInstanceInfo()) {// comment this line for file storage
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                let file = req.files.file;
                let provider = req.params.provider;
    
                file.mv('./uploads/' + file.name);
    
                let stream = fs.createReadStream('./uploads/' + file.name);
                let csvData = [];
                fastcsv
                    .parseStream(stream, { headers: true })
                    .on("data", function (data) {
                        let line = _.pick(data, Object.keys(layout));
                        
                        autoFi.create(line);// comment this line for file storage
    
                        csvData.push(line);
                    })
                    .on("end", async () => {
    
                        // UNcomment next lines for file storage
                        // // write to file
                        // const ws = fs.createWriteStream('./db/database.txt', { flags: 'a' });
                        // ws.write(JSON.stringify(csvData) + '-/-'); // "-/-" as separator
                        // ws.end();

                        res.status(200).send({ message: "SAVED" });
                    })
                    .on("error", function (err) {
                        console.log("ERROR ", err);
                        res.status(500).send({ message: "ERROR" });
                    })
            }
        } else { // comment this line for file storage
            res.status(500).send({message: "Start mongo at: localhost:3005/api/start"}); // comment this line for file storage
        } // comment this line for file storage

    } catch (err) {
        console.log("ERROR ", err);
        res.status(500).send(err);
    }
};

const start = async (req, res) => {
    mongoServer.start();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, { useNewUrlParser: true }, (err) => {
        if (err) {
            console.error("ERROR ", err);
            res.status(500).send({ message: "FAILED" });
        } else {
            console.log("CONNECTED MONGOOSE");
        }
    })
    res.status(200).send({ message: "STARTED" });
}

const stop = async (req, res) => {
    await mongoose.disconnect();
    await mongoServer.stop();
    res.status(200).send({ message: "STOPED" });
};

module.exports = router;