/*
 * Hauptprogramm vom Roboter
 * Sophie Miessner 5046830
 * HSB Bremen - Modul MKKS2
 * 
 */

const express = require('express'); // Laedt das Express Framework
const app = express(); // Erstellt eine Express Anwendung
const robotRoutes = require('./routes/robot'); // Import der Roboter Routen

// Um JSON-Anfragen zu verarbeiten
app.use(express.json()); 

// Verwende die Roboter-Routen
// /api = alle Routen von robot.js sind unter /api/ erreichbar z.B. GET /api/robot/:id/status
// (req, res) => { ... } wird aufgerufen wenn jemand eine GET-Anfrage an die Route schickt
// req = Request, enthaelt alle Infos zur HTTP-Anfrage
// res = Response, schickt Antwort an den Client zurueck
app.use('/api', robotRoutes);

const port = 4000; // Port festlegen

// App.listen startet den Webserver
// Erster Parameter gibt an an welcher Port gestartet werden soll
// Zweiter Parameter ist eine Callback Funktion die aufgerufen wird, sobald der Server gestartet hat 
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});