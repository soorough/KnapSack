const Message = require("../models/Message");
const Class = require("../models/Class");
const User = require("../models/User");

const saveMessage = async (req, res) => {
    const user = res.locals.user;
    const {username, message, clsid} = req.body;

    try {
        const cls = await Class.findOne({
            id: clsid
        }).populate("by");

        if (cls) {
            const msg = await Message.create({
                sender: user,
                cls: cls,
                body: message
            })

            if (msg) {
                res.status(200);
                return res.json({message:msg});
            } else {
                res.status(400);
                throw Error("Bad Request");
            }
        } else {
            res.status(400);
            throw Error("Wrong Class Id");
        }
        
    } catch(err) {
        res.json({error: err});
    }
}

module.exports = { saveMessage };