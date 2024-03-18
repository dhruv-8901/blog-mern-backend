/**
 * authConstant.js
 * @description :: constants used in authentication
 */

module.exports = {
  JWT: {
    SECRET: "guestpetnotformeitsforyouenjoy",
    EXPIRES_IN: "1 YEAR",
  },

  BCRYPT: {
    SALT_ROUND: 12,
  },

  ROLE: {
    USER: 1,
    RECRUITER: 2,
    ADMIN: 3,
  },

  PAGINATION: {
    DEFAULT_PER_PAGE: 20,
    DEFAULT_PAGE: 1,
  },
};
