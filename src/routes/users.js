const router = require('express').Router()
const userController = require('../controllers/user')


router.get('/', userController.getUser_s)
router.post('/', userController.createUser)
router.get('/otp/:email', userController.verifyEmail)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

router.delete('/', userController.deleteAll)

router.get('/:id/posts', userController.getPost_s);
router.post('/:id/posts',userController.createPost)
router.delete('/:id/posts/:postID', userController.deletePost)

module.exports = router
