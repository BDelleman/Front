// call all the required packages
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cfenv = require("cfenv"); // nodig bij pushen naar cloud, voor vullen mongoAPIURL
var mongoAPIURL = 'https://sad-tiger.eu-gb.mybluemix.net/post'; //for local use
var request = require('request');
var WatsonClient = require('./WatsonAPI/WatsonCall');
var ejs = require("ejs");
var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true, type: "application/json" }));
app.set('view engine', 'ejs');

var appEnv = cfenv.getAppEnv();
console.log("logging environment"+ appEnv);

// mongoAPIURL = appEnv.getServiceURL(Mongo-API);
// console.log(mongoAPIURL);
mongoAPIURL = appEnv.getServiceURL("Mongo-API-watson-" + process.env.VCAP_APPLICATION.state_timestamp);
console.log("regel20" + mongoAPIURL);
console.log("what is deze"process.env)

// SET STORAGE
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//ROUTES WILL GO HERE
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload/photo', upload.single('myImage'), (req, res) => {
    var file = req.file.buffer;
    var fileSize = req.file.size / 1024 / 1024;
    Watsonresponse = undefined;
    Result = new Object;
    

    WatsonClient(file);

    res.setTimeout(5000, function () {
        console.log("to mongo " + Watsonresponse);
        if (fileSize >= 10) {
            res.render('error1')
            res.end();
        }    
        else if (Watsonresponse === undefined) {
            res.render('error2')
            res.end();
        } else {
            request.post({
                "headers": { "content-type": "application/json" },
                "url": mongoAPIURL,
                "body": Watsonresponse
            }, (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                Result = JSON.parse(body);
                viewVariable1 = Result.Image.class;
                viewVariable2 = Result.Image.score;
                viewVariable3 = Result.Count;
                res.render('result', {Class: viewVariable1, Score: viewVariable2, Count: viewVariable3});
            });
        }
    });

});

var appEnv = cfenv.getAppEnv();
console.log("logging environment"+ JSON.stringify(appEnv));

app.listen(port, () => console.log(('Server started on port %d'), port));