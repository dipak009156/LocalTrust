const prisma = require('../lib/prisma');

// Customer raises a dispute for a booking
const raiseDispute = async (req, res) => {
    // Record dispute reason and freeze escrow payment
};

// Worker responds to an active dispute
const respondToDispute = async (req, res) => {
    // Save worker's side of the story/evidence
};

// Get dispute details
const getDisputeById = async (req, res) => {
    // Fetch dispute info, evidence, and current outcome status
};

module.exports = {
    raiseDispute,
    respondToDispute,
    getDisputeById
};
