const { z } = require('zod');

const phoneSchema = z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits');

const sendOtpSchema = z.object({
    phone: phoneSchema,
    role: z.enum(['USER', 'WORKER']), 
})

const verifyOtpSchema = z.object({
    phone: phoneSchema,
    otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
    role: z.enum(['USER', 'WORKER']), 
})

module.exports = {
    sendOtpSchema,
    verifyOtpSchema
}