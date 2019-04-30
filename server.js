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
// mongoAPIURL = appEnv.getServiceURL("Mongo-API-watson-" + process.env.VCAP_APPLICATION.state_timestamp);
// console.log("regel20",mongoAPIURL);
// console.log("what is deze",process.env.VCAP_APPLICATION)
// console.log("what is deze dan ",env.VCAP_APPLICATION)

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
Mongo = "Mongo-API-watson-";

var appEnv = {"app":{"application_id":"3f2b94e9-8eb0-4395-af84-40a7222cfa47","application_name":"front-watson-20190430080246042","application_uris":["front-watson-20190430080246042-zany-chipmunk.eu-gb.mybluemix.net"],"application_version":"f27890d3-af24-4f45-acbb-5f76e8cb1cc3","cf_api":"https://api.eu-gb.cf.cloud.ibm.com","host":"0.0.0.0","instance_id":"2567fdf5-df1e-4539-5a5b-fe0a","instance_index":0,"limits":{"disk":1024,"fds":16384,"mem":512},"name":"front-watson-20190430080246042","port":8080,"space_id":"e4c248cb-e9e9-445c-bfd7-b801aa5b17df","space_name":"dev","uris":["front-watson-20190430080246042-zany-chipmunk.eu-gb.mybluemix.net"],"version":"f27890d3-af24-4f45-acbb-5f76e8cb1cc3"},"services":{},"isLocal":false,"name":"front-watson-20190430080246042","port":8080,"bind":"0.0.0.0","urls":["https://front-watson-20190430080246042-zany-chipmunk.eu-gb.mybluemix.net"],"url":"https://front-watson-20190430080246042-zany-chipmunk.eu-gb.mybluemix.net"};
console.log(appEnv.app.application_name)
console.log(Mongo.concat(appEnv.app.application_name.split("-")[2]));

app.listen(port, () => console.log(('Server started on port %d'), port));