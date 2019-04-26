// call all the required packages
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoAPIURL = 'http://mongoapiv2-comedic-gazelle.eu-gb.mybluemix.net/post';
var request = require('request');
var WatsonClient = require('./WatsonAPI/WatsonCall');
var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// SET STORAGE
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//ROUTES WILL GO HERE
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload/photo', upload.single('myImage'), (req, res) => {
    var file = req.file.buffer;
    Watsonresponse = new Object;
    console.log(Watsonresponse);
    Result = new Object;

    WatsonClient(file);

    res.setTimeout(3000, function () {
        console.log("to mongo " + Watsonresponse);
        if (Watsonresponse === undefined) {
            res.send("Image is not recognized")
        } else if (Watsonresponse === {}){
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