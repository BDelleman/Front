// call all the required packages
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
//var cfenv = require("cfenv"); // nodig bij pushen naar cloud, voor vullen mongoAPIURL
var mongoAPIURL = 'https://sad-tiger.eu-gb.mybluemix.net/post'; //for local use
var request = require('request');
var WatsonClient = require('./WatsonAPI/WatsonCall');


var app = express();
app.use(bodyParser.urlencoded({ extended: true, type: "application/json" }));

var appEnv = cfenv.getAppEnv();
console.log("logging environment"+appEnv);

//mongoAPIURL = appEnv.getServiceURL("Mongo-API-{timestamp}");
var port = process.env.PORT || 3000;


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
        //console.log("service Mongo-API " + appEnv.getService("Mongo-API"));
        //console.log("get all services " + appEnv.getServices());
        console.log("to mongo " + Watsonresponse);
        if (fileSize >= 10) {
            res.send("Size of image is too large")
        }    
        else if (Watsonresponse === undefined) {
            res.send("Image is not recognized")
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
                viewVariable1 = "Class = " + Result.Image.class + '</br>';
                viewVariable2 = "Score = " + Result.Image.score + '</br>';
                viewVariable3 = "Count = " + Result.Count;
                res.send(viewVariable1 + viewVariable2 + viewVariable3);
            });
        }
    });

});

app.listen(port, () => console.log(('Server started on port %d'), port));