var express = require('express');
var ejs = require('ejs');

var app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('home');
});

app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("Serving app on port 3000...")
});
