class ApiError extends Error {
    status;
    message;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
    static badRequest(message) {
        return new ApiError(400, message);
    }
    static internal(message) {
        return new ApiError(500, message);
    }
    static forbidden(message) {
        return new ApiError(403, message);
    }
}
export default ApiError;
