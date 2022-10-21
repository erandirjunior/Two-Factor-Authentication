module.exports = class DomainError extends Error {
    constructor(message) {
        super(message);
    }
}