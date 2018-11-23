const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateReviewInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'title field is required';
    }

    if (Validator.isEmpty(data.description)) {
        errors.from = 'From description field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
