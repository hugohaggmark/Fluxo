var express = require('express'),
    app = express(),
    appPort = Number(process.env.PORT || 3000);

app.use('/', express.static('public', {
    index: "index.html"
}));

app.use('/static', express.static('static'));

var server = app.listen(appPort, function() {
    console.log('TrellBan listening at port:%s', appPort);
});
