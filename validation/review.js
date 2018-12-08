const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateReviewInput(data) {
    let errors = {};

    if (Validator.isEmpty(data.description)) {
        errors.from = 'From description field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
