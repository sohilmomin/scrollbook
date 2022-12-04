import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from "./components/Navbar"
import "./App.css"
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/createpost'
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom"
import { reducer, initialState } from "./reducer/userReducer"
import UserProfile from './components/screens/UserProfile'
import SubscribedPost from './components/screens/SubscribedPost'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'
export const Usercontext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(Usercontext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
    else {
      if (!history.location.pathname.startsWith('/reset')) {
        history.push('/signin')
      }
    }
  }, [])
  return (
    <Switch>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/myfollowingposts">
        <SubscribedPost />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route exact path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Usercontext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </Usercontext.Provider>

  );
}

export default App;
