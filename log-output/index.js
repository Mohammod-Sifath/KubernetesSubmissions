const { v4: uuidv4 } = require('uuid');

const id = uuidv4();

setInterval(() => {
    const now = new Date().toISOString();
    console.log(`${now}: ${id}`);
}, 5000);
