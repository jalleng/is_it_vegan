'use strict';
const http = require('http');
const express = require('express');
const apiKey = process.env.FOODESSENTIALS_API_KEY;
let sessionId;
let body = '';
let upc = '028400071932';
const foodRouter = module.exports = exports = express.Router();

//Food Essentials requires a session id before a search can be done.  This fetchs the id and parses it out of the res.header.
foodRouter.get('/session', (req, res) => {
  http.get(`http://api.foodessentials.com/createsession?uid=uid&devid=did&appid=isItVegan&f=json&api_key=${apiKey}`, (res) => {
    console.log(`Got response: ${res.statusCode}`);
    sessionId = (res.headers['set-cookie'][0]).split(';')[0].split('=')[1];   //parsing out session id from response header
    console.log('sessionId', sessionId);
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
  res.end();
});

//
foodRouter.get('/upcsearch', (req, res) => {
  http.get(`http://api.foodessentials.com/label?u=${upc}&sid=${sessionId}&appid=isItVegan&f=json&api_key=${apiKey}`, (res) => {
    console.log(`Got response: ${res.statusCode}`);
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('sweet sweet data', body);
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
  res.end();
});


