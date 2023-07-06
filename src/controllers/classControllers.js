const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Class = require("../models/Class");
const moment = require("moment");


const allClasses = async (req, res) => {
    const token = req.cookies.jwt;

    let classes;

    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if (err) {
            return res.redirect("/auth/login");
        } else {
            let user = await User.findOne({
                _id: decodedToken.id,
            });

            if (!user) {
                // stolen jwt
                return res.redirect("/auth/login");
            }

            let role = user.role;

            if (role === "professor") {
                // for professor

                classes = await Class.find({
                    by: user,
                }).populate("by");
            } else if (role === "student") {
                // for student

                classes = await Class.find({}).populate("by");
            } else {
                // for admin

                classes = await Class.find({}).populate("by");
            }

            classes.forEach((cls) => {
                cls.timeago = moment(cls.createdAt).fromNow();
            });

            let noclass = false;

            if (classes.length === 0) noclass = true;

            res.render("classes", { data: classes, noclass });
        }
    });
};

const addClass_get = (req, res) => {
    return res.render("addClass");
};

module.exports = {
    allClasses,
    addClass_get
};
