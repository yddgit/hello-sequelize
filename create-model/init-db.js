require("babel-register");

const model = require('./model.js');

model.sync().then(() => {
    console.log('init db ok.');
    process.exit(0);
});
