import express from 'express'
import { addPost, deletePost, getPost, getPosts, updatePost } from '../controllers/post.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/addPost', upload.single('image'), addPost)
router.delete('/delete/:id', deletePost)
router.put('/update/:id', upload.single('image'),updatePost)

export default router
