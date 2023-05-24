//Signup: POST /login/signup
// Login: POST /login
//Change Password POST /login/password

const { Router } = require('express');
const router = Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = 'godzilla';

const userDAO = require('../daos/user');
const { isAuthorized } = require('../middleware/auth');


router.post('/', async (req, res) => {
    const { email, password } = req.body;

    const checkifUserExists = await userDAO.getUserByEmail(email);

    // Should return 400 when no password
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    if (!checkifUserExists) {
        return res.status(401).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, checkifUserExists.password);

    if (isMatch) {
        // should return 200 and a token when password matches
        // If password matches, generate and return a token
        const user = {
            email: checkifUserExists.email,
            _id: checkifUserExists._id,
            roles: checkifUserExists.roles
        }
        const token = jwt.sign(
            user,
            jwtSecret,
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ token });
            }
        );
        return { token, user }
    } else {
        // should return 401 when password does not match
        res.status(401).json({ error: 'Password does not match' });

    }
});


router.post('/signup', async (req, res) => {
    const { email, password, roles } = req.body;
    //Encrypt password

    //Should return 400 with out a password
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    //should return 400 wtih empty password
    if (password.length === 0) {
        return res.status(400).json({ error: 'Password is required' });
    }
    //Should return 200 and with a password
    if (password) {
        // should return duplicate signup if email already exists
        const user = await userDAO.getUserByEmail(email);
        if (user) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        // if no roles, default to ['user']
        const userRoles = roles ? roles : ['user'];
        userOBJ = {
            email: email,
            password: await bcrypt.hash(password, salt),
            roles: userRoles

        }
        await userDAO.createUser(userOBJ);
        return res.status(200).json({ password: userOBJ.password });

    }
});


router.post('/password', isAuthorized, async (req, res) => {
    const newPassword = req.body.password;
    const { _id } = req.user;  // _id of the user is stored in req.user
    //should reject empty passwords
    if (!newPassword || newPassword.length === 0) {
        return res.status(400).json({ error: 'New password is required' });
    }

    //should change password
    try {
        const user = await userDAO.getUserById(_id); // get the user from the database
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        encryptpassword = await bcrypt.hash(newPassword, salt);
        pwdupdate = await userDAO.updateUserPassword(_id, encryptpassword);
        if (pwdupdate) {
            return res.status(200).json({ status: 'ok' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});





module.exports = router;