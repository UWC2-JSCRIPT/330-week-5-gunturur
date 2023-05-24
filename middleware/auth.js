//write an isAuthorized middleware function that can be reused. It should verify the JWT provided in req.headers.authorization and put the decoded value on the req object.
//write an isAdmin middleware function that can be reused. If the user making the request is not an admin it should respond with a 403 Forbidden error.

const jwt = require('jsonwebtoken');
const jwtSecret = 'godzilla';
const userDAO = require('../daos/user');

const isAdmin = async (req, res, next) => {
  if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
    return res.status(403).send('Not an admin user');
  }
  else {
    next();
  }
}


const isAuthorized = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  // Split the authHeader string into its components
  const parts = authHeader.split(' ');

  // Check if the header has the correct format
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: "Authorization header format is 'Bearer <token>'" });
  }

  // The token is the second part of the authHeader
  const token = parts[1];

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'no authentication' });
    }
    req.user = decoded;
    // ``` Format of req.user
    //   {
    //     email: 'user0@mail.com',
    //     _id: '646d9212b7272b62585782b8',
    //     roles: [ 'user' ],
    //     iat: 1684902418
    //   }
    // ```
    next();
  });
};





module.exports = { isAuthorized, isAdmin }