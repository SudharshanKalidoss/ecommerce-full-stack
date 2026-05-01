exports.STATUS_CODES = {

    OK: { code: 200, message: "OK" }, // General success
    CREATED: { code: 201, message: "Resource created successfully" },
    ACCEPTED: { code: 202, message: "Request accepted for processing" },
    NO_CONTENT: { code: 204, message: "No content available" }, // Successful request but no data to return

  
    BAD_REQUEST: { code: 400, message: "Bad request: Invalid parameters" },
    UNAUTHORIZED: { code: 401, message: "Unauthorized: Authentication required" },
    FORBIDDEN: { code: 403, message: "Forbidden: You do not have permission to access this resource" },
    NOT_FOUND: { code: 404, message: "Resource not found" },
    METHOD_NOT_ALLOWED: { code: 405, message: "Method not allowed" },
    CONFLICT: { code: 409, message: "Conflict: Data already exists" },
    PAYLOAD_TOO_LARGE: { code: 413, message: "Payload too large" },
    UNSUPPORTED_MEDIA_TYPE: { code: 415, message: "Unsupported media type" },
    UNPROCESSABLE_ENTITY: { code: 422, message: "Validation error: Unprocessable request" },
    TOO_MANY_REQUESTS: { code: 429, message: "Too many requests: Slow down" },

 
    INTERNAL_SERVER_ERROR: { code: 500, message: "Internal server error. Please try again later" },
    NOT_IMPLEMENTED: { code: 501, message: "Not implemented" },
    BAD_GATEWAY: { code: 502, message: "Bad gateway" },
    SERVICE_UNAVAILABLE: { code: 503, message: "Service temporarily unavailable" },
    GATEWAY_TIMEOUT: { code: 504, message: "Gateway timeout" },


    VALIDATION_FAILED: { code: 400, message: "Validation failed: Please check input data" },
    DUPLICATE_ENTRY: { code: 409, message: "Duplicate entry: Data already exists" },
    LOGIN_REQUIRED: { code: 401, message: "Login required: Please authenticate" },
    INSUFFICIENT_FUNDS: { code: 402, message: "Insufficient funds: Payment required" }
};