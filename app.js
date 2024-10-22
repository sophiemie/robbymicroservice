const express = require('express');
const app = express();

console.log("Starting app.js");

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
