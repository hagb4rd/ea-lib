// Copyright 2012-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const URL = url.URL;
const querystring = require('querystring');
const opn = require('opn');
const destroyer = require('server-destroy');
const fetch = require('node-fetch');
const FormData = require('form-data');

//const {google} = require('googleapis');
//const plus = google.plus('v1');

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */



var CLIENT_ID=process.env['IMGUR_CLIENT_ID']||'';
var CLIENT_SECRET=process.env['IMGUR_CLIENT_SECRET'];
var REDIRECT_URI='https://localhost:3000/oauth2callback';


var keysPath = ImgurOAuthClient.getKeysPath();
if (fs.existsSync(keysPath)) {
  keys = require(keyPath);
}

/**
 * Create a new OAuth2 client with the configured keys.
 */

const OAuth2Client = class {
  constructor({CLIENT_ID,CLIENT_SECRET,REDIRECT_URL}) {
      this.CLIENT_ID=CLIENT_ID;
      this.CLIENT_SECRET=CLIENT_SECRET;
      this.REDIRECT_URL=REDIRECT_URL;
  }
  static getKeysPath() {
    const homedir = process.env["HOME"] || process.env["USERPROFILE"] || __dirname;
    const keyPath = path.resolve(homedir, 'oauth2.keys.json');
    return keyPath;
  }
  generateAuthUrl(scopes,redirect) {


  }
  parseAuthCode(uri) {
    var query=querystring.parse(url.parse(uri).query);

    //http://example.com#access_token=ACCESS_TOKEN&token_type=Bearer&expires_in=3600
  }
  getToken() {

  }
  headers() {
    var headers={}

    if(this.TOKEN) {
      headers['Authorization'] = `Bearer ${this.TOKEN}`;
    } else {
      headers['Authorization'] = `Client-ID ${this.CLIENT_ID}`;
    }
    return headers;
  }
  post(url, payload) {
    var body = new FormData();
    body.append(JSON.stringify(payload));
    var opts = {
      method: "POST",
      headers: Object.assign({}, this.headders()),
      body: body
    }
    await fetch('https://api.imgur.com/oauth2/token', opts)
      .then(resp=>resp.json());
  }
  
}
var ImugurOAuth2Client = class extends OAuth2Client() {
  constructor(credentials) {
    super(credentials);
    if(fs.existsSync(ImgurOAuthClient.getKeysPath())) {
      var keys=JSON.parse(fs.readFileSync(ImgurOAuthClient.getKeysPath(),{encoding:'utf8'}));
      Object.assign(this,keys);
    }
  }
  static getKeysPath() {
    const homedir = process.env["HOME"] || process.env["USERPROFILE"] || __dirname;
    const keyPath = path.resolve(homedir, 'imgur.oauth2.keys.json');
    return keyPath;
  }
  generateAuthUrl() {
    var url = `https://api.imgur.com/oauth2/authorize?client_id=${this.CLIENT_ID}&response_type=token`;
    return url;
  }
  parseAuthCode(req_url) {
    //http://example.com#access_token=ACCESS_TOKEN&token_type=Bearer&expires_in=3600
    var query=querystring.parse(url.parse(req_url).query);
    if(!query['access_token']) {
      throw new Error('authorization failed');
    } else {
      this.TOKEN=query['access_token'];
      this.TOKEN_EXPIRES=(new Date).valueOf+Number(query['expires_in']);
      query.time = (new Date).valueOf();
      this.keys=query;
    }
    fs.writeFileSync(this.getKeysPath(),JSON.stringify(this),{encoding:'utf8'});
    /*
    { access_token: 'ACCESS_TOKEN',
      token_type: 'Bearer',
      expires_in: '3600' 
    }
    */
    
  }
  getToken() {
    /*
    refresh_token	The refresh token returned from the authorization code exchange
    client_id	The client_id obtained during application registration
    client_secret	The client secret obtained during application registration
    grant_type refresh_token
    */

    var payload = {
      "refresh_token":"",
      "client_id":this.CLIENT_ID,
      "client_secret":this.CLIENT_SECRET,
      "grant_type":"refresh_token"
    };
    return this.post('https://api.imgur.com/oauth2/token', payload);
  }
}


const oauth2Client = new ImgurOAuth2Client(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);

if(typeof(keys)!='undefined') {
  oauthClient.keys=keys;
  oauthClient.TOKEN=keys['access_token'];
  console.log(oauthClient);
} else {
  authenticate();
} 
  



/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate (scopes) {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl();
    const server = http.createServer(async (req, res) => {
      try {
        if (~req.url.indexOf('/oauth2callback')) {
          if(~req.url.indexOf('access_token')) {
            oauth2Client.parseAuthCode(req.url);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const {tokens} = await oauth2Client.getToken(qs.code);
            oauth2Client.credentials = tokens;
            resolve(oauth2Client);
          } else {
            res.end(`
            <script>
            // First, parse the query string
            var params = {}, queryString = location.hash.substring(1),
                regex = /([^&=]+)=([^&]*)/g, m;
            while (m = regex.exec(queryString)) {
              params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            
            // And send the token over to the server
            var req = new XMLHttpRequest();
            // consider using POST so query isn't logged
            req.open('GET', 'https://' + window.location.host + '/catchtoken?' + queryString, true);
            
            req.onreadystatechange = function (e) {
              if (req.readyState == 4) {
                if(req.status == 200){
                  window.location = params['state']
              }
              else if(req.status == 400) {
                    alert('There was an error processing the token.')
                }
                else {
                  alert('something else other than 200 was returned')
                }
              }
            };
            req.send(null);
            </script>
            `);
          }
        }
      } catch (e) {
        reject(e);
      }
    }).listen(3000, () => {
      // open the browser to the authorize url to start the workflow
      opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
    });
    destroyer(server);
  });
}

async function runSample () {
  // retrieve user profile
  const res = await plus.people.get({ userId: 'me' });
  console.log(res.data);
}

authenticate()
  .then(client => runSample(client))
  .catch(console.error);