const bcrypt = require('bcrypt');
const logger = require('./logger');

async function genHashPass(plainPassword) {
    try {
        const hash = await bcrypt.hash(plainPassword, 10);
        return hash;
    } catch (error) {
        logger.error('Error in genHashPass:', error);
        throw error;
    }
}

async function compareHashPass(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        logger.error('Error in compareHashPass:', error);
        throw error;
    }
}

module.exports = {
    genHashPass,
    compareHashPass
};