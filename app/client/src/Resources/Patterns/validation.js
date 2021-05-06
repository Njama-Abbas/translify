const ValidationPatterns = {
  name: /^[A-Za-z]+$/i,
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  phoneno: /[0|+?254](\d){9}$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
  username: /^[a-z0-9_-]{3,16}$/gi,
};

export default ValidationPatterns;
