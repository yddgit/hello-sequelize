const model = require('./model');

let
    Pet = model.Pet,
    User = model.User;

(async () => {
    var user = await User.create({
        name: 'John',
        gender: false,
        email: 'john-' + Date.now() + '@example.com',
        password: '123456'
    })
    console.log('created: ', JSON.stringify(user));
    var cat = await Pet.create({
        ownerId: user.id,
        name: 'mimi',
        gender: false,
        birth: '2020-07-21'
    });
    console.log('created: ', JSON.stringify(cat));
    var dog = await Pet.create({
        ownerId: user.id,
        name: 'wangwang',
        gender: false,
        birth: '2020-07-22'
    });
    console.log('created', JSON.stringify(dog));
})();
