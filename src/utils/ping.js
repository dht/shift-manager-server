const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3001',
});

const run = async () => {
    let response;
    // try login

    try {
        response = await instance.post('/login', {
            username: 'Bret',
            email: 'Sincere@april.biz',
        });

        console.log(response.data);
    } catch (err) {
        console.log('err ->', err.response.data);
    }

    const { token } = response.data;

    // try get users
    try {
        response = await instance.get('/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (err) {
        console.log('err ->', err.response.data);
    }
};

run();
