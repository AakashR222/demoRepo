const crypto = require('crypto');
const generateString = ()=>{
        return crypto.randomBytes(48).toString('hex');
}

module.exports = {
    generateString
}