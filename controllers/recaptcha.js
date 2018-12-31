const Bluebird = require('bluebird');
const Recaptcha = require('recaptcha-v2').Recaptcha;
const RecaptchaSiteKey = require('../config/keys').RecaptchaSiteKey;
const RecaptchaSecretKey = require('../config/keys').RecaptchaSecretKey;


/**
 * Verify ReCaptcha
 * @param {Object} recaptchaData
 * @returns {Promise}
 */
exports.verifyRecaptcha = (recaptchaData) => {
  if (process.env.RECAPTCHA_SKIP_ENABLED === 'true') { // For development purpose only, you need to add SKIP_ENABLED in .env
    return Bluebird.resolve();
  }

  return new Bluebird((resolve, reject) => {
    const recaptcha = new Recaptcha(RecaptchaSiteKey, RecaptchaSecretKey, recaptchaData);

    recaptcha.verify((success) => {
      if (success) {
        return resolve();
      }

reject(new Error());
    });
  });
};