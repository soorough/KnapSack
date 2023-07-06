const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { isEmail, isMobilePhone } = require("validator");

const maxAge = 60 * 60 * 24;
const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: maxAge,
    });
}

const login_get = (req, res) => {
    res.render("login");
};

const login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            username,
        });

        if (!user) {
            throw Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // create jwt
            const token  = createToken(user._id);
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

            res.status(200).json({ user: user._id });
        } else {
            throw Error("Wrong Password");
        }
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const signup_get = (req, res) => {
    res.render("signup");
};

const signup_post = async (req, res) => {
    let { username, firstName, lastName, password, email, phone, role } =
        req.body;

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    try {
        if (!isEmail(email)) {
            throw Error("Invalid Email");
        }

        if (phone && !isMobilePhone(phone, 'en-IN')) {
            throw Error("Invalid Phone No.");
        }

        const user = await User.create({
            username,
            firstName,
            lastName,
            password,
            email,
            phone,
            role,
        });

        res.status(200).json({ user: user._id });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }

    return res.render("login");
};

const logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });

    res.redirect("/auth/login");
};

module.exports = { login_get, login_post, signup_get, signup_post, logout };
