/*
 * Unittests für den Roboter
 */

import request from 'supertest';
import app from '../app.js'; // Importiere die App-Instanz

describe('Robot API', () => {
    it('should return the status of a robot', async () => {
        const response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });
});
