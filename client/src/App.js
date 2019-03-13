import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import { getChats } from './actions/chatActions';

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Favorites from './components/favorites/Favorites';
import Account from './components/account/EditAccount';
import Login from './components/auth/Login';
import RegisteredUser from './components/auth/RegisteredUser';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import EditPost from './components/edit-post/EditPost';
import AddReview from './components/add-credentials/AddReview';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import PostForm from './components/posts/PostForm';
import Post from './components/post/Post';
import NotFound from './components/not-found/NotFound';
import FormSubmitted from './components/common/FormSubmitted';
import Chats from './components/chat/Chats';
import Stays from './components/stays/Stays';
import ChatItem from './components/chat/ChatItem';
import EmailAuthentication from './components/auth/EmailAuthentication';

import HowItWorks from './components/layout/footerComponents/HowItWorks';
import Careers from './components/layout/footerComponents/Careers';
import TermsOfService from './components/layout/footerComponents/TermsOfService';
import PrivacyPolicy from './components/layout/footerComponents/PrivacyPolicy';
//careers
import FrontEndDeveloper from './components/careers/FrontEndDeveloper';
import ReactNativeDeveloper from './components/careers/ReactNativeDeveloper';
import DirectorOfGrowthMarketing from './components/careers/DirectorOfGrowthMarketing';
import GrowthMarketingIntern from './components/careers/GrowthMarketingIntern';

import './App.css';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-134257820-1');
ReactGA.pageview(window.location.pathname + window.location.search);

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  store.dispatch(getChats(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {

      return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar curPath={window.location.pathname} />
            <Route exact path="/" component={Landing} />
            <Switch>
              <PrivateRoute exact path="/feed" component={Posts} />
            </Switch>
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/registered-user" component={RegisteredUser} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/front-end-developer" component={FrontEndDeveloper} />
              <Route exact path="/react-native-developer" component={ReactNativeDeveloper} />
              <Route exact path="/director-of-growth-marketing" component={DirectorOfGrowthMarketing} />
              <Route exact path="/growth-marketing-intern" component={GrowthMarketingIntern} />
              <Route exact path="/terms-of-service" component={TermsOfService} />
              <Route exact path="/privacy-policy" component={PrivacyPolicy} />
              <Route exact path="/how-it-works" component={HowItWorks} />
              <Route exact path="/careers" component={Careers} />


              <Switch>
                <PrivateRoute exact path="/favorites" component={Favorites} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/account" component={Account} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/profile/:id" component={Profile} />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/sublet" component={PostForm} />
              </Switch>
              <Switch>
                <Route exact path="/verify-email/:id" component={EmailAuthentication} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-post/:id"
                  component={EditPost}
                />
              </Switch>
              <Switch>
                  <PrivateRoute
                      exact
                      path="/add-review/:id"
                      component={AddReview}
                  />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/post/:id" component={Post} />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/chat/:id" component={ChatItem} />
              </Switch>

              <Route exact path="/not-found" component={NotFound} />

              <Route exact path="/formSubmitted" component={FormSubmitted} />


              <Switch>
                  <PrivateRoute exact path="/chats" component={Chats} />
              </Switch>
              <Switch>
                  <PrivateRoute exact path="/stays" component={Stays} />
              </Switch>
            </div>

            <Footer/>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
