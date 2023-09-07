/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const swaggerUi = require("swagger-ui-express");
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const chalk = require('chalk')
const logger = require('morgan');
const coursesRouter = require('./courses');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const swaggerJsdoc = require("swagger-jsdoc");


const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "HoneyCourses API",
      version: "1.0.0",
      description: "honeycourses.com의 API 문서입니다.",
    },
    basePath: "/",
  },
  apis: ["./courses.js"],
};

const specs = swaggerJsdoc(options);

dayjs.extend(utc);
dayjs.extend(timezone);

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
app.use("/apiDocs", swaggerUi.serve, swaggerUi.setup(specs));


// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


const morganMiddleware = logger(function (tokens, req, res) {
  return [
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    chalk.hex('#ffb142').bold(tokens.status(req, res)),
    chalk.hex('#ff5252').bold(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
    chalk.hex('#f78fb3').bold('@ ' + dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')),
    chalk.yellow(req.ip),
    chalk.hex('#fffa65').bold('from ' + tokens.referrer(req, res)),
    chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
    '\n',
  ].join(' ');
});

app.use(morganMiddleware);

app.use('/', coursesRouter);

app.listen(3000, function() {
    console.log("Dev- Backend started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
