const Class = require("../models/Class");
const moment = require("moment");

const home = async (req, res) => {
    const user = res.locals.user;
    let classes;
    if (user.role === "professor") {
        classes = await Class.find({
            by: user,
        }).populate("by");
    } else {
        classes = await Class.find({}).populate("by");
    }
    
    if (classes.length > 3) {
        classes = classes.slice(0, 3);
    }

    let noclass = false;

    if (classes.length === 0) {
        noclass = true;
    }

    classes.forEach((cls) => {
        cls.timeago = moment(cls.createdAt).fromNow();
    });

    return res.render("home", { classes, noclass });
};

module.exports = home;
