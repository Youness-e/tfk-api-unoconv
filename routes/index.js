'use strict'

const config = require('../config')
const document_handler = require('../handlers/documents/')
const images_handler = require('../handlers/images/')

module.exports = [
  {
    method: 'POST',
    path: '/unoconv/{format}',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: parseInt(config.PAYLOAD_MAX_SIZE, 10)
      },
      timeout: {
        server: parseInt(config.TIMEOUT_SERVER, 10),
        socket: parseInt(config.TIMEOUT_SOCKET, 10)
      },
      handler: document_handler.handleUpload
    }
  },
  {
    method: 'GET',
    path: '/unoconv/formats',
    config: {
      handler: document_handler.showFormats
    }
  },
  {
    method: 'GET',
    path: '/unoconv/formats/{type}',
    config: {
      handler: document_handler.showFormat
    }
  },
  {
    method: 'GET',
    path: '/unoconv/versions',
    config: {
      handler: document_handler.showVersions
    }
  },
  {
    method: 'GET',
    path: '/healthz',
    config: {
      handler: document_handler.healthcheck
    }
  },
  {
    method: 'POST',
    path: '/image/jpg',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: parseInt(config.PAYLOAD_MAX_SIZE, 10)
      },
      timeout: {
        server: parseInt(config.TIMEOUT_SERVER, 10),
        socket: parseInt(config.TIMEOUT_SOCKET, 10)
      },
      handler: images_handler.convert_jpg
    }
  },
  {
    method: 'POST',
    path: '/image/watermark',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: parseInt(config.PAYLOAD_MAX_SIZE, 10)
      },
      timeout: {
        server: parseInt(config.TIMEOUT_SERVER, 10),
        socket: parseInt(config.TIMEOUT_SOCKET, 10)
      },
      handler: images_handler.watermark
    }
  }
]
