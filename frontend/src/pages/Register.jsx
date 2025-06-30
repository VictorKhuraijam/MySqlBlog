import {useState} from 'react'
// import authService from '../appwrite/auth.js'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import  Logo from '../components/Logo.jsx'

function Register() {

  const backendUrl = import.meta.env.VITE_BACKEND_URL



  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

   const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  // const create = async(data) => {
  //   setError("")
  //   try {

  //       const newUser = await authService.createAccount({
  //         email: data.email,
  //         password: data.password,
  //         name: data.name,
  //         username: data.username,
  //       })

  //       if(newUser){
  //         setError("Account created successfully! You can now log in.")  // Using error state to show success
  //         setTimeout(() => {
  //           navigate('/login')
  //         }, 5000) // Redirects after 2 seconds
  //       }
  //   } catch (error)  {
  //         setError(error.message);
  //     }

  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/auth/register`, inputs);

      if(res){
        navigate("/login");
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className='flex items-center justify-center mt-10 mb-10'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className='mb-2 flex justify-center'>
                <span className='inline-block w-full max-w-[100px]'>
                    <Logo width='50%'/>
                </span>
            </div>
            <h2 className='text-center text-2xl font-bold leading-tight'>
              Sign up to create an account
            </h2>
                <p className='mt-2 text-center text-base text-black/60'>
                    Already have any account?&nbsp;
                    <Link
                      to="/login"
                      className='font-medium text-primary text-blue-600 transition-all duration-200 hover:underline'
                    >
                      Sign In
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>{error}
                </p>}


                {/* <form onSubmit={handleSubmit(create)}>
                  <div className='space-y-5'>
                      <Input
                      label = "Name "
                      placeholder = "Enter your Name"
                      {...register("name", {
                        required: true,
                      })}
                      />

                      <Input
                      label = "Username "
                      placeholder = "Enter your Username"
                      {...register("username", {
                        required: true,
                      })}
                      />

                      <Input
                        label = "Email "
                        placeholder = "Enter your email"
                        type = "email"
                        {...register("email", {
                            required: true,
                            validate: {
                                  matchPattern: (value) =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",

                          }
                        })}
                      />

                      <Input
                      label = "Password"
                      type = "password"
                      placeholder = "Enter your password"
                      {...register("password", {
                        required: true,
                      })}
                      />

                      <button
                      type='submit'
                      className='w-full px-4 py-2 rounded-lg bg-blue-600 text-white'

                      >
                        Create Account
                      </button>
                  </div>
                </form> */}

                 <form className='flex flex-col item justify-center h-[30vh] gap-5'>
                    <input
                      className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full'
                      required
                      type="text"
                      placeholder="username"
                      name="username"
                      onChange={handleChange}
                    />
                    <input
                      className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full'
                      required
                      type="email"
                      placeholder="email"
                      name="email"
                      onChange={handleChange}
                    />
                    <input
                      className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full'
                      required
                      type="password"
                      placeholder="password"
                      name="password"
                      onChange={handleChange}
                    />
                    <button
                      onClick={handleSubmit}
                      className='px-4 py-2 rounded-lg bg-blue-600 text-white'
                    >Register</button>
                    {error && <p>{error}</p>}
                    <span>
                      Do you have an account? <Link to="/login">Login</Link>
                    </span>
            </form>
        </div>
    </div>
  )
}

export default Register
