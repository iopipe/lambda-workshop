'use strict';
/* AWS Lambda ships with imageMagick out of the box */
var gm = require('gm').subClass({ imageMagick: true }),
    fs = require('fs'),
    AWS = require('aws-sdk'),
    s3 = new AWS.S3()

var colors = [
  "red",
  "blue",
  "yellow",
  "green"
]
const maxFontSize = 18
const minFontSize = 12

module.exports.create = (event, context, cb) => {
  try {
    var image = gm('doge.jpg'),
        maxWidth = null,
        maxHeight = null
    
    image.size((err, value) => {
      if (err) {
        return cb(err, null)
      }
      maxWidth = value[0]
      maxHeight = value[1]
    })

    for (var bird of event.words) {
      var fontSize = Math.floor(Math.random() * (maxFontSize - minFontSize) + minFontSize + 1),
          x = Math.floor(Math.random() * (maxWidth)), // - (fontSize * bird.length))),
          y = Math.floor(Math.random() * (maxHeight)), // - fontSize)),
          color = colors[Math.floor(Math.random() * 4)]

      image = image.fontSize(fontSize).stroke(color).drawText(x, y, bird)
    }
  }
  catch (err) {
    return cb(err, null)
  }
  var fileNum = Math.floor(Math.random() * 1000)
  var fileName = `/tmp/doge-${fileNum}.jpg`
  var s3filename = `doge-${fileNum}.jpg`
  console.log("Writing file: ", fileName)
  image.write(fileName, (err) => {
    if (err) {
      console.log("Error writing file: ", err)
      return cb(err, image)
    }
    var imgdata = fs.readFileSync(fileName)
    var s3params = {
       Bucket: 'iopipe-workshop-doge-1',
       Key: s3filename,
       Body: imgdata,
       ContentType: 'image/jpeg',
       ACL: "public-read"
    }
    s3.putObject(s3params,
      (err, obj) => {
        //cb(err, s3.getSignedUrl('getObject', obj))
        cb(err, `https://s3.amazonaws.com/${s3params.Bucket}/${s3filename}`)
      }
    )
  })
}
