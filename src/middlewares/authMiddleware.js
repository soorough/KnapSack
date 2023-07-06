const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                return res.redirect("/auth/login");
            } else {
                next();
            }
        });
    } else {
        return res.redirect("/auth/login");
    }
};

const isStudentOrAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
            } else {
                const user = await User.findOne({
                    _id: decodedToken.id,
                });

                if (user.role !== "student" && user.role !== "admin") {
                    return res.redirect("/");
                } else {
                    res.locals.user = user;

                    next();
                }
            }
        });
    } else {
        return res.redirect("/auth/login");
    }
};

const isProfessorOrAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
            } else {
                const user = await User.findOne({
                    _id: decodedToken.id,
                });

                if (!user) {
                    return res.redirect("/auth/login");
                }

                if (user.role !== "professor" && user.role !== "admin") {
                    return res.redirect("/");
                } else {
                    res.locals.user = user;

                    next();
                }
            }
        });
    } else {
        return res.redirect("/auth/login");
    }
};

const isAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
            } else {
                const user = await User.findOne({
                    _id: decodedToken.id,
                });

                if (!user) {
                    return res.redirect("/auth/login");
                }

                if (user.role !== "admin") {
                    return res.redirect("/");
                } else {
                    res.locals.user = user;

                    next();
                }
            }
        });
    } else {
        return res.redirect("/auth/login");
    }
};

const isAny = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
            } else {
                const user = await User.findOne({
                    _id: decodedToken.id,
                });

                if (!user) {
                    return res.redirect("/auth/login");
                }

                if (
                    user.role !== "admin" &&
                    user.role !== "student" &&
                    user.role !== "professor"
                ) {
                    return res.redirect("/");
                } else {
                    res.locals.user = user;

                    next();
                }
            }
        });
    } else {
        return res.redirect("/auth/login");
    }
};

const loginMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                next();
            } else {
                return res.redirect("/");
            }
        });
    } else {
        next();
    }
};

module.exports = {
    isUser,
    isStudentOrAdmin,
    isProfessorOrAdmin,
    isAdmin,
    isAny,
    loginMiddleware,
};
