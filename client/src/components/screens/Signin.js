import React, { useState, useContext } from "react"
import { Link, useHistory } from 'react-router-dom'
import { Usercontext } from "../../App"
import M from 'materialize-css'
import { baseUrl } from "../../shared/baseurl"
const Signin = () => {
    const { state, dispatch } = useContext(Usercontext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const PostData = () => {
        fetch(baseUrl + "signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Successfully LoggedIn", classes: "#43a047 graan darken-1" })
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="mycard ">
                <div className='card authcard input-field'>
                    <h2>Scrollbook</h2>
                    <input className="login-input"
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input className="login-input"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn waves-effect waves-light #ec407a lighten-1 login"
                        onClick={() => PostData()}
                    >
                        login
                </button>
                    <div>
                        <span className="dont-have-account">
                            <Link to="/signup" className="link">Dont have an account?</Link>
                        </span>
                        <span className="forgot-password">
                            <Link to="/reset" className="link">forgot passowrd</Link>
                        </span>
                    </div>
                </div>

                <footer className="bottom-text">Click <span className="line">|</span> Upload <span className="line">|</span> Photo <span className="line">|</span> Feeds
                </footer>
            </div>

        </>
    )
}
export default Signin