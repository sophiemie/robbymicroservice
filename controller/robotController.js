/*
 * Logik der Funktionen vom Roboter
 *
 * 
 */

// Ein Objekt, welche zwei Roboter mit ihren Eigenschaften speichern
let robots = {
    1: { id: 1, position: { x: 0, y: 0 }, energy: 100, inventory: [], actions: [] },
    2: { id: 2, position: { x: 5, y: 5 }, energy: 80, inventory: [], actions: [] }
};


const getStatus = (req, res) => {
    // Sucht einen Roboter anhand der ID aus URL Parameter mit Request
    const robot = robots[req.params.id]; 

    if (robot)
    {   
        res.json(robot); // Gibt JSON als Status zurueck, Response
    }
    else
    {
        res.status(404).send('Robot not found');
    }
};

const move = (req, res) => {
    // Sucht einen Roboter anhand der ID aus URL Parameter mit Request
    const robot = robots[req.params.id]; 

    if (robot)
    {
        const direction = req.body.direction; // Mit Request aktuelle Ausrichtung anfragen

        if (direction === 'up') robot.position.y += 1;
        else if (direction === 'up') robot.position.y -= 1;
        else if (direction === 'right') robot.position.x += 1;
        else if (direction === 'left') robot.position.x -= 1;
        else return res.status(400).send('Invalid direction');

        // Im Parameter Aktionen speichern, dass Roboter bewegt wurde
        robot.actions.push('Moved ${direction}'); 
        res.json(robot); 
    }
    else // Kein Roboter gefunden
    {
        res.status(404).send('Robot not found');
    }
};

const pickUpItem = (req, res) => {
    const robot = robots[req.params.id];
    const itemID = robots[req.params.itemID];

    if (robot)
    {
        robot.inventory.push(itemID);
        robot.actions.push('Picked up Item $(itemID)');
        res.json(robot);
    }
    else
    {
        res.status(404).send('Robot not found');
    }
};

const putDownItem = (req, res) => {
    const robot = robots[req.params.id];
    const itemID = robots[req.params.itemID];

    if (robot)
    {
        const index = robot.inventory.indexOf(itemID);

        // Wenn Item in der Item Liste existiert
        if (index > -1)
        {
            robot.inventory.splice(index, 1); // Item aus der Liste entfernen
            robot.actions.push('Put down item $(itemID)');
            res.json(robot);
        }
    }
    else
    {
        res.status(404).send('Robot not found');
    }
};

const updateStatus = (req, res) => {
    const robot = robots[req.params.id];

    if (robot)
    {
        // Ueberpruefen ob ein Energy-Wert vorhanden ist
        // Wird auf undefined ueberprueft, da 0 auch ein valider Wert sein kann
        if (req.body.energy !== undefined) 
        {
            robot.energy = req.body.energy; // Energielevel auf neuen Wert setzen
            robot.actions.push('Updated energy to ${robot.energy}');
        }

        // Ueberprueft ob eine Position zurueckgegeben wurde
        // Hier wird nur einmal geprueft ob ein Position Objekt vorhanden ist
        if (req.body.position)
        {
            robot.position = req.body.position; // Aktualisiert die Position
            robot.actions.push('Updated position to ${JSON.stringify(robot.position)}');
        }

        res.json(robot); // Neue Werte in JSON schreiben
    }
    else
    {
        res.status(404).send('Robot not found');
    }
};

const getActions = (req, res) => {
    const robot = robots[req.params.id];

    if (robot)
    {
        res.json(robot.actions); // Aktionen schicken
    }
    else
    {
        res.status(404).send('Robot not found');
    }
};

const attackRobot = (req, res) => {
    const robot = robots[req.params.id];
    const target = robots[req.params.targetID];

    if (robot && target)
    {
        const damage = 10;
        attacker.energy -= 5;
        target.energy -= damage;
        attacker.actions.push('Attacked robot ${target.id}');
        res.json({ robot, target });
    }
    else
    {
        res.status(404).send('Robot or Target not found');
    }
};


// Funktionen als public definieren
module.exports = 
{
    getStatus,
    move,
    pickUpItem,
    putDownItem,
    updateStatus,
    getActions,
    attackRobot
};