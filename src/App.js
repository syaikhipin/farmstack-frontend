import React from "react";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Login from './Views/Login/Login'
import ProfileScreen from './Views/Login/ProfileScreen'
import Participants from './Views/Participants/Participants'
import AddParticipants from './Views/Participants/AddParticipants'
import EditParticipants from './Views/Participants/EditParticipants'
import ViewParticipants from './Views/Participants/ViewParticipants'
import Datahub from './Layout/Datahub'
import Participant from './Layout/Participant'
import Error from "./Components/Error/Error";
import SessionExpired from "./Components/SessionExpired/SessionExpired";
import GuestUserHome from "./Views/GuestUser/GuestUserHome";
import GuestUserLegal from "./Views/GuestUser/GuestUserLegal";
import GuestUserContact from "./Views/GuestUser/GuestUserContact";
function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          {/* <Route exact path="/login" component={Login} />
          <Route exact path="/login/profile" component={ProfileScreen} />
          <Route exact path="/login/org" component={OrganisationScreen} />
          <Route exact path="/login/branding" component={BrandingScreen} />
          <Route exact path="/login/policies" component={Policies} />
          <Route  path="/login/profile" component={ProfileScreen} /> */}
          <Route path="/datahub" component={Datahub} />
          <Route path="/participant" component={Participant} />
          <Route path="/login" component={Login} />
          <Route path="/sessionexpired" component={SessionExpired} />
          <Route path="/error" component={Error} />
          <Route exact path="/guest/home" component={GuestUserHome} />
          <Route exact path="/guest/legal" component={GuestUserLegal} />
          <Route exact path="/guest/contact" component={GuestUserContact} />
          <Route path="/guest" component={GuestUserHome} />
          <Redirect from="/" to="/guest" />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
