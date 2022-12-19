function getDate() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
}

module.exports = getDate;
