module.exports = {
  CREATION_ERROR: (item) => ({
    message: `CREATION_ERROR\n ${item.toUpperCase()} FAILED! to be CREATED`,
    status: 500,
  }),

  UPDATE_ERROR: (item) => ({
    message: `UPDATE_ERROR\n ${item.toUpperCase()} FAILED! to be UPDATED`,
    status: 500,
  }),

  DELETE_ERROR: (item) => ({
    message: `DELETE_ERROR\n ${item.toUpperCase()} FAILED! to be DELETED`,
    status: 500,
  }),

  TWILIO_ERROR: (status) => ({
    message: `FAILED!\n TWILIO_ERROR\n Could NOT send the text message`,
    status,
  }),

  CONFLICT_ERROR: (item) => ({
    message: `FAILED!\n CONFLICT\n You Entered an INCORRECT ${item.toUpperCase()} Please try again`,
    status: 409,
  }),

  NOT_FOUND_ERROR: (item) => ({
    message: `FAILED!\n NOT_FOUND_ERROR \n ${item.toUpperCase()} NOT FOUND`,
    status: 404,
  }),

  FORBIDDEN_ERROR: (role) => ({
    message: `FAILED!\n FORBIDDEN!\n You Require ${role.toUpperCase()} ROLE To Proceed`,
    status: 403,
  }),

  UNAUTHORIZED_ERROR: (item = "") => ({
    message: `FAILED!\n UNAUTHORIZED\n Request could not be completed You entered ${
      item
        ? "an ".concat("INVLAID ").concat(item.toUpperCase())
        : "INCORRECT CREDENTIALS"
    }`,
    status: 401,
  }),
};
