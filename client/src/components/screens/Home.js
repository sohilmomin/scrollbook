import React, { useEffect, useState, useContext } from "react"
import { Usercontext } from "../../App"
import { Link } from 'react-router-dom'
import { baseUrl } from "../../shared/baseurl"
const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(Usercontext)
    useEffect(() => {
        fetch(baseUrl + "allpost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(response => response.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])
    const makeComment = (text, postId) => {
        fetch(baseUrl + 'comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const likePost = (id) => {
        fetch(baseUrl + "like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {

                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
    }

    const unlikePost = (id) => {
        fetch(baseUrl + "unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
    }

    const deletePost = (postId) => {
        fetch(baseUrl + `deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })

    }
    return (
        <div className="home">
            {
                data.map(item => {
                    return (

                        <div key={item._id} className="card home-card">
                            <div className="header-post">
                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                                    {item.postedBy.pic ?
                                        <img className="small-profile-pic circle " align="left" src={item.postedBy.pic} alt="P"></img>
                                        :
                                        <img className="small-profile-pic circle " align="left" src="https://res.cloudinary.com/sohil/image/upload/v1599484962/default_pic_boplg1.png" alt="P"></img>
                                    }
                                </Link>
                                <h5 className="postedby-user">
                                    <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>
                                    {
                                        item.postedBy._id === state._id
                                        && <i className="material-icons" style={{ color: "red", float: "right" }}
                                            onClick={() => deletePost(item._id)}>delete</i>
                                    }
                                </h5>
                                <h5 className="post-title">{item.title}</h5>
                            </div>

                            <div className="card-image">
                                <img className="item responsive-img" src={item.photo}
                                    alt="Post" />
                            </div>


                            <div className="card-content">
                                <div className="likes">
                                    {item.likes.includes(state._id)
                                        ?
                                        <i className="material-icons" style={{ color: "red" }}
                                            onClick={() => unlikePost(item._id)}
                                        >favorite</i>
                                        :
                                        <i className="material-icons" style={{ color: "red" }}
                                            onClick={() => likePost(item._id)}
                                        >favorite_border</i>
                                    }
                                    <h6 className="likes-count">{item.likes.length} Likes</h6>
                                </div>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (

                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}><Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"}>{record.postedBy.name}</Link></span> <span className="comment-posted">{record.text}</span>
                                            </h6>
                                        )
                                    })
                                }
                                <form className="comment-form" onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                    e.target[0].value = ""
                                }}>
                                    <textarea className="comment" cols="10" placeholder="Add Comment"></textarea>
                                    <button type="submit" className="comment-btn">
                                        <i className="material-icons comment-icon"
                                        >send</i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Home