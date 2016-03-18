
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});
//////////////////////////////////////////////////////////////////////////////////////////
app.get('/',function(req,res,next){
  var context = {};
  context.dataRows = [];
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
  
  context.dataRows = rows
    
    res.render('home', context);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////
app.get('/insert',function(req,res,next){
  var context = {};
  pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES" +  
  "(?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  
  var context = {};
  context.dataRows = [];
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
  
  context.dataRows = rows
    
    res.render('home', context);
  });
  
});
///////////////////////////////////////////////////////////////////////////////////////////
app.get('/delete',function(req,res,next){
  var context = {};
  pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  
  context.dataRows = [];
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
  
  context.dataRows = rows
    
    res.render('home', context);
  });
  
});
//////////////////////////////////////////////////////////////////////////////////////////
app.get('/edit', function(req, res, next){
  
  var context = {};
  context.dataRows = [];
  pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
  
  context = result;
    
  res.render('edit', context);
  });
  
});
//////////////////////////////////////////////////////////////////////////////////////////
app.get('/safe-update',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.querylbs || curvals.lbs, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
      });
      
     }
      
    });
    
  var context = {};
  context.dataRows = [];
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
  
    context.dataRows = rows
    
    res.render('home', context);
  });
    
});
/////////////////////////////////////////////////////////////////////////////////////////
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});






// app.get('/',function(req,res){
//   res.render('home.handlebars') //We can omit the .handlebars extension as we do below
// });

/*app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});*/







app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

