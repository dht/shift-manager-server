const dbTypicode = require('../dal/db.typicode');
const dbMongo = require('../dal/db.mongo');

async function seed() {
    await dbMongo.connect();

    let response;

    // users from typicode
    const users = await dbTypicode.users.get();

    const usersToSave = users.map((user) => {
        return {
            id: user.id,
            fullName: user.name,
            numOfActions: 15,
        };
    });

    response = await dbMongo.users.deleteMany();
    response = await dbMongo.users.createMany(usersToSave);
    console.log('done ->', true);
    process.exit();
}

seed();
