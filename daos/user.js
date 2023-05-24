// createUser(userObj) - should store a user record
// getUser(email) - should get a user record using their email
// updateUserPassword(userId, password) - should update the user's password field


const User = require('../models/user');

module.exports.createUser = (userObj) => {
    return User.create(userObj);
}

module.exports.getUserByEmail = (email) => {
    return User.findOne({ email });
}

module.exports.updateUserPassword = (userId, password) => {
    return User.findByIdAndUpdate(userId, { password });
}

module.exports.getUserById = (userId) => {
    return User.findById(userId);
}

