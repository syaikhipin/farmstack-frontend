import React, { useState, useEffect, useContext, lazy } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import AddCoSteward from "../Components/CoSteward/AddCoSteward";
import AddTeamMember from "../Views/Settings/TeamMembers/AddTeamMember";
import EditTeamMember from "../Views/Settings/TeamMembers/EditTeamMember";
import Settings from "../Components/SettingsNew/Settings";

import {
  flushLocalstorage,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  setRoleLocal,
  getUserLocal,
  GetErrorHandlingRoute,
  goToTop,
} from "../Utils/Common";
import Fab from "@mui/material/Fab";
import { FarmStackContext } from "common/components/context/DefaultContext/FarmstackProvider";
import HTTPService from "../Services/HTTPService";
import UrlConstant from "../Constants/UrlConstants";
import { Divider, useMediaQuery, useTheme } from "@mui/material";
import DashboardUpdated from "../Views/Dashboard_New";
import Navbar from "../common/components/navbar/default/Navbar";
import NotFound from "../Components/Error/NotFound";
import withAccess from "../hooks/withAccess";
import globalConfig from "globalConfig";
import DefaultNavbar from "../common/components/navbar/default/Navbar";
import EadpNavbar from "../common/components/navbar/eadp/Navbar";
import VistaarNavbar from "../common/components/navbar/vistaar/Navbar";
import KadpNavbar from "../common/components/navbar/kadp/Navbar";
import VistaarFooter from "../common/components/footer/vistaar/Footer";
import DefaultFooter from "../common/components/footer/default/Footer";
import EadpFooter from "../common/components/footer/eadp/Footer";
import KadpFooter from "../common/components/footer/kadp/Footer";

// Lazy loading for faster initial load
const Dashboard = lazy(() => import("../Views/Dashboard/Dashboard"));
const DepartmentSettings = lazy(() =>
  import("../Views/Settings/ParticipantSettings/DepartmentSettings")
);
const ViewDepartment = lazy(() =>
  import("../Views/Settings/ParticipantSettings/ViewDepartment")
);
const EditDepartmentSettings = lazy(() =>
  import("../Views/Settings/ParticipantSettings/EditDepartmentSettings")
);
const ParticipantsAndCoStewardNew = lazy(() =>
  import("../Views/ParticipantCoSteward/ParticipantAndCoStewardNew")
);
const ParticipantsAndCoStewardDetailsNew = lazy(() =>
  import("../Views/ParticipantCoSteward/ParticipantAndCoStewardDetailsNew")
);
const NavbarNew = lazy(() => import("../Components/Navbar/Navbar_New"));
const Connectors = lazy(() =>
  import("../Components/Connectors_New/Connectors")
);
const FooterNew = lazy(() => import("../Components/Footer/Footer_New"));
const FooterVistaar = lazy(() => import("../Components/Footer/Vistaar/Footer"));
const CostewardDetailsNew = lazy(() =>
  import("../Views/ParticipantCoSteward/CostewardDetailsNew")
);
const AddParticipantNew = lazy(() =>
  import("../Views/Participants/AddParticipantNew")
);
const EditParticipantsNew = lazy(() =>
  import("../Views/Participants/EditParticipantsNew")
);
const DataSetsView = lazy(() =>
  import("../Components/Datasets_New/DataSetsView")
);
const AddConnector = lazy(() => import("../Views/Connector_New/AddConnector"));
const EditConnector = lazy(() =>
  import("../Views/Connector_New/EditConnector")
);
const DataSets = lazy(() => import("../Components/Datasets_New/DataSets"));
const AddDataSetParticipantNew = lazy(() =>
  import("../Components/Datasets_New/AddDataSet")
);
const ParticipantApproveNew = lazy(() =>
  import("../Views/ParticipantCoSteward/ParticipantsApproveNew")
);
const InviteParticipantsNew = lazy(() =>
  import("../Views/Participants/InviteParticipantsNew")
);
const EditDataset = lazy(() =>
  import("../Components/Datasets_New/EditDataset")
);
const DashboardNew = lazy(() => import("../Views/Dashboard/DashboardNew"));
const Support = lazy(() => import("../Components/Support_New/Support"));
const SupportView = lazy(() => import("../Components/Support_New/SupportView"));
const AskSupport = lazy(() => import("../Components/Support_New/SupportForm"));
const AddIcCallRoundedIcon = lazy(() =>
  import("@mui/icons-material/AddIcCallRounded")
);
const CostewardsParticipant = lazy(() =>
  import("../Views/ParticipantCoSteward/CostewardsParticipant")
);
const TableWithFilteringForApi = lazy(() =>
  import("../Components/Table/TableWithFilteringForApi")
);
const ViewDashboardAndApiRequesting = lazy(() =>
  import("../Components/Datasets_New/ViewDashboardAndApiRequesting")
);
const Resources = lazy(() => import("../Views/Resources/Resources"));
const AddResource = lazy(() => import("../Views/Resources/AddResource"));
const EditResource = lazy(() => import("../Views/Resources/EditResource"));
const ViewResource = lazy(() => import("../Views/Resources/ViewResource"));
const ChatSupport = lazy(() =>
  import("../Views/Resources/ChatSupport/ChatSupport")
);
const Feedbacks = lazy(() => import("../Views/Feedbacks/Feedbacks"));
const Feedback = lazy(() => import("../Views/Feedbacks/Feedback"));

function Datahub(props) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [verifyLocalData, setVerifyLocalData] = useState(false);
  // const { isVerified } = useContext(FarmStackContext);

  const history = useHistory();
  const { callToast } = useContext(FarmStackContext);
  const [showButton, setShowButton] = useState(false);
  let roleId = {
    1: "datahub_admin",
    3: "datahub_participant_root",
    6: "datahub_co_steward",
  };

  const verifyUserDataOfLocal = () => {
    let url = UrlConstant.base_url + UrlConstant.verify_local_data_of_user;
    let userId = getUserLocal();
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
        setRoleLocal(role);
        setVerifyLocalData(true);
      })
      .catch(async (e) => {
        console.log("error to verify local data", e);
        let error = await GetErrorHandlingRoute(e);
        if (error?.toast) {
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
  const shouldRenderButton = () => {
    const currentPath = window.location.pathname;
    const excludedPaths = [
      "/datahub/support",
      "/datahub/support/add",
      "/datahub/support/view/",
    ]; // Add the paths where the floating button should be excluded
    return !excludedPaths.some((path) => currentPath.includes(path));
  };

  useEffect(() => {
    verifyUserDataOfLocal();
    goToTop(0);
    setShowButton(true);
  }, []);

  // checks for enabledSections

  const {
    datasets,
    co_stewards,
    participants,
    connectors,
    resources,
    feedbacks,
    dashboard,
  } = globalConfig.enableSections;

  // Constants to be used throughout your application
  // const isContentsEnabled = globalConfig.enableSections.contents;
  const isDashboardEnabled = dashboard;
  const isDatasetsEnabled = datasets;
  const isCoStewardsEnabled = co_stewards;
  const isParticipantsEnabled = participants;
  const isConnectorsEnabled = connectors;
  const isResourcesEnabled = resources;
  const isFeedbacksEnabled = feedbacks;

  return verifyLocalData ? (
    <>
      {getTokenLocal() &&
      (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) ? (
        <div className="center_keeping_conatiner">
          {globalConfig?.navBar === "DEFAULT" ? (
            <DefaultNavbar loginType={"admin"} />
          ) : null}
          {globalConfig?.navBar === "EADP" && (
            <EadpNavbar loginType={"admin"} />
          )}
          {globalConfig?.navBar === "VISTAAR" && (
            <VistaarNavbar loginType={"admin"} />
          )}
          {globalConfig?.navBar === "KADP" && (
            <KadpNavbar loginType={"admin"} />
          )}
          <div
            className={
              mobile
                ? "minHeight67vhDatahubPage" + " " + ""
                : window.location.pathname ===
                  "/datahub/resources/chat-with-content/"
                ? ""
                : "minHeight67vhDatahubPage" + " " + ""
            }
          >
            {window.location.pathname ===
            "/datahub/resources/chat-with-content/" ? null : (
              <br />
            )}
            <Switch>
              {isParticipantsEnabled && (
                <Route
                  exact
                  path="/datahub/participants/view/:id"
                  component={ParticipantsAndCoStewardDetailsNew}
                />
              )}
              {process.env.REACT_APP_INSTANCE !== "KADP" &&
                isCoStewardsEnabled && (
                  <Route
                    exact
                    path="/datahub/costeward/participants/view/:id"
                    component={CostewardsParticipant}
                  />
                )}
              {isParticipantsEnabled && (
                <Route
                  exact
                  path="/datahub/participants/edit/:id"
                  component={EditParticipantsNew}
                />
              )}
              {process.env.REACT_APP_INSTANCE !== "KADP" &&
                isCoStewardsEnabled && (
                  <Route
                    exact
                    path="/datahub/costeward/view/:id"
                    component={CostewardDetailsNew}
                  />
                )}
              {isParticipantsEnabled && (
                <Route
                  exact
                  path="/datahub/participants/view/approve/:id"
                  component={ParticipantApproveNew}
                />
              )}
              {process.env.REACT_APP_INSTANCE !== "KADP" &&
                isCoStewardsEnabled && (
                  <Route
                    exact
                    path="/datahub/costeward/edit/:id"
                    component={EditParticipantsNew}
                  />
                )}
              {isParticipantsEnabled && (
                <Route
                  exact
                  path="/datahub/participants/add"
                  component={AddParticipantNew}
                />
              )}
              {isDashboardEnabled && (
                <Route exact path="/datahub/dashboard" component={Dashboard} />
              )}
              {isDashboardEnabled && (
                <Route
                  exact
                  path="/datahub/bot_dashboard"
                  component={DashboardUpdated}
                />
              )}
              {isDashboardEnabled && (
                <Route
                  exact
                  path="/datahub/new_dashboard"
                  component={DashboardNew}
                />
              )}
              {isParticipantsEnabled && (
                <Route
                  exact
                  path="/datahub/participants/invite"
                  component={InviteParticipantsNew}
                />
              )}
              {/* <Route
                exact
                path="/datahub/participants"
                component={Participants}
              /> */}
              {/* <Route exact path="/datahub/datasets/add" component={AddDataset} /> */}
              {/* <Route
                exact
                path="/datahub/datasets/add"
                component={AddDataset}
              /> */}
              {/* <Route
                exact
                path="/datahub/datasets/edit/:id"
                component={EditDataset}
              /> */}
              {/* temporary routes added - start */}
              {isDatasetsEnabled && (
                <Route
                  exact
                  path="/datahub/new_datasets"
                  component={DataSets}
                />
              )}
              {isDatasetsEnabled && (
                <Route
                  exact
                  path="/datahub/new_datasets/view/:id"
                  component={DataSetsView}
                />
              )}
              {isDatasetsEnabled && (
                <Route
                  exact
                  path="/datahub/new_datasets/edit/:id"
                  component={EditDataset}
                />
              )}
              {isDatasetsEnabled && (
                <Route
                  exact
                  path="/datahub/new_datasets/add"
                  component={AddDataSetParticipantNew}
                />
              )}
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
              <Route exact path="/datahub/settings/:id" component={Settings} />
              <Route exact path="/datahub/support" component={Support} />
              {/* <Route exact path="/datahub/datasets" component={DatasetAdmin} /> */}
              {/* <Route
                exact
                path="/datahub/connectors/add"
                component={AddConnectorParticipant}
              /> */}
              {/* temp added add connectors route */}
              {isConnectorsEnabled && (
                <Route
                  exact
                  path="/datahub/connectors/add"
                  component={AddConnector}
                />
              )}
              {/* end */}
              {/* temp added edit connectors route */}
              {isConnectorsEnabled && (
                <Route
                  exact
                  path="/datahub/connectors/edit/:id"
                  component={EditConnector}
                />
              )}
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
              {/* <Route
                exact
                path="/datahub/connectors/detail"
                component={DemoDashboardTable}
              /> */}
              {isDashboardEnabled && (
                <Route
                  exact
                  path="/datahub/dataset/view/:id"
                  component={DataSetsView}
                />
              )}
              {isParticipantsEnabled && (
                <Route
                  exact
                  path="/datahub/participants"
                  component={ParticipantsAndCoStewardNew}
                />
              )}
              {process.env.REACT_APP_INSTANCE !== "KADP" &&
                isCoStewardsEnabled && (
                  <Route
                    exact
                    path="/datahub/participants/addcosteward"
                    component={AddCoSteward}
                  />
                )}
              {/* <Route
                exact
                path="/datahub/connectors"
              >
                <DatasetIntegration />
              </Route> */}
              {/* temp added Connectors route */}
              {isConnectorsEnabled && (
                <Route exact path="/datahub/connectors">
                  <Connectors />
                </Route>
              )}
              {/* end */}
              {/* <Route exact path="/datahub/connectors/list">
                <ConnectorsList />
              </Route> */}

              {/* <Route exact path="/datahub/resources" component={Resources} />
              <Route
                exact
                path="/datahub/resources/add"
                component={AddResource}
              />
              <Route
                exact
                path="/datahub/resources/edit/:id"
                component={EditResource}
              />
              <Route
                exact
                path="/datahub/resources/view/:id"
                component={ViewResource}
              />
              <Route
                exact
                path="/datahub/resources/chat-with-content/"
                component={ChatSupport}
              /> */}

              {isResourcesEnabled && (
                <Route exact path="/datahub/resources" component={Resources} />
              )}
              {isResourcesEnabled && (
                <Route
                  exact
                  path="/datahub/resources/add"
                  component={AddResource}
                />
              )}
              {isResourcesEnabled && (
                <Route
                  exact
                  path="/datahub/resources/edit/:id"
                  component={EditResource}
                />
              )}
              {isResourcesEnabled && (
                <Route
                  exact
                  path="/datahub/resources/view/:id"
                  component={ViewResource}
                />
              )}
              {isResourcesEnabled && (
                <Route
                  exact
                  path="/datahub/resources/chat-with-content"
                  component={ChatSupport}
                />
              )}

              {isFeedbacksEnabled && (
                <Route exact path="/datahub/feedbacks" component={Feedbacks} />
              )}
              {isFeedbacksEnabled && (
                <Route
                  exact
                  path="/datahub/feedbacks/view/:id"
                  component={Feedback}
                />
              )}
              <Route exact path="/datahub/support">
                <Support />
              </Route>
              <Route exact path="/datahub/support/add">
                <AskSupport />
              </Route>
              <Route exact path="/datahub/support/view/:id">
                <SupportView />
              </Route>
              <Route exact path="/datahub/test">
                <TableWithFilteringForApi />
              </Route>
              <Route exact path="/datahub/dashboard-api-request/:datasetid">
                <ViewDashboardAndApiRequesting />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </div>
          {shouldRenderButton() && showButton && (
            <Fab
              style={{
                position: "fixed",
                bottom: "20px",
                right: "30px",
                zIndex: 1000,
              }}
              onClick={() => {
                props.history.push("/datahub/support");
              }}
              className={"fabIcon"}
              id="click-support-icon"
            >
              <AddIcCallRoundedIcon />
            </Fab>
          )}
          <Divider
            className={
              window.location.pathname ===
              "/datahub/resources/chat-with-content/"
                ? ""
                : "mt-50"
            }
          />

          {globalConfig?.footer === "VISTAAR" && (
            <VistaarFooter loginType={"admin"} />
          )}
          {globalConfig?.footer === "DEFAULT" && (
            <DefaultFooter loginType={"admin"} />
          )}
          {globalConfig?.footer === "EADP" && (
            <EadpFooter loginType={"admin"} />
          )}
          {globalConfig?.footer === "KADP" && (
            <KadpFooter loginType={"admin"} />
          )}
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
