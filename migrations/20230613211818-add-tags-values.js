module.exports = {
  async up(db, client) {
    await db.collection('posts').updateOne(
      { title: "ChatGPT. How to use" }, 
      { $set: { tags:['Programming', 'AI', 'Future'] } }
    );
  },

  async down(db, client) {
    await db.collection('posts').updateOne(
      { title: "ChatGPT. How to use" }, 
      { $unset: { tags:['Programming', 'AI', 'Future'] } }
    );
  }
};
