/*
 * Unittests für den Roboter
 */

import request from 'supertest';
import app from '../app.js'; // Importiere die App-Instanz

/*
 * descripe: Logische Gruppe von Tests definieren
 * it (): beschreibt einen einzelnen Testfall
 * response: Speicher Ergebnis mit simulierte app.js 
 * await: asynchron da auf Antwort gewartet werden muss bevor Code weiter laeuft
 * expect: welches Ergebnis wird erwartet
 */


describe('Robot API', () => {
    
    it('should return the status of a robot', async () => {
        const response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });



    it('should return the name of the robot', async () => {
        const response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name'); // Überprüfen, ob der Name vorhanden ist
        expect(typeof response.body.name).toBe('string'); // Überprüfen, ob der Name ein String ist
    });

});
