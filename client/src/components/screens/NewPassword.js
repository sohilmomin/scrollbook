import React, { useState, useContext } from "react"
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'
import { baseUrl } from "../../shared/baseurl"
const Signin = () => {
    const history = useHistory()
    const { token } = useParams()
    console.log(token)
    const [password, setPassword] = useState("")
    const PostData = () => {
        fetch(baseUrl + "newpassword", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                token
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
                <h2>Instagram</h2>
                <input
                    type="password"
                    placeholder="Enter a new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #ec407a pink lighten-1"
                    onClick={() => PostData()}
                >
                    Update Password
                </button>
            </div>
        </div>
    )
}
export default Signin