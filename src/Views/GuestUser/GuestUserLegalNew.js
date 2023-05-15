import React, { useState, useEffect, useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import UrlConstant from "../../Constants/UrlConstants";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "./GuestUserLegalNew.module.css";
import HTTPService from "../../Services/HTTPService";
import {
  downloadAttachment,
  GetErrorHandlingRoute,
  goToTop,
} from "../../Utils/Common";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import CustomTabs from "../../Components/Tabs/Tabs";
import { Box } from "@mui/system";
import HTMLReactParser from "html-react-parser";
import NoDataAvailable from "../../Components/Dashboard/NoDataAvailable/NoDataAvailable";
import ControlledAccordion from "../../Components/Accordion/Accordion";
import PolicyContent from "./PolicyContent";

const customDetailsStyle = {
  fontFamily: "'Montserrat' !important",
  fontWeight: "400 !important",
  fontSize: "13px !important",
  lineHeight: "20px !important",
  color: "#212B36 !important",
  textAlign: "left",
  marginBottom: "24px !important",
};
const GuestUserLegalNew = (props) => {
  const [legalData, setLegalData] = useState([]);
  const { callLoader, callToast } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const [tabValue, setTabValue] = useState(0);
  const [tabLabels, setTabLabels] = useState([
    // "Confidential",
    // "Agriculture Law",
    // "Terms and Conditions",
    // "Warranty",
    // "Digital green policy",
    // "LOE",
    // "Governing Law",
    // "Secret polic",
    // "security policy",
    // "Governing Lawwwww",
  ]);
  const [policies, setPolicies] = useState([]);

  const getLegalData = () => {
    callLoader(true);
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.microsite_get_policy,
      "",
      false,
      false,
      false
    )
      .then((response) => {
        callLoader(false);
        console.log(response, "updated responmse");
        response = response?.data;
        setLegalData(response);
        let tmpLabels = [];
        if (response) {
          response.forEach((policy, index) => {
            tmpLabels.push(policy.name);
          });
          setTabLabels(tmpLabels);

          // prepare accordion for mobile, tablet view
          let tempPolicies = [];
          response.forEach((policy, index) => {
            let obj = {
              panel: index + 1,
              title: policy.name,
              details: policy?.description
                ? [
                    <PolicyContent
                      description={HTMLReactParser(policy?.description)}
                      url={policy?.file}
                    />,
                  ]
                : [],
            };
            tempPolicies.push(obj);
          });
          setPolicies(tempPolicies);
          // end prep.
          console.log("tmpLabels", tmpLabels);
        } else {
          console.log("something is wrong in .then");
        }
      })
      .catch((e) => {
        callLoader(false);
        console.log("error", GetErrorHandlingRoute(e));
        callToast(GetErrorHandlingRoute(e).message, "error", true);
      });
  };
  useEffect(() => {
    getLegalData();
    goToTop();
  }, []);

  console.log("on load", tabLabels, tabValue);
  let url = legalData[tabValue]?.file;

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
  };
  return (
    <Box sx={containerStyle}>
      <Row className={LocalStyle.titleContainer}>
        <div
          className={LocalStyle.title}
          style={{
            fontSize: mobile ? "50px" : "64px",
          }}
        >
          Legal Policies
        </div>
        <div className="d-flex justify-content-center">
          <div
            className={LocalStyle.description}
            style={{
              width: mobile || tablet ? "auto" : "956px",
              fontSize: mobile ? "15px" : tablet ? "18px" : "22px",
            }}
          >
            <b style={{ fontWeight: "bold" }}>&ldquo;</b>
            Data governance policy documents, providing precise data usage and
            management guidelines within the Farmstack ecosystem. This feature
            promotes responsible data sharing and ensures compliance with
            industry standards.
            <b style={{ fontWeight: "bold" }}>&rdquo;</b>
          </div>
        </div>
      </Row>
      <Row className={LocalStyle.title2}>
        <Typography className={`${GlobalStyle.size24} ${GlobalStyle.bold600}`}>
          Our terms are
        </Typography>
      </Row>
      {tabLabels?.length > 0 ? (
        <>
          {mobile || tablet ? (
            <Box>
              <ControlledAccordion
                data={policies}
                isTables={true}
                isCustomDetailStyle={true}
                customDetailsStyle={customDetailsStyle}
              />
            </Box>
          ) : (
            <>
              <Box
                className="mt-50"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <CustomTabs
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  TabLabels={tabLabels}
                />
              </Box>
              <Row lg={12}>
                <Col className={LocalStyle.policyDetailsCol}>
                  <div className={LocalStyle.policyDetailsMainContainer}>
                    <div className={LocalStyle.policyDetailsContainer}>
                      <Typography
                        className={`${GlobalStyle.size32} ${GlobalStyle.bold600} ${LocalStyle.policyDetailsTitle}`}
                      >
                        {legalData[tabValue]?.name}
                      </Typography>
                      <Typography
                        className={`${GlobalStyle.size16} ${GlobalStyle.bold400} ${LocalStyle.policyDetailsDescription}`}
                      >
                        {legalData[tabValue]?.description
                          ? HTMLReactParser(legalData[tabValue]?.description)
                          : ""}
                      </Typography>
                    </div>
                    {url ? (
                      <Row className={LocalStyle.backButtonContainer}>
                        <Button
                          id={"details-page-load-more-dataset-button"}
                          variant="outlined"
                          className={`${GlobalStyle.primary_button} ${LocalStyle.primary_button}`}
                          onClick={() => downloadAttachment(url)}
                        >
                          <img
                            className={LocalStyle.imgTags}
                            src={require("../../Assets/Img/new_download.svg")}
                          />
                          Download document
                        </Button>
                        <Button
                          id={"details-page-load-more-dataset-button"}
                          variant="outlined"
                          className={`${GlobalStyle.outlined_button} ${LocalStyle.backButton}`}
                          onClick={() => window.open(url, "_blank")}
                        >
                          <img
                            className={LocalStyle.imgTags}
                            src={require("../../Assets/Img/view.svg")}
                          />
                          View document
                        </Button>
                      </Row>
                    ) : (
                      ""
                    )}
                  </div>
                </Col>
              </Row>{" "}
            </>
          )}
        </>
      ) : (
        <NoDataAvailable
          message={
            "Unfortunately, it seems that policies have not been established yet."
          }
        />
      )}
    </Box>
  );
};

export default GuestUserLegalNew;
