'use strict'

const config = require('config')
const pkg = require('../../package.json')

const express = require('express')
const app = express()

const helmet = require('helmet')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const compress = require('compression')
const morgan = require('morgan')

const isProduction = process.env.NODE_ENV === 'production'
const url_canonical = `${config.server.protocol}://${config.server.host}:${config.server.port}`

app.use(compress())
if (isProduction) app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())

// app.use(favicon(__dirname + '/public/favicon.ico'))

app.locals.isProduction = isProduction
app.locals.url_canonical = url_canonical
app.locals.FINK_ENDPOINT = config.api
app.locals.FINK_VERSION = pkg.version

app.disable('x-powered-by')

require('./views')(app, express)
require('./routes')(app)

module.exports = function (cb) {
  app.listen(config.server.port, function () {
    return cb(url_canonical)
  })
}
