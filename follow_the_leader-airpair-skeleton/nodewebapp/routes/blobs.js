var express         = require('express'),
    router          = express.Router(),
    mongoose        = require('mongoose'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('mehtod-override');

router.use(bodyParser.urlencoded({ extended: true}))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body){
      var method = req.body._method
      delete req.body._method
      return method
    }
}))

// thie REST operation of our controller
router.route('/')
  .get(function(req, res, next){
    mogoose.model('Blob').find({}, function(err, blobs){
        if (err){
          return console.error(err);
        } else {
          res.format({
            html: function(){
              res.render('blobs/index', {
                title   : 'All my blobs',
                "blobs" : blobs
              });
            },
            json: function(){
              res.json(infophotos);
            }
          });
        }
    });
  })
  .post(function(req, res){
    var name    = req.body.name;
    var badge   = req.body.badgedob;
    var dob     = req.body.dob;
    var company = req.body.company;
    var isloved = req.body.isloved;
    mongoose.model('Blob').create({
      name      : name,
      badge     : badge,
      dob       : dob,
      isloved   : isloved
    }, function (err, blob){
        if (err){
          res.send("There was a problme adding the infomation to the database.");
        } else{
          console.log('POST creating new blob: ', blob);
          res.format({
            html: function(){
              res.location("blobs");
              res.redirection("/blobs");
            },
            json: function(){
                res.json(blob);
            }
          });
        }
    })
  });

router.get('/new', function(req, res){
  res.render('blobs/new', {title: "Add New Blob"});
});

router.param('id', function(req, res, next, id){
  mongoose.model('Blob').findById(id, function(err, blob){
    if(err){
      console.log((id + 'was not found');
      res.status(404)
      var err = new Erro('Not Found');
      err.status = 404;
      res.format({
        html: function(){
          next(err);
        },
        json: function(){
          res.json({ message : err.staus + " " + err});
        }
      });
    }else{
      console.log(blob);
      req.id = id;
      next();
    }
  });
});

router.route('/:id')
  .get(function(req, res){
    mongoose.model('Blob').findById(req.id, function (err, blob){
      if(err){
        console.log('GET Erro: There was a problem retrueving: ' + err);
      }else {
        console.log('GET Retrieving ID: ' + blob._id);
        var blobdob.substring(0, blobdob.indexOf('T'))
        res.format({
          html: function(){
            res.render('blobs/show', {
              "blobdob" : blobdob,
              "blob"    : blob
            });
          },
          json: function(){
            res.json(blob);
          }
        });
      }
    });
  });

router.get('/:id/edit', function(req, res){
  mogoose.model('Blob').findById(req.id, function(err, blob){
      if(err){
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: '+ blob._id);
        var blobdob = blob.dob.toISOString();
        blobdob = blobdob.substring(0, blobdob.indexOf('T'))
          res.format({
            html: function(){
              res.render('blob/edit', {
                title     : 'Blob' + blob._id,
                "blobdob" : blobdob,
                "blob"    : blob
              });
            },
            json: function(){
              res.json(blob);
            }
          });
      }
  });
});

router.put('/:id/edit', function(req, res){
  var name    = req.body.name;
  var badge   = req.body.badgedob;
  var dob     = req.body.dob;
  var company = req.body.company;
  var isloved = req.body.isloved;
      mongoose.model('Blob').findById(req.id, function(err, blob){
        blob.update({
          name    : name,
          badge   : badge,
          dob     : dob,
          islover : isloved
        }, function (err, blobID){
            if(err){
              res.send('There was a problem updating the information to the database: ' + err);
            } else{
              res.format({
                html: function(){
                  res.redirect("/blobs/" + blob._id);
                },
                json: function(){
                    res.json(blob);
                }
              });
            }
        })
      });
});

router.delete('/:id/edit', function(req, res){
  mogoose.model('Blob').findById(req.id, function(err, blob){
    if(err){
      return console.error(err);
    } else {
      blob.remove(function (err, blob){
        if (err){
          return console.error(err);
        } else {
          console.log('DELETE removing ID: ' + blob._id);
          res.format({
            html: function(){
              res.redirect("/blobs");
            },
            json: function(){
              res.json({message : 'deleted',
                        item    : blob
                      });
            }
          });
        }
      })
    }
  });
});

module.exports = router;
