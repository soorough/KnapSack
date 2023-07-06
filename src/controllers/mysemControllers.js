const Class = require("../models/Class");
const MySem = require("../models/MySem");
const moment = require("moment");

const mysem_get = async (req, res) => {
    const user = res.locals.user;

    try {
        const mysem_classes = await MySem.find({
            user,
        }).populate("user").populate({
            path: "module", 
            model: "Class",
            populate: {
                path: "by",
                model: "User"
            }
        });

       
        mysem_classes.forEach(x => {
            x.module.timeago = moment(x.module.createdAt).fromNow();
        });

        console.log(mysem_classes);


        res.status(200);
        return res.render("mySem", { data: mysem_classes });
    } catch (err) {
        res.json({error: err});
    }
};

const mysem_post = async (req, res) => {
    const user = res.locals.user;

    const cls_id = req.params.id;

    try {
        const cls = await Class.findOne({
            id: cls_id,
        }).populate("by");

        if (cls) {
            let already_exists = await MySem.findOne({
                user: user,
                module: cls,
            });

            if (already_exists) {
                return res.json({data: {}});
            }

            const mysem = await MySem.create({
                user: user,
                module: cls,
            });

            return res.json({data: mysem})
        } else {
            res.status(404);
            throw Error("Wrong Class Id");
        }
    } catch (err) {
        return res.json({ error: err });
    }
};

const mysem_delete = async (req, res) => {
    const user = res.locals.user;
    const cls_id = req.params.id;

    try {
        const cls = await Class.findOne({
            id: cls_id,
        }).populate("by");

        if (cls) {
            MySem.deleteOne({
                user: user,
                module: cls,
            })
                .then(() => {
                    return res.status(200).json({data: {}});
                })
                .catch((err) => {
                    res.status(500);
                    throw Error(err.message);
                });
        } else {
            res.status(404);
            throw Error("Wrong Class Id");
        }
    } catch (err) {
        res.json({ error: err });
    }
};

module.exports = { mysem_get, mysem_post, mysem_delete };
