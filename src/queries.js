var express = require('express');
var app = express();
var request = require("request");
var userDetails;
const port = process.env.PORT || 5000;

app.get('/api/', function(req, res) {
  res.json('default');
});

app.get("/api/genericGetCall", function(req, res, next) {

  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "SELECT " + req.query.getColumn + " FROM " + req.query.table + " WHERE " + req.query.compColumn + " = " + req.query.val + ";";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(result.rows)
      client.end();
    }
  });
});




app.get("/api/getAllAccInfo", function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "SELECT * FROM account WHERE acc_Email = " + req.query.email + ";";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(result.rows)
      client.end();
    }
  });
});

// Will update a value in the database with a string
app.get('/api/updateGenericString', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "UPDATE " + req.query.table + " SET " + req.query.generalCol + " = '" + req.query.newStringVal + "' WHERE " + req.query.compCol + " = " + req.query.compVal + ";";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});









// Will update a value in the database with a number value
app.post('/api/updateGenericNumber', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = 'UPDATE ' + req.query.table + ' SET ' + req.query.generalCol + ' = ' + req.query.newStringVal + ' WHERE ' + req.query.compCol + ' = ' + req.query.compVal + ';';
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});







app.post('/api/createAccount', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "INSERT INTO account(acc_firstName, acc_lastName, acc_email, acc_type) VALUES ('" + req.query.firstName + "','" + req.query.lastName + "','" + req.query.email + "'," +  req.query.accType + ');';
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});






app.post('/api/createCourse', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "INSERT INTO course(crs_name, crs_desc, crs_term) VALUES ('" + req.query.crsName + "','" + req.query.crsDesc + "','" +  req.query.crsTerm + "');";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});







app.post('/api/createNote', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "INSERT INTO note(note_rating, acc_id, note_text, sch_crs_sec_id) VALUES (" + req.query.rating + "," + req.query.accId + ",'" +  req.query.noteText + "', " + req.query.secID + ");";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});









app.get('/api/getNoteByUser', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "SELECT note_text FROM note WHERE acc_id = " + req.query.accId + ";";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});






app.get('/api/getNoteBySection', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "SELECT note_text FROM note WHERE sch_crs_sec_id = " + req.query.sch_crs_sec_id + ";";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});





app.get('/api/getNoteByAccAndSection', function(req, res, next) {
  var pg = require('pg');
  var conString = "postgres://AllNotes:Cs48001!@dbv2.cjmjfhlkhtzb.us-west-1.rds.amazonaws.com:5432/DBV2";
  var client = new pg.Client(conString);
  console.log("About to Connect!");
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
  });
  console.log("Connected!");
  var sql = "SELECT note_text FROM note WHERE sch_crs_sec_id = " + req.query.sch_crs_sec_id + " AND acc_id = " + req.query.accId + ";";
  console.log("Query being sent to the db" + sql);
  client.query(sql, function(err, result) {
    if (err) {
      console.log("error")
      reject(err);
      client.end();
    } else {
      console.log(result.rows)
      res.send(sql)
      client.end();
    }
  });
});



app.listen(port, () => console.log(`Listening on port 5000`))
