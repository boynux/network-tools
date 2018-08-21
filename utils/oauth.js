'use strict';

const { Issuer } = require('openid-client');
const secureCookieName = 'session';

function OAuth(discovery, client_id, client_secret) {
  if (!(this instanceof OAuth)) {
    return new OAuth(discovery, client_id, client_secret);
  }

  this.discovery = discovery;
  this.client_id = client_id;
  this.client_secret = client_secret;

  this.client = this.getClient(discovery, client_id, client_secret);
}

OAuth.prototype.getClient = async function(discovery, client_id, client_secret) {
    let issuer = await Issuer.discover(discovery); // => Promise

    let oidcClient = new issuer.Client({
      client_id: client_id,
      client_secret: client_secret
    });

    return oidcClient;
  }

 OAuth.prototype.authenticate = function(options = {}) {

    return {options}, async (req, res, next) => {
      let token = req.cookies[secureCookieName];

      let client = await this.client;

      client.userinfo(token) // => Promise
        .then(function (userinfo) {

          return next();
        }).catch((err) => {
          var redirectUrl = client.authorizationUrl({
            redirect_uri: 'http://localhost:3000/callback',
            scope: 'openid email network',
          });

          res.redirect(redirectUrl);
        });
    }
  }

OAuth.prototype.callback = function(callbackUrl, options = {}) {
    return {callbackUrl, options}, async (req, res, next) => {
      let client = await this.client;
      var redirectUrl = client.authorizationUrl({
        redirect_uri: callbackUrl,
        scope: 'openid email network',
      });

      client.authorizationCallback(callbackUrl, req.query) // => Promise
        .then(function (tokenSet) {
          res.cookie(secureCookieName, tokenSet.access_token, {
            httpOnly: true,
          });

          next();
        }).catch( (err) => {;
          console.log(err);

          next();
        });
    }
  }

module.exports = OAuth;
