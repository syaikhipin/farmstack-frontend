import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Components/Navbar/Navbar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter,
  useHistory,
} from "react-router-dom";
import AddCoSteward from "../Components/CoSteward/AddCoSteward";
import ParticipantCoStewardManagement from "../Views/ParticipantCoSteward/ParticipantCoStewardManagement";
import Participants from "../Views/Participants/Participants";
import AddParticipants from "../Views/Participants/AddParticipants";
import EditParticipants from "../Views/Participants/EditParticipants";
import ViewParticipants from "../Views/Participants/ViewParticipants";
import InviteParticipants from "../Views/Participants/InviteParticipants";
import AddTeamMember from "../Views/Settings/TeamMembers/AddTeamMember";
import EditTeamMember from "../Views/Settings/TeamMembers/EditTeamMember";
// import Settings from "../Views/Settings/Settings/Settings";
import Settings from "../Components/SettingsNew/Settings";
import Support from "../Views/Support/Support";
// import AddDataset from "../Views/Dataset/DatasetAdmin/AddDataset";
import DatasetAdmin from "../Views/Dataset/DatasetAdmin/DatasetAdmin";
// import EditDataset from "../Views/Dataset/DatasetAdmin/EditDataset";
import { useParams } from "react-router-dom";
import {
  flushLocalstorage,
  getRoleLocal,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  setRoleLocal,
  getUserLocal,
  GetErrorHandlingRoute,
  goToTop,
} from "../Utils/Common";
import SampleDataSet from "../Views/Support/SampleDataSet";
import Footer from "../Components/Footer/Footer";
import Dashboard from "../Views/Dashboard/Dashboard";
import AddConnectorParticipant from "../Views/Role/Participant/Connectors/AddConnectorParticipant";
import EditConnectorParticipant from "../Views/Role/Participant/Connectors/EditConnectorParticipant";
import ConnectorParticipant from "../Views/Connector/ConnectorParticipant/ConnectorParticipant";
import DemoDashboardTable from "../Components/Connectors/DemoDashboardTable";
import AddProjectParticipant from "../Views/Settings/ParticipantSettings/Project/AddProjectParticipant";
import ProjectDetailView from "../Views/Settings/ParticipantSettings/Project/ProjectDetailView";
import EditProjectParticipant from "../Views/Settings/ParticipantSettings/Project/EditProjectParticipant";
import DepartmentSettings from "../Views/Settings/ParticipantSettings/DepartmentSettings";
import ViewDepartment from "../Views/Settings/ParticipantSettings/ViewDepartment";
import EditDepartmentSettings from "../Views/Settings/ParticipantSettings/EditDepartmentSettings";
import AddDataset from "../Components/AdminDatasetConnection/AddDataset";
import ViewMetaDatasetDetails from "../Components/AdminDatasetConnection/ViewMetaDatasetDetails";
import ViewCoSteward from "../Components/Participants/ViewCoSteword";
import EditCoSteward from "../Components/Participants/EditCoSteward";
import DatasetIntegration from "../Components/Datasets/IntegrationDatasets/DatasetIntegration";
import ConnectorsList from "../Components/IntegrationConnectors/ConnectorsList";
import ParticipantsAndCoStewardNew from "../Views/ParticipantCoSteward/ParticipantAndCoStewardNew";
import ParticipantsAndCoStewardDetailsNew from "../Views/ParticipantCoSteward/ParticipantAndCoStewardDetailsNew";
import NavbarNew from "../Components/Navbar/Navbar_New";
import Connectors from "../Components/Connectors_New/Connectors";
import { Divider } from "@mui/material";
import FooterNew from "../Components/Footer/Footer_New";
import CostewardDetailsNew from "../Views/ParticipantCoSteward/CostewardDetailsNew";
import AddParticipantNew from "../Views/Participants/AddParticipantNew";
import EditParticipantsNew from "../Views/Participants/EditParticipantsNew";
import DataSetsView from "../Components/Datasets_New/DataSetsView";
import AddConnector from "../Views/Connector_New/AddConnector";
import EditConnector from "../Views/Connector_New/EditConnector";
import DataSets from "../Components/Datasets_New/DataSets";
import AddDataSetParticipantNew from "../Components/Datasets_New/AddDataSet";
import ParticipantApproveNew from "../Views/ParticipantCoSteward/ParticipantsApproveNew";
import InviteParticipantsNew from "../Views/Participants/InviteParticipantsNew";
import EditDataset from "../Components/Datasets_New/EditDataset";
import UrlConstant from "../Constants/UrlConstants";
import HTTPService from "../Services/HTTPService";
import { FarmStackContext } from "../Components/Contexts/FarmStackContext";
function Datahub(props) {
  // const [activePage, setactivePage] = useState("");
  // useEffect(() => {
  // }, []);
  const [render, reRender] = useState(0);
  const [verifyLocalData, setVerifyLocalData] = useState(false);
  const history = useHistory();
  const { callToast } = useContext(FarmStackContext);
  let roleId = {
    1: "datahub_admin",
    3: "datahub_participant_root",
    6: "datahub_co_steward",
  };

  const verifyUserDataOfLocal = () => {
    let url = UrlConstant.base_url + UrlConstant.verify_local_data_of_user;
    let userId = getUserLocal();
    let returnValue = false;
    if (!userId) {
      flushLocalstorage();
      return;
    }
    let params = { user_id: userId };
    HTTPService("GET", url, params, false, false, false)
      .then(async (response) => {
        console.log("response to verify local data in datahub", response);
        if (!response?.data?.on_boarded) {
          flushLocalstorage();
          history.push("/login");
          return;
        }
        let role = roleId[response?.data?.role_id];
        let localRole = getRoleLocal();
        // if (localRole != role) {
        //   history.push("/login");
        //   return;
        // }
        setRoleLocal(role);
        setVerifyLocalData(true);
        // console.log(
        //   "response to verify local data role in datahub",
        //   getRoleLocal(),
        //   isLoggedInUserAdmin()
        // );
      })
      .catch(async (e) => {
        console.log("error to verify local data", e);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message ?? "user login details are corrupted",
            error.status == 200 ? "success" : "error",
            error.toast
          );
        } else {
          history.push(error?.path);
        }
      });
  };

  useEffect(() => {
    verifyUserDataOfLocal();
    goToTop(0);
  }, []);

  return verifyLocalData ? (
    <>
      {getTokenLocal() &&
      (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) ? (
        <div className="center_keeping_conatiner">
          {/* <Navbar /> */}
          <NavbarNew loginType={"admin"} />
          <div className="minHeight67vhDatahubPage">
            <br/>
            <Switch>
              <Route
                exact
                path="/datahub/participants/view/:id"
                component={ParticipantsAndCoStewardDetailsNew}
              />
              <Route
                exact
                path="/datahub/participants/edit/:id"
                component={EditParticipantsNew}
              />
              <Route
                exact
                path="/datahub/costeward/view/:id"
                component={CostewardDetailsNew}
              />
              <Route
                exact
                path="/datahub/participants/view/approve/:id"
                component={ParticipantApproveNew}
              />

              <Route
                exact
                path="/datahub/costeward/edit/:id"
                component={EditParticipantsNew}
              />
              <Route
                exact
                path="/datahub/participants/add"
                component={AddParticipantNew}
              />
              <Route exact path="/datahub/dashboard" component={Dashboard} />

              <Route
                exact
                path="/datahub/participants/invite"
                component={InviteParticipantsNew}
              />
              {/* <Route
                exact
                path="/datahub/participants"
                component={Participants}
              /> */}
              {/* <Route exact path="/datahub/datasets/add" component={AddDataset} /> */}
              <Route
                exact
                path="/datahub/datasets/add"
                component={AddDataset}
              />
              {/* <Route
                exact
                path="/datahub/datasets/edit/:id"
                component={EditDataset}
              /> */}
              {/* temporary routes added - start */}
              <Route exact path="/datahub/new_datasets" component={DataSets} />
              <Route
                exact
                path="/datahub/new_datasets/view/:id"
                component={DataSetsView}
              />
              <Route
                exact
                path="/datahub/new_datasets/edit/:id"
                component={EditDataset}
              />
              <Route
                exact
                path="/datahub/new_datasets/add"
                component={AddDataSetParticipantNew}
              />
              {/* end */}
              <Route
                exact
                path="/datahub/settings/addmember"
                component={AddTeamMember}
              />
              <Route
                exact
                path="/datahub/settings/editmember/:id"
                component={EditTeamMember}
              />
              <Route
                exact
                path="/datahub/settings/adddepartment"
                component={DepartmentSettings}
              />
              <Route
                exact
                path="/datahub/settings/viewdepartment/:id/"
                component={ViewDepartment}
              />
              <Route
                exact
                path="/datahub/settings/editdepartment/:id"
                component={EditDepartmentSettings}
              />
              {/* /> */}
              <Route exact path="/datahub/settings/:id" component={Settings} />
              <Route exact path="/datahub/support" component={Support} />
              {/* <Route exact path="/datahub/datasets" component={DatasetAdmin} /> */}
              {/* <Route
                exact
                path="/datahub/connectors/add"
                component={AddConnectorParticipant}
              /> */}
              {/* temp added add connectors route */}
              <Route
                exact
                path="/datahub/connectors/add"
                component={AddConnector}
              />
              {/* end */}
              {/* temp added edit connectors route */}
              <Route
                exact
                path="/datahub/connectors/edit/:id"
                component={EditConnector}
              />
              {/* end */}
              {/* <Route
                exact
                path="/datahub/connectors/edit/:id"
                component={EditConnectorParticipant}
              /> */}
              {/* <Route
                exact
                path="/datahub/connectors"
                component={ConnectorParticipant}
              /> */}
              {/* <Route
                exact
                path="/datahub/settings/project/add"
                component={AddProjectParticipant}
              />
              <Route
                exact
                path="/datahub/settings/viewproject/:id"
                component={ProjectDetailView}
              />
              <Route
                exact
                path="/datahub/settings/project/edit/:id"
                component={EditProjectParticipant}
              /> */}
              <Route
                exact
                path="/datahub/connectors/detail"
                component={DemoDashboardTable}
              />
              <Route
                exact
                path="/datahub/dataset/view/:id"
                component={DataSetsView}
              />
              <Route
                exact
                path="/datahub/participants"
                component={ParticipantsAndCoStewardNew}
              />
              <Route
                exact
                path="/datahub/participants/addcosteward"
                component={AddCoSteward}
              />
              {/* <Route
                exact
                path="/datahub/connectors"
              >
                <DatasetIntegration />
              </Route> */}
              {/* temp added Connectors route */}
              <Route exact path="/datahub/connectors">
                <Connectors />
              </Route>
              {/* end */}
              <Route exact path="/datahub/connectors/list">
                <ConnectorsList />
              </Route>
            </Switch>
          </div>
          {/* <Footer /> */}
          <Divider className="mt-50" />
          <FooterNew />
        </div>
      ) : (
        props.history.push("/login")
      )}
    </>
  ) : (
    <></>
  );
}
export default Datahub;
