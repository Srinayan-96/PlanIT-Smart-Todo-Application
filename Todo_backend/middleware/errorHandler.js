const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err);

    // Handle mongoose validation errors safely
    if (err.name === "ValidationError") {
        let messages = [];

        if (err.errors) {
            messages = Object.values(err.errors).map(e => e.message);
        } else if (err.message) {
            messages = [err.message];
        }

        return res.status(400).json({
            message: messages.join(", ") || "Validation failed"
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid task id"
        });
    }

    // For other errors
    res.status(err.statusCode || 500).json({
        message: err.message || "Server Error"
    });
};

module.exports = errorHandler;
