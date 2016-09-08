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

// function testFunctions(req, res, next) {
//   console.log("this is in testFunctions: "+app.locals.photoName);
//   // console.log(obj.photography.images.collection.fileName[app.locals.photoName]);
//   return next();
// }

// set the home page route
app.get('/', function (req, res) {
  res.render( 'index', obj );
})


app.get('/about', function (req, res) {
  res.render( 'about' );
})

app.get('/:projectName', function (req, res) {
  var projectName = req.params.projectName;
  var project     = (projectName == "photography") ? "photography" : "project";

  res.locals.projectName = projectName;

  // res.status(404).send('Sorry! This page does not exist. Try more random things!');
  // res.status(500).send({ error: 'Oh...oh wow. This never happens, I swear.' });

  res.render( project, obj );
})

app.get('/photography/:photoName', function(req, res, next) {
    app.locals.photoName = req.params.photoName;
    next();
  }, function (req, res) {
      for(var i = 0; i < obj.photography.images.collection.length; i++) {
        if(obj.photography.images.collection[i].fileName == app.locals.photoName){
          app.locals.photoTitle = obj.photography.images.collection[i].title
        }
      }
    console.log(app.locals.photoTitle);
    res.render( "photography", obj );
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});