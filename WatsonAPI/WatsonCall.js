WatsonClient = function WatsonClient(file = './klok.jpg', thresholdvalue = 0.7, me = 'me') {

  const fs = require('fs');
  const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
  var classifier_ids = ["VR_V3_786148410"];

  if (file === String)
    var classifyParams = {
      images_file: fs.createReadStream(file),
      owners: [me],
      classifier_ids: classifier_ids,
      threshold: thresholdvalue,
    };
  else (file === Buffer)
  var classifyParams = {
    images_file: file,
    owners: [me],
    classifier_ids: classifier_ids,
    threshold: thresholdvalue,
  };

  var visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: 'ASl2gKOWPzaho3RUYyoUn3lq_8RWb6axcfYhLtL8HHjY',

  })


  visualRecognition.classify(classifyParams)
    .then(classifiedImages => {
      Watsonresponse = JSON.stringify(classifiedImages.images[0].classifiers[0].classes[0], null, 2);
      //Response.score = JSON.stringify(classifiedImages.images[0].classifiers[0].classes[0].score, null, 2);
      console.log("watson " + Watsonresponse);
    })
    .catch(err => {
      console.log('error:', err);
    });
}

module.exports = WatsonClient