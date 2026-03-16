// this is the router for posts related stuff

const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const imagesController = require("../controllers/imagesController");

//get all posts (post cards, no comments)
router.get('/',postsController.getAllPosts);

//get all posts by eventId (post cards, no comments)
router.get('/event/:eventId', postsController.getPostsByEvent);

//get all posts by eventUserId (post cards, no comments)
router.get('/user/:userId',   postsController.getPostsByUser);

//get post by postId (single post, including details and comments)
router.get('/:postId',postsController.getPostById);

//post post (single post, no comments)
router.post('/post/:eventAttendedId', imagesController.createUpload('postImages').array('images', 9), postsController.createPost);

//post comment
router.post('/comment/:parentPostId', imagesController.createUpload('postImages').array('images', 9), postsController.createComment);

//like post
router.post('/:postId/like', postsController.likeToggle);

//edit posts or comments
router.patch('/:postId', postsController.editPost);

//delete posts or comments
router.delete('/:postId', postsController.deletePost);

//to know whether the use has attended the event
router.get("/:eventId/attend", postsController.getAttendanceStatus);

//log event attendance
router.post("/:eventId/attend", postsController.logEvent);

//delete event attendance record
router.delete("/:eventAttendId/attend", postsController.deleteAttendance);

//rate event
router.patch("/:eventAttendId/rating", postsController.updateRating);

module.exports = router;