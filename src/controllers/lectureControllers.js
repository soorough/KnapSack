const Class = require("../models/Class");
const Lecture = require("../models/Lecture");
const moment = require("moment");

const showLecture = async (req, res) => {
    const id = req.params.id;
    const lid = req.params.lid;
    const user = res.locals.user;

    try {
        const cls = await Class.findOne({
            id: id,
        }).populate("by");

        const classes = await Class.find({
            by: user,
        }).populate("by");

        if (cls) {
            const lec = await Lecture.findOne({
                _id: lid,
            }).populate("cls");

            let lectures = await Lecture.find({
                cls: cls,
            }).populate("cls");

            if (lec) {
                lec.timeago = moment(lec.createdAt).fromNow();

                return res.render("lecturepage", { lec, cls, classes, lectures });
            } else {
                res.status(400);
                throw Error("Bad Request");
            }
        } else {
            res.status(404);
            throw Error("Wrong Class Id");
        }
    } catch (err) {
        res.json({ error: err });
    }
};

const deleteLecture = (req, res) => {
    const id = req.params.id;
    const lid = req.params.lid;

    try {
        Lecture.deleteOne({
            _id: lid,
        })
            .then(() => {
                res.status(200);
                res.redirect("/classes/" + id);
            })
            .catch((err) => {
                throw Error(err.message);
            });
    } catch (err) {
        res.status(404).json({ error: err });
    }
};

const editLecture_get = async (req, res) => {
    const id = req.params.id;
    const lid = req.params.lid;

    try {
        const cls = await Class.findOne({
            id: id,
        }).populate("by");

        if (cls) {
            const lec = await Lecture.findOne({
                _id: lid,
            }).populate("cls");

            if (lec) {
                return res.render("editlecture", { cls, lec });
            } else {
                throw Error("Wrong Lecture Id");
            }
        } else {
            throw Error("Wrong Class Id");
        }
    } catch (err) {
        res.status(404).json({ error: err });
    }
};

const editLecture_post = async (req, res) => {
    const { lectureNo, name, body, lecid, clsid } = req.body;

    try {
        const cls = await Class.findOne({
            id: clsid,
        }).populate("by");

        if (cls) {
            const lec = await Lecture.findOneAndUpdate(
                {
                    _id: lecid,
                },
                {
                    lectureNo,
                    name,
                    body,
                }
            );

            if (lec) {
                res.status(200);
                return res.redirect("/classes/" + clsid + "/" + lecid + "/");
            } else {
                res.status(400);
                throw Error("Bad Request");
            }
        } else {
            res.status(404);
            throw Error("Wrong Class Id");
        }
    } catch (err) {
        return res.json({ error: err });
    }
};

module.exports = {
    showLecture,
    deleteLecture,
    editLecture_get,
    editLecture_post,
};
