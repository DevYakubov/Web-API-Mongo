module.exports = {
  async up(db, client) {
    await db.collection('posts').updateOne(
      { title: "ChatGPT. How to use" }, 
      { $push: { comments: {body: "It was interesting", createdAt: new Date(), updatedAt: new Date() } }}
    );

    await db.collection('posts').updateOne(
      { title: "ChatGPT. How to use" }, 
      { $inc: {commentsCount: 1} },
    );
  },

  async down(db, client) {
    await db.collection('posts').updateOne(
      { title: "ChatGPT. How to use" }, 
      { $pull: { comments: { body: "It was interesting" } } },
    );

    await db.collection('posts').updateOne(
      { title: "ChatGPT. How to use" }, 
      { $inc: {commentsCount: -1} },
    );
  }
};
