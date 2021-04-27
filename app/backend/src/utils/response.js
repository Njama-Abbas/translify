module.exports = {
  userResponseObject: (user, role) => ({
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    phoneno: user.phoneno,
    rating: user.rating,
    role: role.name,
    verification: user.verification,
    id: user.id,
  }),
};
