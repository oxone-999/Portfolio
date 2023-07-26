const Comments = require("../models/comments");

const createReply = async (req, res) => {
  try {
    const { parent_id } = req.params;
    const { authorName,avatar, author_id, comment } = req.body;
    console.log("req.body",req.body);

    const reply = new Comments({
      parent_id: parent_id,
      author: authorName,
      avatar:avatar,
      author_id: author_id,
      comment: comment,
    });
    console.log("reply",reply);

    /// Find the parent comment
    let parentComment = null;
    if (parent_id !== "0") {
      console.log("parent_id is not 0");
      parentComment = await Comments.findById(parent_id);
      if (!parentComment) {
        console.log({ error: "Parent comment not found" });
      }
    }

    // Push the reply to the replies array of the parent comment
    if (parentComment) {
      const newReply = {
        author: authorName,
        author_id: author_id,
        comment: comment,
      };
      parentComment.replies.push(newReply);
      await parentComment.save();
    }

    const savedDocument = await reply.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  createReply,
};
