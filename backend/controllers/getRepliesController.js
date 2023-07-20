const Comments = require("../models/comments");

const getRepliesById = async (req, res) => {
    try{
        const {id} = req.params;
        const replies = await Comments.find({parent_id: id}).exec();
        res.send({replies});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Error retrieving replies"});
    }
};

module.exports = {
    getRepliesById,
};