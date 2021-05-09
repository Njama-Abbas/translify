module.exports = {
  password: process.env.DATABASE_PWD,
  user: process.env.DATABASE_USER,
  db_name: process.env.DATABASE_NAME,
  local: {
    HOST: "localhost",
    PORT: 27017,
    DB: "translify_DB",
  },
};
