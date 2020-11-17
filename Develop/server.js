// * Create a basic server using Express.JS
// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const notesdb = require("./db/db.json");


// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// * GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


// Displays read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
  return res.json(notesdb);
});

 // fs.readFile('./db/db.json', (err, data) => {
  //   if (err) throw err;
  //   const getNoteDb = JSON.parse(data);
  //   console.log(getNoteDb);
  //   res.json(getNoteDb);
  // });


// Create New Notes - takes in JSON input, create an unique ID
app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  const newNote = req.body;
  newNote.id = new Date().getTime().toString();
  console.log(newNote);
  notesdb.push(newNote);
  fs.writeFile('./db/db.json', JSON.stringify(notesdb), (err) => {
    if (err) throw err;
    res.json(newNote);
  });
});


// Delete notes
app.delete("/api/notes/:id", function (req, res) {
  const id = req.params.id;

  const index = notesdb.findIndex(function (note) {
    return note.id === id;
  })
  if (index !== -1) {
    notesdb.splice(index, 1)
  }
  fs.writeFileSync('./db/db.json', JSON.stringify(notesdb));
  return res.json(id);

});


app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


// Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

//   http://localhost:3000


