module.exports = class GatewayError extends Error {
    constructor(message) {
        super(message);
    }
}