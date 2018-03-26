'use strict'

/*
* Import all required libraries
*/
const fs = require('fs')
const uuid = require('uuid')
const gm = require('gm')
const formats = require('../../lib/data/formats.json')
const pkg = require('../../package.json')


function delete_file(file) {
  fs.unlink(file, error => {
    if (error) {
      console.error(error)
    } else {
      console.log(`${file} deleted`)
    }
  })
}


function convert_to_jpg(input_file, output_file, reply){
  gm(input_file)
    .write(output_file, function(err){
      if (err) {
        return console.dir(arguments)
      }
      console.log(this.outname + " created  ::  " + arguments[3])
      reply(output_file)
  })
}


function watermark(file, watermark_file, output_file, reply) {
  gm(file)
    .composite(watermark_file).gravity("Center")
    .write(output_file, function(err, stdout, stderr, command){
      if (err){
        console.log(err)
        return {error: "Error watermarking"};
      }
      console.log("Watermark ok")
      return reply(output_file);
    });
}


/*
* Convert input file to jpg file
*/
module.exports.convert_jpg = (request, reply) => {
  const data = request.payload
  if (data.file) {
    const fileEndingOriginal = data.file.hapi.filename.split('.').pop()
    const input_file = process.cwd() + '/uploads/' + uuid.v4() + '.' + fileEndingOriginal
    const output_file = process.cwd() + '/uploads/' + uuid.v4() + '.jpg'
    const create_input_file = fs.createWriteStream(input_file)

    create_input_file.on('error', (error) => {
      console.error(error)
    })

    data.file.pipe(create_input_file)

    data.file.on('end', (err) => {
      if (err) {
        console.error(err)
        reply(err)
      } else {
        // Convert to jpg
        convert_to_jpg(input_file, output_file, function(){
          reply.file(output_file).on('finish', () => {
            delete_file(input_file)
            delete_file(output_file)
          })
        })
      }
    })
  }
}


/*
* Add watermark to image
*/
module.exports.watermark = (request, reply) => {
  const data = request.payload
  if (data.file && data.watermark) {
    const fileEndingOriginal = data.file.hapi.filename.split('.').pop()
    const input_file = process.cwd() + '/uploads/' + uuid.v4() + '.' + fileEndingOriginal
    const create_input_file = fs.createWriteStream(input_file)
    const watermark_input_file = process.cwd() + '/uploads/' + uuid.v4() + '.' + fileEndingOriginal
    const watermark_create_input_file = fs.createWriteStream(watermark_input_file)
    const output_file = process.cwd() + '/uploads/' + uuid.v4() + '.jpg'

    // Download first image
    create_input_file.on('error', (error) => {
      console.error(error)
    })
    data.file.pipe(create_input_file)
    data.file.on('end', (err) => {
      if (err) {
        console.error(err)
        reply(err)
      } else {
        // Download watermark file
        watermark_create_input_file.on('error', (error) => {
          console.error(error)
        })
        data.watermark.pipe(watermark_create_input_file)

        data.watermark.on('end', (err) => {
          if (err) {
            console.error(err)
            reply(err)
          } else {
            // Convert to jpg
            watermark(input_file, watermark_input_file, output_file, function(){
              reply.file(output_file).on('finish', () => {
                delete_file(input_file)
                delete_file(watermark_input_file)
                delete_file(output_file)
              })
            })
          }
        })
      }
    })
  }
}
