import React, { useState, useContext } from "react"
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { baseUrl } from "../../shared/baseurl"
const Reset = () => {
    const history = useHistory()
    const [email, setEmail] = useState("")
    const PostData = () => {
        fetch(baseUrl + "resetpassword", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "#43a047 graan darken-1" })
                    history.push('/signin')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="mycard ">
            <div className='card authcard input-field'>
                <h2>Scrollbook</h2>
                <h6>You will get reset link on your email.</h6>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn waves-effect waves-light #ec407a login lighten-1"
                    onClick={() => PostData()}
                >
                    Send me reset password link
                </button>
                <div>
                    <span className="dont-have-account">
                        <Link to="/signin" className="link">Dont have an account?</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}
export default Reset