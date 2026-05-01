
exports.formatResponse = (status, message, data = null, meta = {}) => {
    return {
        status,
        message,
        data,
        // Include ISO timestamp in the response
        meta: { ...meta, timestamp: new Date().toISOString() }
    };
};

