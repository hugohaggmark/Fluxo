var express = require('express'),
    OAuth = require('oauth').OAuth,
    querystring = require('querystring'),
    session = require('cookie-session'),
    fluxoConfig = require('./fluxoConfig.js'),
    NodeCache = require("node-cache"),
    fluxoCache = new NodeCache({
        stdTTL: 300,
        checkperiod: 30
    });

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

app.get('/visualize', require_trello_login, function (req, res) {
    res.render("visualize");
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
        fluxoConfig.appUrl + "/trello_callback" + (req.query.action && req.query.action !== "" ? "?action=" + querystring.escape(req.query.action) : ""),
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

var getOAuth = function (req) {

    return new OAuth(req.session.oa._requestUrl,
        req.session.oa._accessUrl,
        req.session.oa._consumerKey,
        req.session.oa._consumerSecret,
        req.session.oa._version,
        req.session.oa._authorize_callback,
        req.session.oa._signatureMethod);
};

// Callback for the authorization page
app.get('/trello_callback', function (req, res) {

    // get the OAuth access token with the 'oauth_verifier' that we received

    var oa = getOAuth(req);

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

                res.redirect((req.query.action && req.query.action !== "") ? req.query.action : "/");
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

var getCacheKey = function (resourceUrl, oauth_access_token, oauth_access_token_secret) {
    return resourceUrl + "|" + oauth_access_token + "|" + oauth_access_token_secret;
};

var doTrelloRequest = function (resourceUrl, req, res) {
    var key = getCacheKey(resourceUrl, req.session.oauth_access_token, req.session.oauth_access_token_secret);
    var resource = fluxoCache.get(key);
    if (resource) {
        res.json(resource);
    } else {
        var oa = getOAuth(req);
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
                resource = JSON.parse(data);
                fluxoCache.set(key, resource);
                res.json(resource);
            });
    }
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

app.get("/api/lists/:listid", require_trello_login, function (req, res) {
    doTrelloRequest("https://trello.com/1/lists/" + req.params.listid + "/cards/?actions=updateCard:idList,createCard,copyCard,convertToCardFromCheckItem&filter=all&fields=name,labels,actions", req, res);
});

app.get("/api/cards/:cardid", require_trello_login, function (req, res) {
    doTrelloRequest("https://trello.com/1/cards/" + req.params.cardid + "/actions/?filter=createCard,updateCard:idList", req, res);
});

app.listen(fluxoConfig.appPort);
console.log("listening on port:" + fluxoConfig.appPort);
