/*
 * Hauptprogramm vom Roboter
 * Sophie Miessner 5046830
 * HSB Bremen - Modul MKKS2
 * 
 */

const express = require('express'); // Laedt das Express Framework
const app = express(); // Erstellt eine Express Anwendung

console.log("Starting app.js");

// Route die auf / reagiert, also die Startseite localhost:port
// (req, res) => { ... } wird aufgerufen wenn jemand eine GET-Anfrage an die Route schickt
// req = Request, enthaelt alle Infos zur HTTP-Anfrage
// res = Response, schickt Antwort an den Client zurueck
app.get('/', (req, res) => { 
    res.send('Hello World!'); // Schickt den Text als Antwort an den Client
});

const port = 4000; // Port festlegen

// App.listen startet den Webserver
// Erster Parameter gibt an an welcher Port gestartet werden soll
// Zweiter Parameter ist eine Callback Funktion die aufgerufen wird, sobald der Server gestartet hat 
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});