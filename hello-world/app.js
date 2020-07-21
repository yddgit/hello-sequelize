// 使用sequelize需要做两件准备工作
// 1. 创建sequelize对象实例
// 2. 定义模型Pet, 告诉sequelize如何映射数据库表
const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000,
    }
});

// 用define定义Model时, 传入名称pet, 默认表名就是pets
// 第二个参数指定列名和数据类型
// 第三个参数是额外的配置
var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
}, {
    timestamps: false
})

var now = Date.now();

// 以下操作因为是异步的, 所以create数据的语句需要先单独执行

// 用Promise的方式写数据
/*
Pet.create({
    id: 'g-' + now,
    name: 'Gaffey',
    gender: false,
    birth: '2007-07-07',
    createdAt: now,
    updatedAt: now,
    version: 0
}).then(function(p) {
    console.log('created: ' + JSON.stringify(p));
}).catch(function(error) {
    console.log('failed' + error);
});
*/

// 用async的方式写数据
/*
(async ()=> {
    var dog = await Pet.create({
        id: 'd-' + now,
        name: '0die',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog));
})();
*/

// 查询数据
(async () => {
    var pets = await Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for(let p of pets) {
        console.log(JSON.stringify(p));
    }
})();

// 更新数据
(async () => {
    var pets = await Pet.findAll({
        where: {
            name: 'Gaffey'
        }
    });
    var p = pets[0];
    p.gender = true,
    p.updatedAt = Date.now();
    p.version ++;
    await p.save();
})();

// 删除数据
(async () => {
    var pets = await Pet.findAll({
        where: {
            name: '0die'
        }
    });
    await pets[0].destroy();
})();
