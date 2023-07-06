const Class = require("../models/Class");
const Lecture = require("../models/Lecture");
const Message = require("../models/Message");
const MySem = require("../models/MySem");
const moment = require("moment");

const classDetails = async (req, res) => {
    const user = res.locals.user;
    const id = req.params.id;
    try {
        const cls = await Class.findOne({
            id: id,
        }).populate("by");

        let inmysem = false;

        const mysem = await MySem.findOne({
            user,
            module: cls
        }).populate("user")
        .populate("module");

        if (mysem) inmysem = true;

        const classes = await Class.find({
            by: user
        }).populate("by");

        cls.timeago = moment(cls.createdAt).fromNow();
        cls.inmysem = inmysem;

        const lec = await Lecture.find({
            cls: cls
        }).populate("cls");

        return res.render("classdetails", { data: cls, lectures: lec, classes });
    } catch (err) {
        return res.status(404).json({ error: err });
    }
};

const deleteClass = async (req, res) => {
    const id = req.params.id;

    try {
        const cls = await Class.findOne({
            id: id
        });

        if (cls) {
            MySem.deleteMany({
                module: cls
            }).then(() => {
                Class.deleteOne({
                    id: id
                }).then(() => {
                    res.status(200);
                    res.redirect("/classes");
                }).catch((err) => {
                    throw Error(err.message);
                })
            }).catch((err) => {
                throw Error(err.message);
            })
        } else {
            res.status(404);
            throw Error("Wrong Class Id");
        }
    } catch (err) {
        res.status(404).json({ error: err });
    }
};

const editClass_get = async (req, res) => {
    const id = req.params.id;

    try {
        const cls = await Class.findOne({
            id: id,
        }).populate("by");

        if (cls) {
            res.render("editclass", { data: cls });
        } else {
            throw Error("Wrong Class Id");
        }
    } catch (err) {
        res.status(404).json({ error: err });
    }
};

const editClass_post = async (req, res) => {
    const { id, module, description } = req.body;

    try {
        const cls = await Class.findOneAndUpdate({
            id,
        }, {
            id,
            module,
            description
        });

        return res.status(200).json({ cls: cls._id });
    } catch (err) {
        return res.status(404).json({ error: err });
    }
};

const addLecture_get = async (req, res) => {
    const id = req.params.id;

    try {
        const cls = await Class.findOne({
            id: id
        }).populate("by");

        if (cls) {
            return res.render("addlecture", {data: cls.id});
        } else {
            throw Error("Wrong Class Id");
        }
    } catch(err) {
        return res.status(404).json({error: err});
    }
};

const addLecture_post = async (req, res) => {
    const { lectureNo, name, content, classid, filepath } = req.body;

    try {
        const cls = await Class.findOne({
            id: classid
        }).populate("by");

        if (cls) {
            const lec = await Lecture.create({
                lectureNo,
                name,
                body: content,
                cls
            });

            if (lec) {
                return res.redirect("/classes/" + classid + "/");
            } else {
                res.status(400);
                throw Error("Bad request");
            }
        } else {
            res.status(404);
            throw Error("Wrong Class Id");
        }

    } catch(err) {
        res.json({error: err});
    }
};

const classForum = async (req, res) => {
    const id = req.params.id;

    try {
        const cls = await Class.findOne({
            id: id
        }).populate("by");

        if (cls) {
            let messages = await Message.find({
                cls: cls
            }).populate("sender");

            messages.forEach(message => {
                message.time = moment(message.createdAt).format("LT");
            });

            messages = messages.reverse();

            res.status(200);
            return res.render("forum", {cls, messages});
        } else {
            res.status(404);
            throw Error("Wrong Class Id");
        }
    } catch(err) {
        res.json({error: err});
    }
};

module.exports = {
    classDetails,
    deleteClass,
    editClass_get,
    editClass_post,
    addLecture_get,
    addLecture_post,
    classForum
};
