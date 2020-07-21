const defaultConfig = './config-default.js';
const overrideConfig = './config-override.js';
const testConfig = './config-test.js';

const fs = require('fs');

var config = null;

if(process.env.NODE_ENVV === 'test') {
    // 如果是测试环境就读取config-test.js
    console.log(`Load ${testConfig}...`);
    config = require(testConfig);
} else {
    // 先读取config-default.js
    console.log(`Load ${defaultConfig}...`);
    config = require(defaultConfig);
    try {
        // 如果存在config-override.js就读取并覆盖default配置
        if(fs.statSync(overrideConfig).isFile()) {
            console.log(`Load ${overrideConfig}...`);
            config = Object.assign(config, require(overrideConfig));
        }
    } catch(err) {
        console.log(`Can not load ${overrideConfig}.`);
    }
}

module.exports = config;