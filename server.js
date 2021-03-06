// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
// =============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML directory
// =============================================================
const HTML_DIR = path.resolve(__dirname, "public");
const DB_DIR = path.resolve(__dirname, "db");
const indexPath = path.join(HTML_DIR, "index.html");
const notesPath = path.join(HTML_DIR, "notes.html");
const dbPath = path.join(DB_DIR, "db.json");
app.use(express.static("public"));

// HTML routes
// =============================================================
app.get("/", (req, res) => { res.sendFile(indexPath) });
app.get("/notes", (req, res) => { res.sendFile(notesPath) });


// API routes
// =============================================================
// Reading data from db.json and storing it as a variable:
let data = fs.readFileSync(dbPath, "utf8");
let savedNotes = JSON.parse(data);

// Returns all saved notes as json:
app.get("/api/notes", (req, res) => {
    return res.json(savedNotes);
})

// Receives a new note, adds it to the db.json and returns it to the client.
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    savedNotes.push(newNote)
    console.log(savedNotes);
    let newData = JSON.stringify(savedNotes, null, 2);
    fs.writeFile(dbPath, newData, (err) => { if (err) { throw err } });
    res.json(newData);
});

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    savedNotes = savedNotes.filter((note) => {
        if (note.id === id) { return false }
        else { return true }
    })
    console.log(savedNotes);
    // let newData = JSON.stringify(savedNotes, null, 2);
    // fs.writeFile(dbPath, newData, (err) => { if (err) { throw err } });
    // res.json(newData);
});

// Listener
// =============================================================
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
