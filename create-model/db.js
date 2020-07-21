const Sequelize = require('sequelize');

const uuid = require('node-uuid');

const config = require('./config');

console.log('init sequelize...');

function generateId() {
    return uuid.v4();
}

console.log('config: ' + JSON.stringify(config));

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes) {
    var attrs = {};
    for(let key in attributes) {
        let value = attributes[key];
        if(typeof value === 'object' && value['type']) {
            // 所有字段默认为NOT NULL
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    // 统一主键: id:STRING(50)
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    // 统一timestamp: createdAt, updatedAt, version
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    console.log('model defined for table: ', name, '\n', JSON.stringify(attrs, (k, v) => {
        if(k === 'type') {
            for(let key in Sequelize) {
                if(key === 'ABSTRACT' || key === 'NUMBER') {
                    continue;
                }
                let dbType = Sequelize[key];
                if(typeof dbType === 'function') {
                    if(v instanceof dbType) {
                        if(v._length) {
                            return `${dbType}(${v._length})`;
                        }
                    }
                    if(v === dbType) {
                        return dbType.key;
                    }
                }
            }
        }
        return v;
    }, '  '));
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        // sequelize在创建修改Entity时会调用我们指定的函数
        // 这些函数通过hooks在定义Model时设定
        // 在beforeValidate这个事件中根据isNewRecord设置主键、时间戳、版本号
        hooks: {
            beforeValidate: function(obj) {
                let now = Date.now();
                if(obj.isNewRecord) {
                    if(!obj.id) {
                        obj.id = generateId();
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    obj.updatedAt = Date.now();
                    obj.version ++;
                }
            }
        }
    });
}

const TYPES= ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
    defineModel: defineModel,
    sync: () => {
        // 只允许在非生产环境创建
        if(process.env.NODE_ENV !== 'production') {
            return sequelize.sync({ force: true });
        } else {
            throw new Error('Can not sync() when NODE_ENV is set to \'production\'.')
        }
    }
};

for(let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;