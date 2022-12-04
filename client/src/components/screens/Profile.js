import React, { useEffect, useState, useContext } from "react"
import { Usercontext } from "../../App"
import { baseUrl } from "../../shared/baseurl"
const Profile = () => {
    const [mypics, setPics] = useState([])
    const [image, setImage] = useState("")
    const { state, dispatch } = useContext(Usercontext)
    useEffect(() => {
        fetch(baseUrl + "mypost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result) {
                    setPics(result.mypost)
                }
            })
    }, [])

    useEffect(() => {
        if (image) {
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

                    fetch(baseUrl + 'updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    })
                        .then(res => res.json())
                        .then(result => {
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])
    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
        <div className="profile">
            {
                state && state.pic && state.name && state.followers && state.following && mypics ?
                    <div className="profile-card" style={{ maxWidth: "556px ", margin: "10px auto" }}>

                        <div style={{
                            margin: "10px auto", justifyContent: "space-around", display: "flex", borderBottom: "2px solid gray"
                        }}>
                            < div >

                                {state.pic ?
                                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state.pic} alt="P"></img>
                                    :
                                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src="https://res.cloudinary.com/sohil/image/upload/v1599484962/default_pic_boplg1.png" alt="P"></img>
                                }
                            </div>
                            <div>
                                <h4>
                                    {state ? state.name : "loading"}
                                </h4>
                                <div className="profile-counts" style={{ width: "108%", justifyContent: "space-around" }}>
                                    <ul className="numbers">
                                        <li className="li-count">
                                            <h6 className="li-number1">{state ? mypics.length : "0"}</h6>
                                            <h6 className="li-number">posts</h6>
                                        </li>
                                        <li className="li-count">
                                            <h6 className="li-number1">{state ? state.followers.length : "0"}</h6>
                                            <h6 className="li-number">followers</h6>
                                        </li>
                                        <li className="li-count">
                                            <h6 className="li-number1">{state ? state.following.length : "0"}</h6>
                                            <h6 className="li-number"> followings</h6>
                                        </li>
                                    </ul>
                                </div>
                                <div className="file-field input-field ">
                                    <div className="btn update-pic">
                                        <span>Edit profile</span>
                                        <input type="file"
                                            onChange={(e) => updatePhoto(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            mypics.length
                                ?
                                <div className="gallery">
                                    {
                                        mypics.map(item => {
                                            return (
                                                <img key={item._id} className="profile-item" src={item.photo} alt={item.title} />
                                            )
                                        })
                                    }

                                </div>
                                :
                                <div className="not-posts" >No post</div>
                        }

                    </div >
                    :
                    <div className="loader"></div>
            }
        </div>
    )
}
export default Profile