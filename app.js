var express = require('express');
var mongoose = require('mongoose');
var mermin = require('mermin');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var models = require('./models')(mongoose);
var app = express();

app.locals.title = 'Agile Tour Vilnius 2012';

var resources = new mermin({
  path: path.join(__dirname, '/public'),
  config: {
            'js' : {
                'potsdam' : [
                    '/js/jquery.js',
                    '/js/jquery.mobile.js',
                    '/js/highcharts.js'
                ]
            },
            'css' : {
                'potsdam' : [
                    '/css/jquery.mobile.css',
                    '/css/jquery.mobile.structure.css',
                    '/css/jquery.mobile.theme.css',
                    '/css/styles.css'
                ]
            }
          },
  merge: true,
  minify: false,
  name: 'resources',
  watch: true
});

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.compress());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'topsecret' }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(resources.middleware);
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.logger());

  mongoose.connect('mongodb://localhost/potsdam');
});

app.configure('production', function() {
  app.use(express.errorHandler());

  mongoose.connect(process.env.MONGOLAB_URI);
});

routes(app, models);

http.createServer(app).listen(app.get('port'));
