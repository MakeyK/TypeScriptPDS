class ApiError extends Error {
    status: number;
    // message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }  

    static badRequest(message: string): ApiError {
        return new ApiError(400, message);
    }

    static internal(message: string): ApiError {
        return new ApiError(500, message);
    }

    static forbidden(message: string): ApiError {
        return new ApiError(403, message);
    }
}

export default ApiError;
