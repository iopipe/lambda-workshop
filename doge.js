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
      var size = Math.floor(Math.random() * (maxFontSize - minFontSize) + minFontSize + 1),
          x = Math.floor(Math.random() * (maxWidth - size * bird.length)),
          y = Math.floor(Math.random() * (maxHeight - size)),
          color = colors[Math.floor(Math.random() * 4)]

      image = image.fontSize(size).stroke(color).drawText(x, y, bird)
    }
  }
  catch (err) {
    return cb(err, null)
  }
  var fileNum = Math.floor(Math.random() * 1000)
  var fileName = `/tmp/doge-${fileNum}.jpg`
  console.log("Writing file: ", fileName)
  image.write(fileName, (err) => {
    if (err) {
      console.log("Error writing file: ", err)
      return cb(err, image)
    }
    var imgdata = fs.readFileSync(fileName)

    s3.putObject(
      {
          Bucket: 'iopipe-workshop-doge',
          Key: `doge-${fileNum}.jpg`,
          Body: imgdata,
          ContentType: 'image/jpeg'
      },
      (err, obj) => {
        //cb(err, s3.getSignedUrl('getObject', obj))
        cb(err, obj)
      }
    )
  })
}
