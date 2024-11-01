/*
 * Logik der Funktionen vom Roboter
 *
 * 
 */

// Ein Objekt, welche zwei Roboter mit ihren Eigenschaften speichern
let robots = {
    1: { id: 1, position: { x: 0, y: 0 }, energy: 100, inventory: [], actions: [
        { type: "move", direction: "up", timestamp: Date.now() },
        { type: "pickup", itemId: 123, timestamp: Date.now() },
        { type: "move", direction: "up", timestamp: Date.now() },
        { type: "pickup", itemId: 13, timestamp: Date.now() },
        { type: "move", direction: "up", timestamp: Date.now() },
        { type: "pickup", itemId: 3, timestamp: Date.now() },
        { type: "move", direction: "up", timestamp: Date.now() },
        { type: "pickup", itemId: 1, timestamp: Date.now() }, ],},
    2: { id: 2, position: { x: 5, y: 5 }, energy: 80, inventory: [], actions: [] }
};


export const getStatus = (req, res) => {
    // Sucht einen Roboter anhand der ID aus URL Parameter mit Request
    const robot = robots[req.params.id]; 

    if (robot)
    {   // Gibt JSON als Status zurueck, Response
        res.json({
            ...robot,
            _links: {
                // Self = verweist auf den Status Endpunkt selber
                // Actions = Ermoeglicht die Pagination
                // Page und Size geben gewuenschte Seite und Anzahl der Ergebnisse pro Seite an
                self: { href: '/robot/${req.params.id}/status' },
                actions: { href: '/robot/${req.params.id}/actions?page=1&size=5' },
            },
        }); 
    }
    else
    {
        res.status(404).send('Robot not found');
    }
};

export const move = (req, res) => {
    // Sucht einen Roboter anhand der ID aus URL Parameter mit Request
    const robot = robots[req.params.id]; 

    if (robot)
    {
        const direction = req.body.direction; // Mit Request aktuelle Ausrichtung anfragen

        if (direction === 'up') robot.position.y += 1;
        else if (direction === 'down') robot.position.y -= 1;
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

export const pickUpItem = (req, res) => {
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

export const putDownItem = (req, res) => {
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

export const updateStatus = (req, res) => {
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

export const getActions = (req, res) => {
    const robot = robots[req.params.id];
    // Gewuenschte Seitenindex  vom Client
    const page = parseInt(req.query.page) || 1; 
    // Anzahl der Aktionen, falls kein Wert, wird es auf 5 gesetzt
    const size = parseInt(req.query.size) || 5; 
    // Gibt an bei welchem Element die Auflistung starten soll, bei Seite 2 z.B. Element 6
    const startIndex = (page - 1) * size; 
    // Bei welchem Element Auflistung enden soll
    const endIndex = startIndex + size; 
    // Liste der Aktionen die aufgefuehrt werden sollen
    const paginatedActions = robot.actions.slice(startIndex, endIndex);

    if (!robot)
    {
        res.status(404).send('Robot not found');
    }

    res.json({
        actions: paginatedActions, // Auflistung
        page, // Welche Seite
        size, // Wie viele Elemente
        totalActions: robot.actions.length, // Anzahl gesamte Aktionen 
        totalPages: Math.ceil(robot.actions.length / size), // Anzahl Gesamtseiten
        _links: {
            // Aktuelle Seite
            self: { 
                href: `/robot/${req.params.id}/actions?page=${page}&size=${size}` },
            // Naechste Seite mit Ueberpruefung ob eine naechste Seite vorhanden ist
            next: page * size < robot.actions.length ? { 
                href: `/robot/${req.params.id}/actions?page=${page + 1}&size=${size}` } : null,
            // Vorherige Seite, falls page groesser als 1 ist
            previous: page > 1 ? { 
                href: `/robot/${req.params.id}/actions?page=${page - 1}&size=${size}` } : null,
        },
    });

};

export const attackRobot = (req, res) => {
    const attacker = robots[req.params.id];
    const target = robots[req.params.targetId];

    if (attacker && target) {
        const damage = 10;

        // Hat der Angreifer genug Energie
        if (attacker.energy < 5) 
        {
            return res.status(400).send('Insufficient energy to perform attack');
        }

        // Reduziere Energie des Angreifers um 5
        attacker.energy -= 5;
        
        // Schaden am Zielroboter
        target.energy = Math.max(0, target.energy - damage); // Zielroboter kann nicht weniger als 0 Energie haben
        
        // Aktion zur Aktionsliste des Angreifers hinzufügen
        attacker.actions.push(`Attacked robot ${target.id}`);
        
        // Antwort senden
        res.json({ attacker, target });
    } 
    else 
    {
        res.status(404).send('Robot or Target not found');
    }
};



/* Funktionen als public definieren
module.exports = 
{
    getStatus,
    move,
    pickUpItem,
    putDownItem,
    updateStatus,
    getActions,
    attackRobot
}; */