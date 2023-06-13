var express = require('express');
var router = express.Router();
const { Post } = require('../data/db/models/Post');

const limitDefault = 5;
const offsetDefault = 0;

// GET all posts listing
router.get('/', async function(req, res, next) {
  const { limit: limitParam, offset: offsetParam, title, body, likeCount, commentsCount, ...extraFilter } = req.query;
  const limit = limitParam ?? limitDefault;
  const offset = offsetParam ?? offsetDefault;

  const findFilters = { 
    ...title && { title }, 
    ...body && { body },
    ...likeCount && { likeCount: Number(likeCount)},
    ...commentsCount && { commentsCount: Number(commentsCount)}
  };

  const posts = await Post.find(findFilters).limit(limit).skip(offset);
  return res.status(200).json({ data: posts, totalCount: posts.length });
});

router.post('/', async function(req, res, next) {
  const postData = req.body;
  const postsData = req.body.posts;
  if (postsData instanceof Array) {
    const insertedPosts = [];
    const errorAdding = false;
    const errorAddingIds = [];
    while (postsData.length !== 0) {
      const newPost =  new Post({ ...postsData[0], createdAt: new Date(), updatedAt: new Date()});
      const inserted = await newPost.save();

      if (!inserted) {
        errorAdding = true;
        errorAddingIds.unshift(postsData[0]);
      } else {
        insertedPosts.unshift(inserted);
      }
  
      postsData.shift();
    }

    if (errorAdding) {
      return res.status(404).send(`Next posts got errors while adding: ${errorAddingIds.join(',')}`);
    }
    return res.status(201).json(insertedPosts);

  } else if (postData instanceof Object) {
    const newPost = new Post({ ...postData, createdAt: new Date(), updatedAt: new Date() });
    const insertedPost = await newPost.save();
    return res.status(201).json(insertedPost);
  }
});

router.put('/:id', async function(req, res, next) {
  const updatingPostId = req.params.id;
  const newData = req.body;

  await Post.updateOne(
    { _id:updatingPostId },
    { ...newData,
      updatedAt: new Date()
    }
  );
  const updatedPost = await Post.findById(updatingPostId);
  if (updatedPost) {
    return res.status(200).json(updatedPost);
  }

  return res.status(404).json("Not found");
});

router.put('/', async function(req, res, next) {
  const updatingPosts = req.body.posts ?? [];
  const updatedPosts = [];
  let errorUpdating = false;
  const errorUpdatingIds = [];

  while (updatingPosts.length !== 0) {
    await Post.updateOne(
      { _id:updatingPosts[0].id },
      { ...updatingPosts[0].body,
        updatedAt: new Date()
      }
    );
    const updatedPost = await Post.findById(updatingPosts[0].id);

    if (!updatedPost) {
      errorUpdating = true;
      errorUpdatingIds.unshift(updatingPosts[0].id);
    } else {
      updatedPosts.unshift(updatedPost);
    }

    updatingPosts.shift();
  }

  if (errorUpdating) {
    return res.status(404).send(`Next posts got errors while updating: ${errorUpdatingIds.join(',')}`);
  }

  return res.status(200).send(updatedPosts);
});

router.delete('/:id', async function(req, res, next) {
  const deletedPostId = req.params.id;
  if (!deletedPostId) {
    return res.status(404).send('Empty id at request');
  }
  const deletedPost = await Post.findByIdAndDelete(deletedPostId);
  if (!deletedPost) {
    return res.status(404).send('Post with this id does not exist');
  }
  return res.status(200).json(deletedPost);
});

router.delete('/', async function(req, res, next) {
  const deletingPostIds = req.body.ids ?? [];
  const deletedPosts = [];
  let errorDeleting = false;
  const errorDeletingIds = [];

  while (deletingPostIds.length !== 0) {
    const deletedPost = await Post.findByIdAndDelete(deletingPostIds[0]);
    if (!deletedPost) {
      errorDeleting = true;
      errorDeletingIds.unshift(deletingPostIds[0]);
    } else {
      deletedPosts.unshift(deletedPost);
    }

    deletingPostIds.shift();
  }

  if (errorDeleting) {
    return res.status(404).send(`Next posts got errors while deleting: ${errorDeletingIds.join(',')}`);
  }

  return res.status(200).send(deletedPosts);
});

module.exports = router;
