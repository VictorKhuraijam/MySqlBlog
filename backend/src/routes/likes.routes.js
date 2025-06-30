import express from 'express'
import {
  likePost,
  unlikePost,
  getLikesCount,

} from '../controllers/like.controller.js'


const router = express.Router()


// Like routes
router.post('/:postId', likePost)
router.delete('/unlike/:postId', unlikePost)
router.get('/count/:postId', getLikesCount)


export default router
