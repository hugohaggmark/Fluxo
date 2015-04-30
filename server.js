var express = require('express'),
    OAuth = require('oauth').OAuth,
    querystring = require('querystring'),
    session = require('cookie-session'),
    fluxoConfig = require('./fluxoConfig.js');

var app = express();

app.set('trust proxy', 1);
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.use(session({
    name: "fluxo",
    secret: "skjghskdjfasjdkiismmajjshbqigohqdiouk",
    maxAge: 30 * 24 * 60 * 60 * 1000
}));

app.use('/static', express.static('static'));

app.get('/', require_trello_login, function (req, res) {
    res.render("index");
});

app.get('/demo', function (req, res) {
    res.sendFile(__dirname + "/static/demo/index.html");
});

// Request an OAuth Request Token, and redirects the user to authorize it
app.get('/trello_login', function (req, res) {

    var getRequestTokenUrl = "https://trello.com/1/OAuthGetRequestToken";
    var accessURL = "https://trello.com/1/OAuthGetAccessToken";
    var authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";

    var oa = new OAuth(getRequestTokenUrl,
        accessURL,
        fluxoConfig.appKey,
        fluxoConfig.appSecret,
        "1.0",
        "http://localhost:3000/trello_callback" + (req.params.action && req.params.action !== "" ? "?action=" + querystring.escape(req.params.action) : ""),
        "HMAC-SHA1");

    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log('getOAuthRequestToken error:', error);
        } else {
            // store the tokens in the session
            req.session.oa = oa;
            req.session.oauth_token = oauth_token;
            req.session.oauth_token_secret = oauth_token_secret;

            // redirect the user to authorize the token
            res.redirect(authorizeURL + "?oauth_token=" + oauth_token + "&name=" + fluxoConfig.appName);
        }
    });

});

// Callback for the authorization page
app.get('/trello_callback', function (req, res) {

    // get the OAuth access token with the 'oauth_verifier' that we received

    var oa = new OAuth(req.session.oa._requestUrl,
        req.session.oa._accessUrl,
        req.session.oa._consumerKey,
        req.session.oa._consumerSecret,
        req.session.oa._version,
        req.session.oa._authorize_callback,
        req.session.oa._signatureMethod);

    oa.getOAuthAccessToken(
        req.session.oauth_token,
        req.session.oauth_token_secret,
        req.query.oauth_verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results2) {

            if (error) {
                console.log('getOAuthAccessToken error:', error);
            } else {

                // store the access token in the session
                req.session.oauth_access_token = oauth_access_token;
                req.session.oauth_access_token_secret = oauth_access_token_secret;

                res.redirect((req.params.action && req.params.action !== "") ? req.params.action : "/");
            }
        });
});

function require_trello_login(req, res, next) {
    if (!req.session.oauth_access_token) {
        res.redirect("/trello_login?action=" + querystring.escape(req.originalUrl));
        return;
    }
    next();
}

var doTrelloRequest = function (resourceUrl, req, res) {
    var oa = new OAuth(req.session.oa._requestUrl,
        req.session.oa._accessUrl,
        req.session.oa._consumerKey,
        req.session.oa._consumerSecret,
        req.session.oa._version,
        req.session.oa._authorize_callback,
        req.session.oa._signatureMethod);

    oa.getProtectedResource(
        resourceUrl,
        "GET",
        req.session.oauth_access_token,
        req.session.oauth_access_token_secret,
        function (error, data, response) {
            if (error) {
                res.status(error.statusCode).json(error).end();
                return;
            }
            res.json(JSON.parse(data));
        });
};

app.get("/api/me", require_trello_login, function (req, res) {
    doTrelloRequest("https://api.trello.com/1/members/me", req, res);
});

app.get("/api/my/boards", require_trello_login, function (req, res) {
    doTrelloRequest("https://trello.com/1/members/my/boards", req, res);
});

app.get("/api/boards/:boardid/lists", require_trello_login, function (req, res) {
    doTrelloRequest("https://trello.com/1/boards/" + req.params.boardid + "/lists", req, res);
});

/*
app.get('/google_contacts', require_trello_login, function (req, res) {
    var oa = new OAuth(req.session.oa._requestUrl,
        req.session.oa._accessUrl,
        req.session.oa._consumerKey,
        req.session.oa._consumerSecret,
        req.session.oa._version,
        req.session.oa._authorize_callback,
        req.session.oa._signatureMethod);

    console.log(oa);

    // Example using GData API v3
    // GData Specific Header
    oa._headers['GData-Version'] = '3.0';

    oa.getProtectedResource(
        "https://www.google.com/m8/feeds/contacts/default/full?alt=json",
        "GET",
        req.session.oauth_access_token,
        req.session.oauth_access_token_secret,
        function (error, data, response) {

            var feed = JSON.parse(data);

            res.render('google_contacts.ejs', {
                locals: {
                    feed: feed
                }
            });
        });

});

app.get('/google_calendars', require_trello_login, function (req, res) {
    var oa = new OAuth(req.session.oa._requestUrl,
        req.session.oa._accessUrl,
        req.session.oa._consumerKey,
        req.session.oa._consumerSecret,
        req.session.oa._version,
        req.session.oa._authorize_callback,
        req.session.oa._signatureMethod);
    // Example using GData API v2
    // GData Specific Header
    oa._headers['GData-Version'] = '2';

    oa.getProtectedResource(
        "https://www.google.com/calendar/feeds/default/allcalendars/full?alt=jsonc",
        "GET",
        req.session.oauth_access_token,
        req.session.oauth_access_token_secret,
        function (error, data, response) {

            var feed = JSON.parse(data);

            res.render('google_calendars.ejs', {
                locals: {
                    feed: feed
                }
            });
        });

});
*/
app.listen(fluxoConfig.appPort);
console.log("listening on port:" + fluxoConfig.appPort);


// var express = require('express'),
//     fluxoConfig = require('./fluxoConfig.js'),
//     app = express(),
//     appPort = Number(process.env.PORT || 3000),
//     session = require('cookie-session'),
//     appName = "Fluxo",
//     domain = "localhost",
//     loginCallback = "http://" + domain + ":" + appPort + "/cb",
//     oauth_secrets = {},
//     port,
//     http = require('http'),
//     OAuth = require('oauth').OAuth,
//     url = require('url'),
//     requestURL = "https://trello.com/1/OAuthGetRequestToken",
//     accessURL = "https://trello.com/1/OAuthGetAccessToken",
//     authorizeURL = "https://trello.com/1/OAuthAuthorizeToken",
//     oauth = new OAuth(requestURL, accessURL, fluxoConfig.appKey, fluxoConfig.appSecret, "1.0", loginCallback, "HMAC-SHA1");

// // var Trello = require("node-trello");
// // var t = new Trello(fluxoConfig.appKey, null);

// // t.get("/1/members/me", function (err, data) {
// //     if (err) throw err;
// //     console.log(data);
// // });

// // var trello = new Trello(fluxoConfig.appKey, fluxoConfig.appKey, "api/loggedin", "Fluxo");
// // trello.getRequestToken(function (err, oauth) {
// //     console.log("err", err);
// //     console.log("oauth", oauth);
// // });
// // // trello.get("/1/members/me", function (err, data) {
// // //     if (err) throw err;
// // //     console.log(data);
// // // });

// // app.use('/', express.static('public', {
// //     index: "index.html"
// // }));

// // app.use('/static', express.static('static'));

// app.set('trust proxy', 1);

// app.use(session({
//     name: "fluxo",
//     secret: "skjghskdjfasjdkiismmajjshbqigohqdiouk",
//     maxAge: 30 * 24 * 60 * 60 * 1000
// }));

// var server = app.listen(appPort, function () {
//     console.log('Fluxo listening at port:%s', appPort);
// });

// var ensureAuthenticated = function (req, res, next) {
//     if (!req.session.trello_access_token) {
//         res.redirect("https://trello.com/1/authorize?key=" + fluxoConfig.appKey + "&name=Fluxo&expiration=30days&response_type=token");
//     } else {
//         res.redirect("index.html");
//     }
// };

// app.get("/", function (req, res) {
//     return oauth.getOAuthRequestToken((function (_this) {
//         return function (error, token, tokenSecret, results) {
//             console.log(JSON.stringify(req.session));
//             req.session.trello = tokenSecret;
//             res.writeHead(302, {
//                 'Location': authorizeURL + "?oauth_token=" + token + "&name=" + appName
//             });
//             return res.end();
//         };
//     })(this));
// });


// app.get("/cb", function (req, res) {
//     var query, token, tokenSecret, verifier;
//     query = url.parse(req.url, true).query;
//     token = query.oauth_token;
//     tokenSecret = req.session.trello_access_token[token];
//     verifier = query.oauth_verifier;
//     return oauth.getOAuthAccessToken(token, tokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
//         return oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, function (error, data, response) {
//             return res.redirect("index.html");
//         });
//     });
// });
