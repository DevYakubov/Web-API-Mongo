module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    await db.collection('posts').updateMany({}, {$set: {views: 0}});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    await db.collection('posts').updateMany({}, {$unset: {views: null}});
  }
};
