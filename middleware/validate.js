const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body); // Update req.body with coerced/validated values
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.log("Validation Error Caught:", err); // Debug log
            console.log("err.errors:", err.errors);     // Debug log
            console.log("err.issues:", err.issues);     // Debug log

            const errors = err.errors || err.issues || [];

            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        next(err);
    }
};

module.exports = validate;
