import {useContext, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import  RTE from './RTE'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import axios from 'axios'
import { backendUrl } from '../context/const'

function PostForm({post}) {
  const {register, handleSubmit, control, getValues} = useForm({
    defaultValues: {
        title: post?.title || '',
        description: post?.description || '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(post?.image || null)
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
  }, [currentUser, navigate])

  const submit = async (data) => {
    if (!currentUser) {
      alert("You must be logged in to create/update posts")
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)

      // Add image if selected
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0])
      }

      let response

      if (post) {
        // Update existing post
        response = await axios.put(`${backendUrl}/post/update/${post.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // For cookie authentication
        })

        if (response.status === 200) {
          console.log("Post updated successfully")
          navigate(`/post/${post.id}`)
        }
      } else {
        // Create new post
        response = await axios.post(`${backendUrl}/post/addPost`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // For cookie authentication
        })

        if (response.status === 200) {
          console.log("Post created successfully")
          // Redirect to posts list or the new post
          navigate('/')
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error)

    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        {/* Main content section */}
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Left column - Main form fields */}
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="bg-gray-200 rounded-lg shadow-sm p-4">
              <input
                label="Title :"
                placeholder="Enter post title"
                className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full mb-4'
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" }
                })}
              />

              <div className="mt-6">
                <RTE
                  label="Description :"
                  name="description"
                  control={control}
                  defaultValue={getValues("description")}
                />
              </div>
            </div>
          </div>

          {/* Right column - Media and actions */}
          <div className="w-full lg:w-1/3 space-y-4 mt-6 lg:mt-0">
            <div className="bg-gray-200 rounded-lg shadow-sm p-4">
              <div className="mb-6">
                <input
                  label="Featured Image :"
                  type="file"
                  className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full mb-4'
                  accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                  {...register("image", {
                    required: !post ? "Image is required for new posts" : false
                  })}
                  onChange={(e) => {
                    register("image").onChange(e)
                    handleImageChange(e)
                  }}
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="w-full mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-lg w-full h-auto object-cover max-h-48"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {post ? "Current image (will be replaced if new image is selected)" : "Image preview"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  className={`px-4 py-2 rounded-lg bg-gray-500 text-white w-full transition-colors hover:opacity-90 disabled:opacity-50 ${post ? "bg-green-500" : 'bg-blue-500'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (post ? "Updating..." : "Creating...")
                    : (post ? "Update Post" : "Create Post")
                  }
                </button>

                {/* Cancel Button */}
                <button
                  className='px-4 py-2 rounded-lg bg-gray-500 text-white w-full transition-colors hover:opacity-90'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostForm
