const lz = (num) => {
    return num < 10 ? `0${num}` : num;
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = lz(date.getDate());
    const month = lz(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

module.exports = {
    formatDate,
};
