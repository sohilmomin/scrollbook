import React, { useState, useContext, useRef, useEffect } from "react"
import { Link, useHistory } from 'react-router-dom'
import { Usercontext } from "../App"
import M from 'materialize-css'
import {baseUrl} from '../shared/baseurl'
const NavBar = () => {
    const { state, dispatch } = useContext(Usercontext)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const searchModal = useRef(null)
    const history = useHistory()
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])


    const fetchUsers = (query) => {
        setSearch(query)
        fetch(baseUrl + 'search-users', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query
            })
        }).then(res => res.json())
            .then(result => {
                setUserDetails(result.user)
            })
    }
    const renderList = () => {
        if (state) {
            return [
                <li key="1"> <i data-target="modal1" className=" search large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                <li className="navbaritem" key="2"><Link to="/profile">Profile</Link ></li>,
                <li className="navbaritem" key="3"><Link to="/createpost">Create Post</Link ></li>,
                <li className="navbaritem" key="4"><Link to="/myfollowingposts">Following Post</Link ></li>,

                <button key="5" className="btn logout waves-effect waves-light #ec407a pink lighten-1"
                    onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push("/signin")
                    }}
                >
                    Logout
                </button>
            ]
        }
        else {
            return [
                <li className="navbaritem" key="6"><Link to="/signin">Signin</Link></li>,
                <li className="navbaritem" key="7" ><Link to="/signup">SignUp</Link></li>
            ]
        }
    }

    const Collapsework = () => {
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.sidenav');
            var instances = M.Sidenav.init(elems, {
                edge: 'left',
                draggable: true,
                inDuration: 250,
                outDuration: 200,
                onOpenStart: null,
                onOpenEnd: null,
                onCloseStart: null,
                onCloseEnd: null,
                preventScrolling: true
            });
        })
    }
    return (
        <>
            <ul class="sidenav sidenav-close" id="mobile-demo">
                {renderList()}
                {Collapsework()}
            </ul>
            <div className="navbar-fixed">
                <nav>

                    <div className="nav-wrapper ">
                        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons" >menu</i></a>
                        <Link to={state ? "/" : "/signin"} className="brand-logo left scrollbook">Scrollbook</Link>

                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li>
                                <a style={{ display: "flex", fontSize: "18px", color: "black" }} target="_blank" className="github" href="https://www.linkedin.com/in/mohamadsohil-momin/">
                                    Scroll and Roll
                            <i display="flex" className="material-icons heart"
                                    >favorite</i>
                                </a>
                            </li>
                            {renderList()}
                        </ul>
                    </div>
                    <div id="modal1" className="modal" ref={searchModal}>
                        <div className="modal-content" style={{ color: 'black' }}>
                            <input
                                type="text"
                                placeholder="Search User with their name"
                                value={search}
                                onChange={(e) => fetchUsers(e.target.value)}
                            />
                            <ul className="collection">
                                {userDetails.map(item => {
                                    return <Link to={item._id != state._id ? "/profile/" + item._id : "/profile"} onClick={() => {
                                        M.Modal.getInstance(searchModal.current).close()
                                        setSearch("")
                                    }}> <li key={item.name} className="collection-item">{item.name}</li></Link>
                                })}
                            </ul>
                        </div>


                        <div className="modal-footer">
                            <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch("")}>Close</button>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}
export default NavBar