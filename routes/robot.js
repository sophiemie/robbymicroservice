/*
 * Alle festgelegten Routen fuer den Roboter
 * 
 */

const express = require('express'); // Bindet Express-Framework ein
const router = express.Router(); // Erstellt eine Router Instanz, die fuer die Definierung von Routen verwendet wird

// Funktionen Importieren vom Controller
const {
    getStatus,
    move,
    pickUpItem,
    putDownItem,
    updateStatus,
    getActions,
    attackRobot
} = require('../controller/robotController');

// API Endpunkte einmal aufgefuehrt und mit Controllerfunktion verknuepft
router.get('/robot/:id/status', getStatus);

router.post('/robot/:id/move', move);

router.post('/robot/:id/pickup/:itemId', pickUpItem);

router.post('/robot/:id/putdown/:itemId', putDownItem);

router.patch('/robot/:id/state', updateStatus);

router.get('/robot/:id/actions', getActions);

router.post('/robot/:id/attack/:targetId', attackRobot);

// Router Variable als public definieren
module.exports = router;