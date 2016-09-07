 var express = require('express'),
    stylus  = require('stylus'),
    nib = require('nib')

var app     = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to pug
app.set('view engine', 'pug');

app.locals.basedir = app.get('views');

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

var obj = require('./views/db.json');

// set the home page route
app.get('/', function (req, res) {
  res.render( 'index', obj );
})


app.get('/about', function (req, res) {
  res.render( 'about' );
})

app.get('/photography', function (req, res) {
  var projectName = req.params.projectName;

  res.locals.projectName = projectName;
  res.render( 'photography', obj );
})

app.get('/:projectName', function (req, res) {
  var projectName = req.params.projectName;

  res.locals.projectName = projectName;
  res.render( 'project', obj );
})

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});