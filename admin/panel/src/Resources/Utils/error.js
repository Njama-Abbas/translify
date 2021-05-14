class Glitch {
  message(error) {
    const ErrorMessage =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return ErrorMessage;
  }
}

export default new Glitch();
