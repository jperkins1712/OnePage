"use strict";

/** @module project
 * A RESTful resource representing a software project
 * implementing the CRUD methods.
 */
module.exports = {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy
}

/** @function list
 * Sends a list of all classes as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
  db.all("SELECT * FROM classes", [], function(err, classes){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error")
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(classes));
  });
}

/** @function create
 * Creates a new class and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  var body = "";

  req.on("error", function(err){
    console.error(err);
    res.statusCode = 500;
    res.end("Server error");
  });

  req.on("data", function(data){
    body += data;
  });

  req.on("end", function() {
    var project = JSON.parse(body);
    db.run("INSERT INTO classes (name, description, imagepath) VALUES (?,?,?)",
      [classes.name, classes.description, classes.imagepath],
      function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Could not insert data into database");
          return;
        }
        res.statusCode = 200;
        res.end();
      }
    );
  });
}

/** @function read
 * Serves a specific class as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM classes WHERE id=?", [id], function(err, classes){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!project) {
      res.statusCode = 404;
      res.end("Project not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(project));
  });
}


/** @update
 * Updates a specific record with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  var body = "";

  req.on("error", function(err){
    console.error(err);
    res.statusCode = 500;
    res.end("Server error");
  });

  req.on("data", function(data){
    body += data;
  });

  req.on("end", function() {
    var project = JSON.parse(body);
    db.run("UPDATE classes SET name=?, description=?, imagepath=? WHERE id=?",
      [classes.name, classes.description, classes.imagepath, id],
      function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Could not update data in database");
          return;
        }
        res.statusCode = 200;
        res.end();
      }
    );
  });
}

/** @destroy
 * Removes the specified project from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM classes WHERE id=?", [id], function(err) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}
