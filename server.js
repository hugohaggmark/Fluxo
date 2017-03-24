const express = require('express'),
  app = express()

app.get("/", function (req, res) {
  res.writeHead(301, {Location:'https://fluxo.hugohaggmark.com'})
  res.end()
})

const port = Number(process.env.PORT || 5000)
app.listen(port);
console.log("listening on port:" + port);
