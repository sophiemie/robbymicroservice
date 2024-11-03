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
    
    // Finde Roboter 1 mit einer ID
    it('should return the status of a robot', async () => {
        const response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    // Finde keinen Roboter 0
    it('should return a missing robot', async () => {
        const response = await request(app).get('/robot/0/status');
        expect(response.status).toBe(404);
    });

    // Finde Roboter 1 mit einem Array von Aktionen
    it('should return an array with actions', async () => {
        const response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('actions'); // Pruefe, ob eine Ausrichtung vorhanden ist
        expect(Array.isArray(response.body.actions)).toBe(true);
    });

    // Finde Roboter 1 mit 8 Aktionen
    it('should return robot 1 with 8 actions', async () => {
        const response = await request(app).get('/robot/1/status');
        expect(response.body.actions.length).toBe(8);
    });

    // Finde Roboter 2 mit Energy von 80
    it('should return robot 2 with 80 energy', async () => {
        const response = await request(app).get('/robot/2/status');
        expect(response.body.energy).toBe(80);
    });


    // Finde Roboter 1 mit 4 Items
    it('should return robot 1 with 4 items', async () => {
        const response = await request(app).get('/robot/1/status');
        expect(response.body.inventory.length).toBe(4);
    });


    // Roboter 2 nach oben bewegen und dann neue Position abfragen
    it('should return new position of robot 2 after moving', async () => {
        let response = await request(app).get('/robot/2/status');
        expect(response.status).toBe(200);
        const initialPosition = response.body.position;
    
        response = await request(app).post('/robot/2/move').send({ direction: 'up' });
        response = await request(app).get('/robot/2/status');
        const newPosition = response.body.position;
    
        expect(newPosition.x).toBe(initialPosition.x); // x = 5
        expect(newPosition.y).toBe(initialPosition.y + 1); // y = 5+1
    });
    

    // Roboter 1 mit x = 0 und y = 0 nach links bewegen und selbe Position beibehalten
    it('should return same position of robot 1 after moving', async () => {
        let response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
        const initialPosition = response.body.position;

        response = await request(app).post('/robot/1/move').send({ direction: 'left' });
        response = await request(app).get('/robot/1/status');
        const newPosition = response.body.position;
    
        expect(newPosition.x).toBe(initialPosition.x); // x = 0
        expect(newPosition.y).toBe(initialPosition.y); // y = 0
    });


    // Roboter 2 nimmt ein Item auf
    it('should return one item in inventory in robot 2 after picking up an item', async () => {
        let response = await request(app).get('/robot/2/status');
        expect(response.status).toBe(200);
        const initialInventory = response.body.inventory; 

        response = await request(app).post('/robot/2/pickup/2').send();
        response = await request(app).get('/robot/2/status');
        const newInventory = response.body.inventory;

        expect(newInventory.length).toBe(initialInventory.length +1);
    });


    // Roboter 1 nimmt ein Item was bereits im Inventar ist auf
    it('should return 400 when trying to pick up an item that is already in inventory', async () => {
        let response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
    
        await request(app).post('/robot/1/pickup/1').send(); 
        // Versuche nun, das gleiche Item erneut aufzunehmen
        response = await request(app).post('/robot/1/pickup/1').send();
        expect(response.status).toBe(400);
    });  


    // Roboter 1 legt ein Item ab
    it('should have one less item in inventory after putting down an item', async () => {
        let response = await request(app).get('/robot/1/status');
        expect(response.status).toBe(200);
        const initialInventory = response.body.inventory; 

        response = await request(app).post('/robot/1/putdown/1').send();
        response = await request(app).get('/robot/1/status');
        const newInventory = response.body.inventory;

        expect(newInventory.length).toBe(initialInventory.length -1);
    });    

    // Roboter 2 legt nicht vorhandenes Item ab
    it('should return 400 when putdown an item when inventory is empty', async () => {
        let response = await request(app).get('/robot/2/status');
        expect(response.status).toBe(200);
    
        await request(app).post('/robot/2/putdown/1').send(); 
        // Versuche nun, das gleiche Item erneut aufzunehmen
        response = await request(app).post('/robot/2/putdown/1').send();
        expect(response.status).toBe(400);
    });  

    // Roboter 2 bekommt eine Aktion mehr
    it('should update the status of the robot', async () => {
        let response = await request(app).get('/robot/2/status');
        expect(response.status).toBe(200);
        const initialActions = response.body.actions.length;

        response = await request(app).post('/robot/2/move').send({ direction: 'right' });

        await request(app).patch('/robot/2/state').send();
        expect(response.body.actions.length).toBe(initialActions +1);
    });   
    
    // Roboter 2 attackiert Roboter 1
    it('should let robot 2 attack robot 1', async () => {
        let response = await request(app).get('/robot/2/status');
        const initialEnergyRobot2 = response.body.energy;
        response = await request(app).get('/robot/1/status');
        const initialEnergyRobot1 = response.body.energy;

        response = await request(app).post('/robot/2/attack/1').send();
        response = await request(app).get('/robot/1/status');
        const newEnergyRobot1 = response.body.energy;
        response = await request(app).get('/robot/2/status');
        const newEnergyRobot2 = response.body.energy;
        
        expect(newEnergyRobot1).toBe(initialEnergyRobot1 -10);
        expect(newEnergyRobot2).toBe(initialEnergyRobot2 -5);
    }); 
    
        
});


describe('GET /robot/:id/actions', () => {
    it('should return one page with 5 entries', async () => {
        const response = await request(app).get('/robot/1/actions?page=1&size=5');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('actions');
        expect(response.body.page).toBe(1);
        expect(response.body.size).toBe(5);
    });

    it('should return one action on page 3', async () => {
        const response = await request(app).get('/robot/1/actions?page=3&size=5');
        expect(response.status).toBe(200);
        expect(response.body.actions.length).toBe(1);
        expect(response.body.page).toBe(3);
    });

    it('should return 404 for a non-existent robot', async () => {
        const response = await request(app).get('/robot/999/actions');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Robot not found');
    });

    it('should return the correct pagination links', async () => {
        const response = await request(app).get('/robot/1/actions?page=3&size=5');
        expect(response.body._links.next).toBe(null); // Keine nächste Seite auf der zweiten Seite
    });
});
