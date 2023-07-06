const User = require("../models/User");

const showProfile = async (req, res) => {
    const user = res.locals.user;
    const username = req.params.username;

    try {
        const searchedUser = await User.findOne({
            username: username
        });
    
        if (searchedUser) {
            return res.render("profilepage", {user, suser: searchedUser});
        } else {
            res.status(404);
            throw Error("User Not Found");
        }
    } catch(err) {
        res.json({error: err});
    }
};

const updateProfile = async (req, res) => {
    const changeMaker = res.locals.user;
    const username = req.params.username;
    if (changeMaker.username !== username && changeMaker.username !== "admin") {
        return res.status(400).json({error: "Not Authorised"});
    }
    const { un, phone, email, firstName, lastName } = req.body;

    try {
        const user = await User.findOneAndUpdate({
            username: username
        }, {
            username: un,
            firstName,
            lastName,
            phone,
            email
        });

        if (user) {
            return res.redirect("/profile/" + un);
        } else {
            res.status(200);
            throw Error("Something went wrong while updating");
        }
    } catch(err) {
        res.json({error: err});
    }
};

const deleteProfile = async (req, res) => {
    const username = req.params.username;
    
    try {
        User.deleteOne({
            username
        }).then(() => {
            res.status(200);
            res.redirect("/");
        }).catch((err) => {
            throw Error(err.message);
        });
    } catch(err) {
        res.status(500).json({error: err});
    }
};

module.exports = { showProfile, updateProfile, deleteProfile };