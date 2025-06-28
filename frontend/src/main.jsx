import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import {AddPost, EditPost, Home, Login, Post, Register} from './pages/index.js'
import { AuthContexProvider } from './context/authContext.jsx'

const router = createBrowserRouter([
 {
  path: '/',
  element: <App />,
  children:[
    {
      path: '/',
      element: <Home />
    },
    {
      path:'/login',
      element:(
        <AuthLayout authentication={false}>
          <Login />
        </AuthLayout>
      )
    },
    {
      path:'/register',
      element:(
        <AuthLayout authentication={false}>
          <Register />
        </AuthLayout>
      )
    },
    // {
    //   path:'/all-posts',
    //   element:(
    //     <AuthLayout authentication>
    //       {" "}
    //       <AllPost />
    //     </AuthLayout>
    //   )
    // },
    {
      path:'/add-post',
      element:(
        <AuthLayout authentication>
          {" "}
          <AddPost />
        </AuthLayout>
      )
    },
    {
      path:'/edit-post/:id',
      element:(
        <AuthLayout authentication>
          {" "}
          <EditPost />
        </AuthLayout>
      )
    },
    {
      path:'/post/:id',
      element: <Post />
    },
    // {
    //   path: '/explore',
    //   element: <Explore />
    // }
  ]
 }
])




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContexProvider >
      <RouterProvider router={router}/>
     </AuthContexProvider>
  </StrictMode>,
)
