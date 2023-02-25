const fs = require('fs-extra');
const { formatDate } = require('../utils/date');

const DB_PATH = './data-json/logs.json';

const logs = {
    add: (userId, requestVerb, requestEntity) => {
        const content = fs.readJsonSync(DB_PATH);
        const dateFormatted = formatDate(Date.now());

        content.logs.push({
            userId,
            requestVerb,
            requestEntity,
            date: dateFormatted,
        });

        fs.writeJsonSync(DB_PATH, content, {
            spaces: 4,
        });
    },
    getByUserForToday: (userId) => {
        const content = fs.readJsonSync(DB_PATH);

        const dateFormatted = formatDate(Date.now());

        return content.logs.filter((log) => {
            return log.userId === userId && log.date === dateFormatted;
        });
    },
};

module.exports = {
    logs,
};
