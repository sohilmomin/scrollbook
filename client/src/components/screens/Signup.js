import React, { useState, useEffect } from "react"
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { baseUrl } from "../../shared/baseurl"
const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [bio, setBio] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if (url) {
            uploadField()
        }
    }, [url])
    const uploadPic = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instaclone")
        data.append("cloud_name", "sohil")
        fetch("https://api.cloudinary.com/v1_1/sohil/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const uploadField = () => {
        fetch(baseUrl + "signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email,
                pic: url,
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
    const PostData = () => {
        if (image) {
            uploadPic()
        }
        else {
            uploadField()
        }

    }
    return (
        <>
            <div className="mycard-signup ">
                <div className='card authcard input-field'>
                    <h2>ScrollBook</h2>
                    <input
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="file-field upload-photo input-field">
                        <div className="btn login">
                            <span>Upload Profile Pic</span>
                            <input type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Not compulsory" />
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light #ec407a lighten-1 login"
                        onClick={() => PostData()}
                    >
                        Signup
                </button>
                    <div>
                        <span className="dont-have-account">
                            <Link to="/signin" className="link">Already have an account?</Link>
                        </span>
                        <span className="forgot-password">
                            <Link to="/reset" className="link">forgot passowrd</Link>
                        </span>
                    </div>
                </div>

                <footer className="bottom-text-signup">Click <span className="line">|</span> Upload <span className="line">|</span> Photo <span className="line">|</span> Feeds
                </footer>
            </div>
        </>
    )
}
export default Signup