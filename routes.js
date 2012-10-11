module.exports = function(app, models) {
  app.get('/', function(req, res) {
    getUser(req, res, function(user) {
      res.render('index', {
        agenda: models.agenda,
        user: user
      });
    });
  });

  app.get('/about', function(req, res) {
    res.redirect('http://www.agileturas.lt/');
  });


  app.get('/dashboard', function(req, res){
    getRatingCounts(function(ratings){

      var categorysData = [];
      var seriesData = [];

      for(category in ratings)
      {
        if(ratings.hasOwnProperty(category))
        {
          categorysData.push(category);
          seriesData.push(ratings[category]);
        }
      }

      res.render('dashboard', {
        categorysData : JSON.stringify(categorysData),
        seriesData : JSON.stringify(seriesData)
      });

    });
  });

  app.post('/personal', function(req, res) {
    getUser(req, res, function(user) {
      user.name = req.body.name;
      user.surname = req.body.surname;
      user.company = req.body.company;
      user.email = req.body.email;

      user.recommend = req.body.recommend;
      user.attend = req.body.attend;
      user.registered = req.body.registered;

      user.source = req.body.source;
      user.responsibility = req.body.responsibility;

      user.save();
      res.redirect('/');
    });
  });

  app.get('/versions', function(req, res) {
    res.render('versions');
  });

  app.get('/:presenter', function(req, res) {
    var presentation = models.agenda.filter(function(element) {
      return element.Url === req.params.presenter.toLowerCase();
    })[0];

    if (presentation) {
      getUser(req, res, function(user) {
        res.render('presentation', {
          presentation: presentation,
          feedback: user.getFeedback(presentation.Url) || {}
        });
      });
    }
    else {
      res.redirect('/');
    }
  });

  app.post('/feedback', function(req, res) {
    getUser(req, res, function(user) {
      user.addFeedback(req.body);
      user.save();
      res.redirect('/');
    });
  });

  function getUser(req, res, callback) {
    var uid = req.cookies.uid;
    if (uid) {
      models.User.findById(uid, function(err, user) {
        if (user) {
          callback(user);
        }
        else {
          createUser(req, res, callback);
        }
      });
    }
    else {
      createUser(req, res, callback);
    }
  }

  function getRatingCounts(callback)  {    
    models.User.find(function (err, users) {
      var ratingCounts = {};
      users.forEach(function(user, index) {
        //console.log("user: " + JSON.stringify(user));
        user.feedbacks.forEach(function (feedback, index) {
          if (!ratingCounts[feedback.rating])
            ratingCounts[feedback.rating] = 1;
          else
            ratingCounts[feedback.rating]++;
        });
      });
      callback(ratingCounts);
      //console.log(JSON.stringify(ratingCounts));
    });
  }

  function createUser(req, res, callback) {
    var user = new models.User();
    callback(user);
    res.cookie('uid', user._id, { maxAge: 2419200000}); //4 weeks
  }
};
