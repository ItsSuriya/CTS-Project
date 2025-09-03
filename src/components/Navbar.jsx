import React, { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import { Link, useLocation } from "react-router-dom"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [active, setActive] = useState("Home")

  const navItems = [
    { name: "Home", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Result", url: "/result" },
  ]

  // Sync active state with current URL
  React.useEffect(() => {
    const currentItem = navItems.find(item => item.url === location.pathname)
    if (currentItem) setActive(currentItem.name)
  }, [location.pathname])

  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10 shadow-md">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => setActive("Home")}>
          <div className="text-5xl font-island font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">
          Hope Care
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => setActive(item.name)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300
                ${
                  active === item.name
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="backdrop-blur-xl bg-gradient-to-b from-black/70 to-purple-900/60 border-t border-white/10 flex flex-col items-stretch space-y-4 py-6 px-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => {
                setActive(item.name)
                setIsOpen(false)
              }}
              className={`text-center px-5 py-2 rounded-full font-medium transition-all duration-300
                ${
                  active === item.name
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar