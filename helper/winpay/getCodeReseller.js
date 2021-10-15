function getCodeReseller() {
    const number = Math.floor(Math.random() * 10000);
    const change = String(number)
    switch (change.length) {
        case 1:
            return `LT000${change}`;
        case 2:
            return `LT00${change}`;
        case 3:
            return `LT0${change}`
        default:
            return `LT${change}`
    }
}


module.exports = { getCodeReseller }