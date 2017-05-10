const fs = require('fs');
const path = require('path');

const app = require('./src/app');


const configPath = path.resolve(__dirname, 'config.json');
const config = fs.readFileSync(configPath, 'utf8');

app(JSON.parse(config));
