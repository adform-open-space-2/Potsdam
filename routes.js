module.exports = function(app, models){
  app.get('/', function(req, res){
    res.render('index', {
        agenda: models.agenda
    });
  });

  app.get('/:presenter', function(req, res){
    var presentation;
    for (var i in models.agenda){
      var item = models.agenda[i];
      if (item.Url === req.params.presenter.toLowerCase()){
        presentation = item;
      }
    }

    res.render('presentation', {
      presentation: presentation
    });
  });

  app.post('/feedback', function(req, res){
    doWithUser(req, res, function(user){
      user.addFeedback(req.body);
    });

    res.redirect('/');
  });

  function doWithUser(req, res, callback){
    var uid = req.cookies.uid;
    if (typeof uid === 'undefined'){
      var user = new models.user;
      res.cookie('uid', user._id, { maxAge: 2419200000}); //4 weeks
      callback(user);
      user.save();
    }
    else{
      models.user.findById(uid, function(err, user){
        callback(user);
        user.save();
      });
    }
  }
};
