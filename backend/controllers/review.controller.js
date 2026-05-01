const prisma = require('../lib/prisma');

// Customer submits a review for a completed job
const submitReview = async (req, res) => {
    // Save rating and comment, update worker's average rating
};

// Fetch reviews for a specific worker
const getWorkerReviews = async (req, res) => {
    // Get all reviews for a workerId to display on their profile
};

module.exports = {
    submitReview,
    getWorkerReviews
};
