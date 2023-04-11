import React, { useState, useEffect, useContext } from "react";
import { Box, Divider, TextField, Typography } from "@mui/material";
import SelectConnector from "./SelectConnector";
import EmptyFile from "../../Components/Datasets_New/TabComponents/EmptyFile";
import globalStyle from "../../Assets/CSS/global.module.css";
import style from "./connector.module.css";
import IntegrationConnector from "./IntegrationConnector";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import {
  GetErrorHandlingRoute,
  getUserLocal,
  goToTop,
  validateInputField,
} from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import Preview from "../../Components/Datasets/IntegrationDatasets/Preview/Preview";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import RegexConstants from "../../Constants/RegexConstants";

const textFieldStyle = {
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#919EAB",
    },
    "&:hover fieldset": {
      borderColor: "#919EAB",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#919EAB",
    },
  },
};
const AddConnector = (props) => {
  const history = useHistory();
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [connectorName, setConnectorName] = useState("");
  const [connectorDescription, setConnectorDescription] = useState("");
  const [organisationName, setOrganisationName] = useState();
  const [dataset, setDataset] = useState();
  const [orgList, setOrgList] = useState([]);
  const [completeData, setCompleteData] = useState([]);
  const [template, setTemplate] = useState({
    org_id: "",
    dataset_list: [],
    file_list: [],
    org_name: "",
    dataset_id: "",
    dataset_name: "",
    file_name: "",
    availabeColumns: [],
    columnsSelected: [],
    left: [],
    right: [],
    left_on: [],
    right_on: [],
    type: "",
    result: [],
    noOfjoin: 1,
  });
  const [empty, setEmptyTemplate] = useState({
    org_id: "",
    dataset_list: [],
    file_list: [],
    org_name: "",
    dataset_id: "",
    dataset_name: "",
    file_name: "",
    availabeColumns: [],
    columnsSelected: [],
    left: [],
    right: [],
    left_on: [],
    right_on: [],
    type: "",
    result: [],
    noOfjoin: 1,
  });
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [counterForIntegrator, setCounterForIntegration] = useState(2);
  const [isEdited, setIsEdited] = useState(false);
  const [
    isConditionForConnectorDataForSaveMet,
    setIsConditionForConnectorDataForSaveMet,
  ] = useState(false);
  const [isDatasetIntegrationListModeOn, setIsDatasetIntegrationListModeOn] =
    useState(true);
  const [connectorList, setConnectorList] = useState([]);
  const [isAllConditionForSaveMet, setIsAllConditionForSaveMet] =
    useState(false);
  const [temporaryDeletedCards, setTemporaryDeletedCards] = useState([]);
  const [joinType, setJoinType] = useState("");
  const [finalDataNeedToBeGenerated, setFinalDataNeedToBeGenerated] = useState(
    {}
  );
  const [integratedFilePath, setIntegratedFilePath] = useState("");
  const [noOfRecords, setNoOfRecords] = useState(0);
  const [finalDatasetAfterIntegration, setFinalDatasetAfterIntegration] =
    useState([]);
  const [connectorId, setConnectorId] = useState("");
  const [connectorData, setConnectorData] = useState({
    name: "",
    desc: "",
  });
  const [connectorTimeData, setConnectorTimeData] = useState({
    create_at: "",
    last_updated: "",
  });
  const [totalCounter, setTotalCounter] = useState(-1);
  const [errorConnectorName, setErrorConnectorName] = useState("");
  const [errorConnectorDesc, setErrorConnectorDesc] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);

  const limitCharName = 100;
  const limitCharDesc = 512;

  const handleDescription = (e) => {
    if (e.target.value.toString().length <= limitCharDesc) {
      setConnectorDescription(e.target.value);
    }
  };

  const handleChangeSelector = async (value, type) => {
    console.log(value);
    let url = "";
    let payload = {};
    let list = [value];
    let method = "POST";
    if (type == "dataset") {
      url = UrlConstant.base_url + UrlConstant.get_files_for_selected_datasets;
      payload = {
        datasets: [...list],
      };
    } else if (type == "file") {
      url = UrlConstant.base_url + UrlConstant.get_columns_for_selected_files;
      payload = {
        files: [...list],
      };
    } else if (type == "org") {
      method = "GET";
      url =
        UrlConstant.base_url +
        UrlConstant.get_dataset_name_list +
        "?org_id=" +
        value;
      payload = {};
    }
    await HTTPService(method, url, payload, false, true, false)
      .then((res) => {
        if (type == "dataset") {
          setTemplate({
            ...template,
            availabeColumns: [],
            dataset_name: res.data[0]?.dataset_name
              ? res.data[0].dataset_name
              : "N/A",
            dataset_id: value ? value : "",
            file_name: "",
            availabeColumns: [],
            file_list: [...res.data],
          });
        } else if (type == "file") {
          let name = list[0];
          let resArr = [];
          let fileId = res.data?.id ? res.data.id : "";
          for (var key in res.data) {
            resArr.push(res.data[key]);
          }
          setTemplate({
            ...template,
            file_id: fileId,
            file_name: name,
            availabeColumns: [...res.data[name]],
          });
        } else if (type == "org") {
          console.log(template);
          setTemplate({
            ...template,
            availabeColumns: [],
            dataset_name: "",
            dataset_id: "",
            file_name: "",
            file_list: [],
            dataset_list: [...res.data],
            org_id: value,
            org_name: res?.data?.length > 0 ? res.data[0]?.org_name : "",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const getDataList = (source) => {
    let url = "";
    if (source == "org_names") {
      url = UrlConstant.base_url + UrlConstant.get_org_name_list;
    } else if (source == "dataset_names") {
      url = UrlConstant.base_url + UrlConstant.get_dataset_name_list;
    }
    HTTPService("GET", url, "", false, true, false)
      .then((res) => {
        if (source == "org_names") {
          setOrgList([...res.data]);
        } else if (source == "dataset_names") {
          setTemplate({ ...template, dataset_list: [...res.data] });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const resetAll = (main, connector, join, goback, func1, func2) => {
    // goToTop()
    // if (isEditModeOn) {
    setIsConditionForConnectorDataForSaveMet(false);
    setIsAllConditionForSaveMet(false);
    // }
    setTemporaryDeletedCards([]);
    setIntegratedFilePath("");
    setNoOfRecords(0);
    setTemplate({ ...empty });
    setConnectorId("");
    setCounterForIntegration(2);
    setCompleteData([]);
    setFinalDatasetAfterIntegration([]);
    setConnectorData({ name: "", desc: "" });
    setIsEditModeOn(false);
    setIsDatasetIntegrationListModeOn(true);
  };
  const completeDataGenerator = (maps) => {
    // { org_id: "", dataset_list: [], file_list: [], org_name: "", dataset_id: "", dataset_name: "", file_name: "", availabeColumns: [], columnsSelected: [], left: [], right: [], left_on: [], right_on: [], type: "" },

    let arr = [];
    for (let i = 0; i < maps.length; i++) {
      let currentObj = {};
      let nextObj = {};

      //Current obj
      currentObj["file_name"] = maps[i]?.left_dataset_file?.file
        ? maps[i]?.left_dataset_file?.file
        : "N/A";
      currentObj["file_id"] = maps[i]?.left_dataset_file?.id
        ? maps[i]?.left_dataset_file?.id
        : "";
      // currentObj["dataset_id"] = maps[i]?.left_dataset_file?.dataset?. ?  maps[i]?.left_dataset_file?.file.split("/").at(-1) : "N/A"
      currentObj["dataset_name"] = maps[i]?.left_dataset_file?.dataset?.name
        ? maps[i]?.left_dataset_file?.dataset?.name
        : "";
      currentObj["org_name"] = maps[i]?.left_dataset_file?.dataset?.user_map
        ?.organization?.name
        ? maps[i]?.left_dataset_file?.dataset?.user_map?.organization?.name
        : "";
      currentObj["org_id"] = maps[i]?.left_dataset_file?.dataset?.user_map?.id
        ? maps[i]?.left_dataset_file?.dataset?.user_map?.id
        : "";
      currentObj["type"] = maps[i]?.condition?.how
        ? maps[i]?.condition?.how
        : "left";
      currentObj["left_on"] = maps[i]?.condition?.left_on;
      currentObj["right_on"] = maps[i]?.condition?.right_on;
      currentObj["columnsSelected"] = maps[i]?.condition?.left_selected;
      currentObj["left"] =
        maps[i]?.condition?.left?.length > 0 ? maps[i]?.condition?.left : [];
      currentObj["next_left"] =
        maps[i]?.condition?.left?.length > 0 ? maps[i]?.condition?.left : [];
      currentObj["map_id"] = maps[i]?.id ? maps[i]?.id : null;
      currentObj["result"] = maps[i]?.condition?.result
        ? maps[i]?.condition?.result
        : [];
      currentObj["availabeColumns"] =
        maps[i]?.condition?.left_available_columns?.length > 0
          ? maps[i]?.condition?.left_available_columns
          : maps[i]?.condition?.left_selected;
      currentObj["noOfjoin"] = maps[i]?.condition?.left_on?.length;
      arr[i] = currentObj;

      //Next obj
      nextObj["left"] =
        maps[i]?.condition?.left?.length > 0 ? maps[i]?.condition?.left : [];
      nextObj["file_name"] = maps[i]?.right_dataset_file?.file
        ? maps[i]?.right_dataset_file?.file
        : "N/A";
      nextObj["file_id"] = maps[i]?.right_dataset_file?.id
        ? maps[i]?.right_dataset_file?.id
        : "";
      nextObj["dataset_name"] = maps[i]?.right_dataset_file?.dataset?.name
        ? maps[i]?.right_dataset_file?.dataset?.name
        : "";
      nextObj["columnsSelected"] =
        maps[i]?.condition?.right_selected.length > 0
          ? maps[i]?.condition?.right_selected
          : [];
      nextObj["availabeColumns"] =
        maps[i]?.condition?.right_available_columns?.length > 0
          ? maps[i]?.condition?.right_available_columns
          : maps[i]?.condition?.left_selected;
      nextObj["org_name"] = maps[i]?.right_dataset_file?.dataset?.user_map
        ?.organization?.name
        ? maps[i]?.right_dataset_file?.dataset?.user_map?.organization?.name
        : "";
      nextObj["org_id"] = maps[i]?.right_dataset_file?.dataset?.user_map?.id
        ? maps[i]?.right_dataset_file?.dataset?.user_map?.id
        : "";
      nextObj["left_on"] = [];
      nextObj["right_on"] = [];
      nextObj["noOfjoin"] = 1;
      arr[i + 1] = nextObj;
    }
    // let obj = {}
    // obj["left"] = maps[maps.length - 1]?.next_left
    // arr[arr.length] = { ...obj }
    console.log(arr);
    setCompleteData([...arr]);
    setCounterForIntegration(arr.length >= 2 ? arr.length : 2);
  };

  const setterForPreRender = (dataForRender) => {
    //set name and desc
    setConnectorData({
      ...completeData,
      name: dataForRender?.name ? dataForRender?.name : "",
      desc: dataForRender?.description ? dataForRender?.description : "",
    });
    console.log(
      dataForRender?.name,
      dataForRender?.description,
      "dataForRender?.name && dataForRender?.description"
    );
    if (dataForRender?.name && dataForRender?.description) {
      setIsConditionForConnectorDataForSaveMet(true);
    }
    //set connector id for deleting the connector if user wants
    setConnectorId(dataForRender?.id);
    //file path setting
    setIntegratedFilePath(
      dataForRender?.integrated_file?.replace("/media", "")
    );
    setNoOfRecords(
      dataForRender?.data?.no_of_records
        ? dataForRender?.data?.no_of_records
        : 0
    );

    //set already generated data
    setFinalDatasetAfterIntegration([
      ...(dataForRender?.data?.data ? dataForRender?.data?.data : []),
    ]);

    //A function to generate complete Data from maps of dataForRender
    completeDataGenerator(
      dataForRender?.maps?.length > 0 ? dataForRender?.maps : []
    );
  };

  //this function is being used to generate the data at first place, Save the generated data and delete the saved connectors
  const generateData = (index, condition, map_id) => {
    let connector_id = connectorId;
    // let map_id
    if (condition == "view_details") {
      connector_id = props.connectorIdForView;
    }
    //  else if (condition == "delete_map_card" && isEditModeOn) {
    //     map_id = completeData[index]["map_id"] ? completeData[index]["map_id"] : ""
    //     setTemporaryDeletedCards([...temporaryDeletedCards, map_id])
    //     return
    // }
    //condition can be ===> [integrate, delete, save] any one of the listed elements
    setLoader(true);
    let url = "";

    let payload = [];

    // console.log(index, completeData, condition, "MAIN DATA")
    if (
      condition !== "view_details" &&
      condition != "delete" &&
      condition != "delete_map_card"
    ) {
      for (let i = 0; i < index + 1; i++) {
        //Generating the payload as array of objects each object having data friom completeData and completeJoinData
        let obj = {
          left_dataset_file: completeData[i]?.file_id,
          right_dataset_file: completeData[i + 1]?.file_id,
          left_dataset_file_path: completeData[i]?.file_name,
          right_dataset_file_path: completeData[i + 1]?.file_name,
          condition: {
            result:
              completeData[i]?.result?.length > 0
                ? completeData[i]?.result
                : [],
            left:
              completeData[i]?.next_left?.length > 0
                ? completeData[i].next_left
                : [],
            right:
              completeData[i]?.right?.length > 0 ? completeData[i].right : [],
            left_available_columns:
              completeData[i]?.availabeColumns?.length > 0
                ? [...completeData[i]?.availabeColumns]
                : [],
            right_available_columns:
              completeData[i + 1]?.availabeColumns?.length > 0
                ? [...completeData[i + 1]?.availabeColumns]
                : [],
            right_selected: [...completeData[i + 1]?.columnsSelected],
            left_selected: [...completeData[i]?.columnsSelected],
            how: completeData[i]?.type ? completeData[i]?.type : "left",
            left_on: completeData[i]?.left_on,
            right_on: completeData[i]?.right_on,
          },
        };
        // console.log(temporaryDeletedCards, completeData[i]?.map_id, "completeData[i]?.map_id")
        if (
          props.isEditModeOn &&
          !temporaryDeletedCards.includes(completeData[i]?.map_id)
        ) {
          obj["id"] = completeData[i]?.map_id ? completeData[i]?.map_id : null;
        }
        payload.push(obj);
      }
    }
    let finalPayload;
    let method;
    if (condition == "save") {
      finalPayload = {
        name: connectorData.name,
        description: connectorData.desc,
        user: getUserLocal(),
        maps: payload,
        integrated_file: integratedFilePath,
      };
      if (props.isEditModeOn) {
        url =
          UrlConstant.base_url +
          UrlConstant.integration_connectors +
          connector_id +
          "/"; // for saving
        method = "PUT";
      } else {
        url = UrlConstant.base_url + UrlConstant.integration_connectors; // for saving
        method = "POST";
      }
    } else if (condition == "integrate") {
      finalPayload = {
        name: connectorData.name,
        description: connectorData.desc,
        user: getUserLocal(),
        maps: payload,
      };
      if (props.isEditModeOn) {
        url =
          UrlConstant.base_url + UrlConstant.joining_the_table + "?edit=True"; //for generating
      } else {
        url = UrlConstant.base_url + UrlConstant.joining_the_table; //for generating
      }
      method = "POST";
    } else if (condition == "delete" && connector_id) {
      finalPayload = {};
      url =
        UrlConstant.base_url +
        UrlConstant.integration_connectors +
        connector_id +
        "/";
      method = "DELETE";
    } else if (condition == "view_details") {
      url =
        UrlConstant.base_url +
        UrlConstant.integration_connectors +
        connector_id +
        "/";
      finalPayload = {};
      method = "GET";
    } else if (condition == "delete_map_card" && props.isEditModeOn && map_id) {
      method = "DELETE";
      url =
        UrlConstant.base_url +
        UrlConstant.integration_connectors +
        map_id +
        "/?maps=True";
    } else {
      setLoader(false);
      return;
    }
    console.table(finalPayload, "PAYLOAD");
    callLoader(true)
    HTTPService(method, url, finalPayload, false, true, false)
      .then((res) => {
        callLoader(false);
        if (condition == "integrate") {
          console.log("inside integrate", res.data);
          setIntegratedFilePath(
            res?.data?.integrated_file ? res?.data?.integrated_file : ""
          );
          setNoOfRecords(
            res?.data?.no_of_records ? res?.data?.no_of_records : 0
          );

          setFinalDatasetAfterIntegration([...res.data?.data?.data]);
          let allKeys =
            res.data?.data?.data?.length > 0
              ? Object.keys(res.data.data.data[0])
              : [];
          if (allKeys.length > 1) {
            let arr = [...completeData];
            let obj = arr[index + 1];
            let first_obj = arr[index];
            first_obj["next_left"] = [...allKeys];
            first_obj["result"] = [...res.data?.data.data];
            obj["left"] = [...allKeys];
            obj["left_on"] = [];
            console.log("HERE IS THE CALL", arr.length, index);
            if (arr.length > 2 && index != arr.length - 2) {
              for (let i = index + 1; i < arr.length; i++) {
                arr[i]["left_on"] = [];
                arr[i]["result"] = [];
              }
              setIsAllConditionForSaveMet(false);
            } else {
              // setIsConditionForConnectorDataForSaveMet(true)
              setIsAllConditionForSaveMet(true);
            }
            arr[index] = { ...first_obj };
            arr[index + 1] = { ...obj };
            setCompleteData([...arr]);
            setOpen(true);
            setAlertType("success");
            setMessage("Data generated successfully!");
            let id = setTimeout(() => {
              setOpen(false);
              return clearTimeout(id);
            }, 2500);
            // document.querySelector('#previewTable').scrollIntoView({ behavior: 'smooth' });
          }
        } else if (condition == "save") {
          console.log("inside save", res.data);
          // setConnectorId(res?.data?.id ? res.data.id : "")
          setOpen(true);
          setAlertType("success");
          setMessage("Data saved successfully!");
          history.push("/datahub/connectors");
          resetAll();
          let id = setTimeout(() => {
            setOpen(false);
            return clearTimeout(id);
          }, 2500);
          // document.querySelector('#previewTable').scrollIntoView({ behavior: 'smooth' });
        } else if (condition == "delete") {
          console.log("inside delete", res);
          history.push("/datahub/connectors");
          resetAll();
          // setOpen(true);
          // setAlertType("success")
          // setMessage("Data deleted successfully!")
          // let id = setTimeout(() => {
          //     setOpen(false);
          //     return clearTimeout(id)
          // }, 2500)
        } else if (condition == "view_details") {
          console.log(res.data, "inside view_details");
          //setter function for pre prendering of the data
          setterForPreRender(res.data);
        }

        // goToTop(2000)
      })
      .catch((err) => {
        callLoader(false)
        if (err?.response?.status == 401 || err?.response?.status == 502) {
          history.push(GetErrorHandlingRoute(err));
        } else {
          if (condition == "integrate") {
            setIsAllConditionForSaveMet(false);
          }
          console.log(err);
          // console.log(Object.values(err?.response?.data)[0])
          setOpen(true);
          setLoader(false);
          setAlertType("error");
          setMessage(
            err?.response?.data
              ? Object.values(err?.response?.data)[0]
              : "Some error occurred while generating!"
          );
          let id = setTimeout(() => {
            setOpen(false);
            return clearTimeout(id);
          }, 2500);
          // if (condition == "view_details") {
          //     setIsEditModeOn(false)
          //     setIsDatasetIntegrationListModeOn(true)
          // }
          goToTop(0);
        }
      });
  };
  console.log(finalDatasetAfterIntegration);
  const handleChange = (e) => {
    console.log(e.target.value);
    let value = e.target.name;
    if (value == "name") {
      if (e.target.value && connectorData.name) {
        setIsConditionForConnectorDataForSaveMet(true);
        setIsAllConditionForSaveMet(true);
      } else {
        setIsConditionForConnectorDataForSaveMet(false);
        setIsAllConditionForSaveMet(false);
      }
      setErrorConnectorName("");
      // setConnectorData({
      //   ...connectorData,
      //   [e.target.name]: e.target.value,
      // });
      validateInputField(e.target.value, RegexConstants.connector_name)
        ? setConnectorData({
          ...connectorData,
          [e.target.name]: e.target.value,
        })
        : e.preventDefault();
    } else {
      if (e.target.value && connectorData.desc) {
        setIsConditionForConnectorDataForSaveMet(true);
        // setIsAllConditionForSaveMet(true);
      } else {
        setIsConditionForConnectorDataForSaveMet(false);
        // setIsAllConditionForSaveMet(false);
      }
      setErrorConnectorDesc("");
      setConnectorData({
        ...connectorData,
        [e.target.name]: e.target.value,
      });
      // validateInputField(e.target.value, RegexConstants.connector_name)
      //     ? setConnectorData({
      //         ...connectorData,
      //         [e.target.name]: e.target.value,
      //     })
      //     : e.preventDefault();
    }
  };

  //Download functionality
  const downloadDocument = () => {
    let uri;
    if (integratedFilePath[0] === "/") {
      uri = UrlConstant.base_url_without_slash + integratedFilePath;
    } else {
      uri = UrlConstant.base_url + integratedFilePath;
    }
    download(
      uri,
      connectorData.name ? connectorData.name : "Integrated_dataset"
    );
  };

  //number of integration handler
  const integrateMore = (value) => {
    if (counterForIntegrator == completeData.length) {
      setCounterForIntegration((pre) => pre + value);
    }
  };

  const download = (url, connector_name) => {
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", connector_name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const deleteConnector = () => {
    generateData(1, "delete");
  };
  useEffect(() => {
    getDataList("org_names");
    if (props.isEditModeOn && props.connectorIdForView) {
      generateData(0, "view_details");
    }
  }, [
    isEditModeOn,
    props.isEditModeOn,
    props.connectorIdForView,
    isDatasetIntegrationListModeOn,
  ]);
  console.log(props);
  return (
    <Box>
      <Box sx={{ marginLeft: "144px", marginRight: "144px" }}>
        <div className="text-left mt-50">
          <span className="add_light_text cursor-pointer" onClick={() => history.push('/datahub/connectors')}>Connectors</span>
          <span className="add_light_text ml-16">
            <img src={require("../../Assets/Img/dot.svg")} />
          </span>
          <span className="add_light_text ml-16">New connector</span>
        </div>
        <Typography
          className={`${globalStyle.bold600} ${globalStyle.size32}  ${globalStyle.dark_color} mt-50 text-left`}
          sx={{
            fontFamily: "Montserrat !important",
            lineHeight: "40px",
          }}
        >
          Create and integration connector
        </Typography>
        <TextField
          fullWidth
          className="mt-20"
          required
          name="name"
          sx={textFieldStyle}
          placeholder="Connector name"
          label="Connector name"
          value={connectorData.name}
          onChange={handleChange}
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={4}
          required
          className="mt-30"
          sx={textFieldStyle}
          name="desc"
          placeholder="Connector description not more that 512 character "
          label="Connector description not more that 512 character "
          value={connectorData.desc}
          onChange={handleChange}
          inputProps={{ maxLength: 512 }}
        />
        <SelectConnector
          text={"Select datasets for connector"}
          connectorName={connectorName}
          connectorDescription={connectorDescription}
          organisations={orgList}
          template={template}
          organisationName={organisationName}
          setOrganisationName={setOrganisationName}
          dataset={dataset}
          setDataset={setDataset}
          handleChangeSelector={handleChangeSelector}
          empty={empty}
          setTemplate={setTemplate}
          counterForIntegrator={counterForIntegrator}
          completeData={completeData}
          setCompleteData={setCompleteData}
          connectorData={connectorData}
          setConnectorData={setConnectorData}
          setIsConditionForConnectorDataForSaveMet={
            setIsConditionForConnectorDataForSaveMet
          }
        />
        <Box className="mt-30">
          <Divider />
        </Box>
        {completeData && completeData?.length ? (
          <>
            <Typography
              className={`${globalStyle.bold600} ${globalStyle.size32}  ${globalStyle.dark_color} mt-50 mb-20 text-left`}
              sx={{
                fontFamily: "Montserrat !important",
                lineHeight: "40px",
              }}
            >
              Integration Connector
            </Typography>
            <Box>
              <IntegrationConnector
                orgList={orgList}
                completeData={completeData}
                setCompleteData={setCompleteData}
                setIsAllConditionForSaveMet={setIsAllConditionForSaveMet}
                temporaryDeletedCards={temporaryDeletedCards}
                setTemporaryDeletedCards={setTemporaryDeletedCards}
                setTotalCounter={setTotalCounter}
                totalCounter={totalCounter}
                connectorTimeData={connectorTimeData}
                isEditModeOn={props.isEditModeOn}
                isConditionForConnectorDataForSaveMet={
                  isConditionForConnectorDataForSaveMet
                }
                setIsConditionForConnectorDataForSaveMet={
                  setIsConditionForConnectorDataForSaveMet
                }
                isEdited={isEdited}
                setIsEdited={setIsEdited}
                setIsEditModeOn={setIsEditModeOn}
                setIsDatasetIntegrationListModeOn={
                  setIsDatasetIntegrationListModeOn
                }
                integrateMore={integrateMore}
                empty={empty}
                setTemplate={setTemplate}
                template={template}
                counterForIntegrator={counterForIntegrator}
                resetAll={resetAll}
                generateData={generateData}
                joinType={joinType}
                setJoinType={setJoinType}
                connectorData={connectorData}
                setConnectorData={setConnectorData}
                finalDataNeedToBeGenerated={finalDataNeedToBeGenerated}
                setFinalDataNeedToBeGenerated={setFinalDataNeedToBeGenerated}
              // handleClickSelectDataset={handleClickSelectDataset}
              // handleChangeDatasetNameSelector={handleChangeDatasetNameSelector}
              />
            </Box>
          </>
        ) : (
          <Box className={style.mt114 + " " + style.mb139}>
            <EmptyFile text={"As of now, there is no dataset for connectors"} />
          </Box>
        )}
        {completeData.length > 0 &&
          finalDatasetAfterIntegration?.length > 0 && (
            <Box>
              <Preview
                temporaryDeletedCards={temporaryDeletedCards}
                integratedFilePath={integratedFilePath}
                noOfRecords={noOfRecords}
                isConditionForConnectorDataForSaveMet={
                  isConditionForConnectorDataForSaveMet
                }
                isAllConditionForSaveMet={isAllConditionForSaveMet}
                isEdited={isEdited}
                setIsEdited={setIsEdited}
                generateData={generateData}
                setIsDatasetIntegrationListModeOn={
                  setIsDatasetIntegrationListModeOn
                }
                deleteConnector={deleteConnector}
                counterForIntegrator={counterForIntegrator}
                completeData={completeData}
                isEditModeOn={props.isEditModeOn}
                integrateMore={integrateMore}
                resetAll={resetAll}
                connectorData={connectorData}
                downloadDocument={downloadDocument}
                finalDatasetAfterIntegration={finalDatasetAfterIntegration}
              />
            </Box>
          )}
        {/*
                <JoinLink />
                {/* <JoinedBy /> */}
      </Box>
    </Box>
  );
};

export default AddConnector;
