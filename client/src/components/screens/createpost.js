import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { baseUrl } from "../../shared/baseurl"
const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if (url) {
            fetch(baseUrl + "createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                        return
                    }
                    else {
                        M.toast({ html: "Uploaded Post", classes: "#43a047 graan darken-1" })
                        history.push('/')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [url])
    const postDetails = () => {
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
    return (
        <div className="create-post">
            <div className="card input-file"
                style={{
                    maxWidth: "500px",
                    margin: "100px auto",
                    padding: "10px",
                    textAlign: "center"
                }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Caption"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Image</span>
                        <input type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #ec407a pink lighten-1"
                    onClick={() => postDetails()}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default CreatePost