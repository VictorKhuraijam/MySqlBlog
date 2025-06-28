import {useState, useEffect} from 'react'
import  Container  from '../components/Container'
import { useNavigate, useParams } from 'react-router-dom'
import PostForm from '../components/PostForm'
import axios from 'axios'
import { backendUrl } from '../context/const'

function EditPost() {
  const [post, setPost] = useState(null)
  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // if (id) {
    //   apppwriteService.getPost(id).then((post) => {
    //     if(post){
    //       setPosts(post)
    //     }
    //   })
    // } else {
    //   navigate('/')
    // }
     const fetchPost = async () => {
        if (id) {

            try {

                const fetchedPost = await axios.get(`${backendUrl}/post/${id}`);
                console.log("post:",fetchedPost)
                if(fetchedPost){
                    setPost(fetchedPost.data);

                } else {
                    navigate('/')
                }
            } catch (error) {
                console.error(error)
            } 
        }else{
            navigate('/')
        }
    }
    fetchPost();
  }, [id, navigate])

  return post ? (
    <div className='py-8'>
      <Container>
        <PostForm post={post}/>
      </Container>
    </div>
  ) : null
}

export default EditPost
