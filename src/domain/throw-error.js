const throwError = (error, message) => {
    throw new error(message);
};

module.exports = throwError;