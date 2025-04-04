import React,{useEffect, useState} from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/Authprovider'

const Navbar = () => {

    const [loggedUser, setLoggedUser ] = useState('')
    const auth = useAuth()

    useEffect(()=> {
       const username = localStorage.getItem("username")
       if (username) {
        setLoggedUser(username)
       }
    },[ auth.user])

    const logout = () => {
        auth.logout()
        setLoggedUser('')
    }

  return (
    <nav className="main-nav">
        {
            loggedUser ? 
            <div className="logged-in-nav"> 
             <div className="nav-logo">LOGO</div>
                 <ul className="main-nav-links">
                    <li>
                        <Link className="link"to="/userPage">{loggedUser}</Link>
                    </li>
                    <li>
                        <Link className="link"to="/library">Movies</Link>
                    </li>
                    <li>
                        <Link className="link"to="/">Stats</Link>
                    </li>
                    <li>
                     <Link className="link" onClick={()=> logout()}>Logout</Link>
                    </li>
                </ul>
            </div>  :
            <div className="logged-out-nav"> 
                <div className="nav-logo">LOGO</div>
                    <ul className="main-nav-links">
                        <li>
                            <Link className="link"to="/">Home</Link>
                        </li>
                        <li>
                            <Link className="link"to="/library">Movies</Link>
                        </li>
                        <li>
                            <Link className="link"to="/">About</Link>
                        </li>
                        <li>
                            <Link className="link"to="/">Login</Link>
                        </li>
                    </ul>
            </div> 
            
            
        }
        
    </nav>
  )
}

export default Navbar