import {  useContext, useState } from 'react'
import  Container from './Container'
import Logo from './Logo'
import { NavLink, Link } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { AuthContext } from '../context/authContext'

function NavBar() {
  const {currentUser, logout} = useContext(AuthContext)

  const isAuthenticated = !!currentUser

  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !isAuthenticated,
    },
    {
      name: "Register",
      slug: "/register",
      active: !isAuthenticated,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: isAuthenticated,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout()
      setMenuOpen(false)
    } catch (error) {
      console.error('Logout failed: ', error)
    }
  }



  return (
    <header className='relative py-3 shadow bg-gray-600 '>
      <Container>
        <nav className='relative flex justify-between items-center'>
          <div className='mr-4'>
          {!isAuthenticated ? (
              <Link to="/">
                <Logo width='100px' />
              </Link>
            ) : (
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold'>
                  {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className='hidden md:block'>
                  <p className='text-white font-medium'>{currentUser?.username}</p>
                  {/* <p className='text-gray-300 text-sm'>{currentUser?.email}</p> */}
                </div>
              </div>
            )}
          </div>

          {/* Menu Icon for Small Devices */}
          <div className='relative z-50 ml-auto md:hidden'>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='p-2 bg-gray-600 hover:bg-gray-500 rounded-lg focus:outline-none'
            >
              {menuOpen ?
                <HiX className='h-6 w-6 text-white' /> :
                <HiMenu className='h-6 w-6 text-white' />
              }
            </button>
          </div>

          {/* Navigation Menu */}
          <div
            className={`
              absolute right-0 top-full
              w-48 mt-2
              bg-gray-500 rounded-lg shadow-lg
              md:relative md:top-auto md:w-auto md:bg-transparent md:shadow-none
              transition-all duration-200 ease-in-out
              ${menuOpen ? 'opacity-100 visible z-50' : 'opacity-0 invisible'}
              md:opacity-100 md:visible
            `}
          >
            <ul className='py-2 px-3 space-y-1 md:flex md:space-y-0 md:space-x-2 md:px-0 md:py-0'>
              {navItems.map((item) =>
                item.active && (
                  <li key={item.name}>
                    <NavLink
                      to={item.slug}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) => `
                        block px-3 py-2 rounded-lg transition-colors duration-200
                        ${isActive
                          ? 'bg-gray-100 text-black font-medium'
                          : 'text-white hover:bg-gray-600 md:hover:bg-blue-100 md:hover:text-gray-900'}
                      `}
                      end={item.slug === "/"} // Add 'end' prop for home route to match exactly
                    >
                      {item.name}
                    </NavLink>
                  </li>
                )
              )}


              {isAuthenticated && (
                 <li>
                  <button
                    onClick={handleLogout}
                    className='block w-full text-left px-3 py-2 rounded-lg text-white hover:bg-gray-600 md:hover:bg-red-100 md:hover:text-red-700 transition-colors duration-200'
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default NavBar
