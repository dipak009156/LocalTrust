/**
 * validate(schema)
 * Zod request-body validation middleware factory.
 * Usage: router.post('/route', validate(mySchema), controller)
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return res.status(422).json({ message: 'Validation failed', errors });
    }
    req.body = result.data; // replace with parsed & coerced data
    next();
};

module.exports = validate;
