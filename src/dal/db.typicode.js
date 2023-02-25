const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
});

const users = {
    get: () => {
        return instance.get('/users').then((response) => {
            return response.data;
        });
    },
    getOne: (id) => {
        return instance.get(`/users/${id}`).then((response) => {
            return response.data;
        });
    },
    getByCredentials: (username, email) => {
        return instance
            .get(`/users?username=${username}&email=${email}`)
            .then((response) => {
                return response.data;
            });
    },
    getByEmail: (email) => {
        return instance.get(`/users?email=${email}`).then((response) => {
            return response.data;
        });
    },
};

module.exports = {
    users,
};
