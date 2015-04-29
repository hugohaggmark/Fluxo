var express = require('express'),
    fluxoConfig = require('./fluxoConfig.js'),
    app = express(),
    appPort = Number(process.env.PORT || 3000);

app.use('/', express.static('public', {
    index: "index.html"
}));

app.use('/static', express.static('static'));

var server = app.listen(appPort, function () {
    console.log('Fluxo listening at port:%s', appPort);
    console.log("fluxoConfig.appKey", fluxoConfig.appKey);
    console.log("fluxoConfig.appSecret", fluxoConfig.appSecret);
});
