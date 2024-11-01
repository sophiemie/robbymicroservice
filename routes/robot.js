/*
 * Alle festgelegten Routen fuer den Roboter
 * 
 */

//const express = require('express'); // Bindet Express-Framework ein

import express from 'express'; // Importiert das Express-Framework
const router = express.Router(); // Erstellt eine Router Instanz, die fuer die Definierung von Routen verwendet wird

// Funktionen Importieren vom Controller
import {
    getStatus,
    move,
    pickUpItem,
    putDownItem,
    updateStatus,
    getActions,
    attackRobot
} from '../controller/robotController.js';

// API Endpunkte einmal aufgefuehrt und mit Controllerfunktion verknuepft
router.get('/:id/status', getStatus);

router.post('/:id/move', move);

router.post('/:id/pickup/:itemId', pickUpItem);

router.post('/:id/putdown/:itemId', putDownItem);

router.patch('/:id/state', updateStatus);

router.get('/:id/actions', getActions);

router.post('/:id/attack/:targetId', attackRobot);

// Router-Variable als public definieren
export default router;