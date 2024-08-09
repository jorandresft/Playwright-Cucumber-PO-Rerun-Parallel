const fs = require ("fs-extra");

try {
    fs.ensureDir("test-results");
    fs.emtyDir("test-results");
} catch (error) {
    console.log ("Folder not created!" + error);
}