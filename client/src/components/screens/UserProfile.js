import React, { useEffect, useState, useContext } from "react"
import { Usercontext } from "../../App"
import { useParams } from 'react-router-dom'
import { baseUrl } from "../../shared/baseurl"
const Profile = () => {
    const [userProfile, setProfile] = useState(null)

    const { state, dispatch } = useContext(Usercontext)
    const { userid } = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
    useEffect(() => {
        fetch(baseUrl + `user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result) {
                    setProfile(result)
                }
            })
    }, [])

    const followUser = () => {
        fetch(baseUrl + 'follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false);
            })
    }

    const unfollowUser = () => {
        fetch(baseUrl + 'unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
    }


    return (
        <div className="profile">
            {userProfile ?
                <div className="profile-card" style={{ maxWidth: "556px ", margin: "10px auto" }}>
                    <div style={{
                        margin: "10px auto", marginBottom: "0px", justifyContent: "space-around", display: "flex", borderBottom: "2px solid gray"
                    }}>
                        < div >
                            {userProfile.user.pic ?
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={userProfile.user.pic} alt="P"></img>
                                :
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src="https://res.cloudinary.com/sohil/image/upload/v1599484962/default_pic_boplg1.png" alt="P"></img>
                            }
                        </div>
                        <div>
                            <h4>
                                {userProfile.user.name}
                            </h4>
                            <div className="profile-counts" style={{ width: "108%", justifyContent: "space-around" }}>
                                <ul className="numbers">
                                    <li className="li-count">
                                        <h6 className="li-number1">{userProfile.user ? userProfile.posts.length : "0"}</h6>
                                        <h6 className="li-number">posts</h6>
                                    </li>
                                    <li className="li-count">
                                        <h6 className="li-number1">{userProfile.user ? userProfile.user.followers.length : "0"}</h6>
                                        <h6 className="li-number">follower</h6>
                                    </li>
                                    <li className="li-count">
                                        <h6 className="li-number1">{userProfile.user ? userProfile.user.following.length : "0"}</h6>
                                        <h6 className="li-number"> following</h6>
                                    </li>
                                </ul>
                            </div>
                            {
                                showFollow
                                    ?
                                    <button style={{ margin: "10px" }} className="btn waves-effect waves-light #ec407a pink lighten-1"
                                        onClick={() => followUser()}>
                                        follow
                                </button>
                                    :
                                    <button style={{ margin: "10px" }} className="btn waves-effect waves-light #ec407a pink lighten-1"
                                        onClick={() => unfollowUser()}>
                                        unfollow
                                    </button>
                            }


                        </div>
                    </div>
                    {
                        userProfile.posts.length
                            ?
                            <div className="gallery">
                                {
                                    userProfile.posts.map(item => {
                                        return (
                                            <img key={item._id} className="profile-item" src={item.photo} alt={item.title} />
                                        )
                                    })
                                }

                            </div>
                            :
                            <div className="not-posts" >No posts</div>
                    }

                </div >
                :
                <div className="loader"></div>

            }
        </div>
    )
}
export default Profile