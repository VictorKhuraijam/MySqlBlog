// import { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import LikeButton from './Like';


function PostCard({ post}) {

  console.log("Post in Post card :", post)

  // const [author, setAuthor] = useState(null);

  // const postData = isSavedPostView ? post.post : post;

  // useEffect(() => {
  //   const fetchAuthor = async () => {
  //     if (postData?.creator) {
  //       console.log("Fetching user for ID:", postData.creator);
  //       try {
  //         const user = await authService.getUserByDocumentId(postData.creator.$id);
  //         console.log("Fetched user:", user);
  //         if (!user) {
  //           console.error("User not found");
  //         } else {
  //           setAuthor(user);
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch author:", error);
  //       }
  //     }
  //   };
  //   fetchAuthor();
  // }, [postData?.creator]);



  // if(!postData) return null;

  // const {$id, title, featuredImage, creator, $createdAt } = postData;

  return (
    <div className="w-full bg-gray-100 rounded-lg p-4 transition-shadow hover:shadow-xl hover:scale-105">
      {/* Image at the top */}
      <div className="mb-4">
        <Link to={`/post/${post?.id}`}>
          <img
            src={post?.image}
            alt={post?.title}
            className="rounded-lg object-cover h-48 w-full"
          />
        </Link>
      </div>

      {/* Text Section */}
      <div className="flex flex-col">
        <Link to={`/post/${post.id}`}>
          <h2 className="text-md sm:text-lg md:text-base lg:text-xl font-bold mb-2 text-gray-800 overflow-hidden line-clamp-2 h-14">
            {post?.title}
          </h2>
        </Link>

        {/* {author && (
          <div className='flex items-center space-x-4 py-2'>


            <div className='flex flex-col'>
              <p className="text-gray-800 font-semibold">{post?.username}</p>
              <p className="text-gray-500 text-sm">{(post?.date)}</p>
            </div>
          </div>
        )} */}


      </div>

      <LikeButton postId={post?.id} />



    </div>
  );
}




export default PostCard;
