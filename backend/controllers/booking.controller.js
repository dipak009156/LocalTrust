const prisma = require('../lib/prisma');

// Customer creates a new service request
const createBooking = async (req, res) => {
    // Save new booking with address, category, and pending status
};

// List bookings for the current user (Customer view or Worker view)
const getBookings = async (req, res) => {
    // Fetch all bookings related to req.user.id
};

// Get detailed info for a single booking
const getBookingById = async (req, res) => {
    // Return full booking details including status and related escrow
};

// Cancel a booking before it starts
const cancelBooking = async (req, res) => {
    // Update status to 'cancelled' and handle logic for refund/penalty
};

// Update booking status (Accept/Start/Complete)
const updateBookingStatus = async (req, res) => {
    // Transition booking through lifecycle: pending -> accepted -> in_progress -> completed
};

module.exports = { 
    createBooking, 
    getBookings, 
    getBookingById, 
    cancelBooking, 
    updateBookingStatus 
};
