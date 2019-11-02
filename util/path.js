// This file is created to provide the path to this projects so this can run on any machine (OS)without applying any path logic.

const path = require('path');

module.exports = path.dirname(process.mainModule.filename);

// process.mainModule.filename gives the file name which is responsible to start this application.
