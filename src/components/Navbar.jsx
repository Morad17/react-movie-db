import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className="main-nav">
        <div className="nav-logo">LOGO</div>
        <ul className="main-nav-links">
            <li>
                <Link className="link"to="/">Home</Link>
            </li>
            <li>
                <Link className="link"to="/">Test Link</Link>
            </li>
            <li>
                <Link className="link"to="/">Test Link</Link>
            </li>
            <li>
                <Link className="link"to="/">Test Link</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar