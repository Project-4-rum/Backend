const router = require('express').Router()
const postController = require('../controllers/posts')

router.get('/', postController.getPost)
router.post('/', postController.createPost)
router.patch('/:id', postController.updatePost)
router.delete('/:id', postController.deletePost)

router.delete('/', postController.deleteAll)

module.exports = router