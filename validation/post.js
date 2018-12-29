const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';
  data.title = !isEmpty(data.title) ? data.title : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.rent = !isEmpty(data.rent) ? data.rent : 0;

  if (!Validator.isLength(data.text, { min: 1, max: 300 })) {
    errors.text = 'Post must be between 1 and 300 characters';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Text field is required';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Address field is required';
  }

  if(!isNaN(parseFloat(data.rent)) && isFinite(data.rent)) {
    
    if(Number(data.rent) < 1) {
      errors.rent = 'Rent needs to be above zero';
    }
  } else {
    errors.rent = 'Rent needs to a valid number';
  }

  if(data.images.length == 0) {
    errors.images = 'Need atleast one image';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};