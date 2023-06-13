var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();

// Get all databases
router.get('/', async (req, res) => {
    try {
      const data = await mongoose.connection.db.admin().command({
        listDatabases: 1,
      });
      if (data && data !== null) {
        res.status(200).send({ data });
        return;
      }
      res.status(404).send({ data: null, message: 'Data not found' });
    } catch (e) {
      res.status(500).send(e.message);
    }
});

// Get all info about collection of current database
router.get('/collections', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray(error => {
            if (error) {
              throw new Error(error);
            }
          });
          res.status(200).send({ data: collections, totalCount: collections.length });
    } catch (e) {
        res.status(500).send(e.message);
      }
})

module.exports = router;
