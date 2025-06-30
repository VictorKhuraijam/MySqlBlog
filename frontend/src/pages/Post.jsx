import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import Container from "../components/Container";
import { AuthContext } from "../context/authContext";
import { backendUrl } from "../context/const";
import axios from "axios";
import LikeButton from "../components/Like";

export default function Post() {
    const [post, setPost] = useState(null);

    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const {currentUser } = useContext(AuthContext)

    console.log("user data :", currentUser)


    // const userData = useSelector((state) => state.user.userData);

    useEffect(() => {
        const fetchPost = async () => {
        if (id) {

            try {
                setLoading(true)
                setError(null)
                const fetchedPost = await axios.get(
                    `${backendUrl}/post/${id}`);
                console.log("post:",fetchedPost)
                if(fetchedPost){
                    setPost(fetchedPost.data);

                } else {
                    navigate('/')
                }
            } catch (error) {
                console.error(error)
                setError("Failed to fetch post")
            } finally{
                setLoading(false)
            }
        }else{
            navigate('/')
        }
    }
    fetchPost();
    }, [id, navigate]);

    console.log("Fetched post :", post)

     const isAuthor = currentUser?.id && post?.userId ? post.userId === currentUser.id : null
    //  const isAuthor = currentUser?.id && post?.userId ? post.userId === currentUser.id : false;



    const deletePost = async () => {
        setDeleting(true)
       try {
            if (!post?.id) {
                throw new Error('Post ID not found');
            }
         const status = await axios.delete(
            `${backendUrl}/post/delete/${id}`,
            
            {withCredentials: true}
        );
        if(status){

            navigate('/')
        }
       } catch (error) {
            console.error('Failed to delete post:', error);
            setError("Failed to delete post");
       }finally{
        setDeleting(false)
       }
    };

    if(loading){
        return (
             <div className="py-11 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <div className="text-xl text-gray-600 font-sans">
                    Loading post...
                </div>
            </div>
        )
    }

    if(error) {
        return <div>Error: {error}</div>
    }

    // if (!post) {
    //     return (
    //         <div className="py-11 text-4xl text-black-100 font-sans text-center">
    //             No post found
    //         </div>
    //     );
    // }

    return post ? (
        <div className="py-8">
            <Container>

                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={post.image}
                        alt={'post image'}
                        className="rounded-xl w-full max-w-lg h-auto"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.id}`}>
                                <button className="mr-3 px-4 py-2 rounded-lg bg-green-500 text-white">
                                    Edit
                                </button >
                            </Link>
                            <button className="mr-3 px-4 py-2 rounded-lg bg-red-500 text-white" onClick={deletePost}>
                                {deleting ? "deleting..." : "delete"}
                            </button >
                        </div>
                    )}
                </div>
                <LikeButton postId={post?.id} />
                <div className="w-full mb-6">

                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css border rounded-xl">
                    {parse(post.description)}
                </div>


            </Container>
        </div>
    ) : <div
  className="py-11 text-4xl text-black-100 font-sans text-center"
  >No posts available</div>;
}
