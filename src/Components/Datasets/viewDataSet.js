import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import labels from '../../Constants/labels';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { dateTimeFormat } from '../../Utils/Common'
import UrlConstants from "../../Constants/UrlConstants";
import Avatar from '@mui/material/Avatar';
export default function ViewDataSet(props) {
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    const [isLoader, setIsLoader] = useState(false)
    return (
        <><Row>
            <Col className="supportViewDetailsbackimage" >
                <span onClick={() => props.back()}>
                    <img
                        src={require('../../Assets/Img/Vector.svg')}
                        alt="new"
                    />
                </span>
                <span className="supportViewDetailsback" onClick={() => props.back()}>{"Back"}</span>
            </Col>
        </Row>
            <Row className="supportViewDeatilsSecondRow"></Row>
            <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                <span className="mainheading">{"Dataset Details"}</span>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "30px", "text-align": "left" }}>
                <Col>
                    <span className="secondmainheading">{"Dataset Name"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Description"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Data Category"}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "5px", "text-align": "left" }}>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.name}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.description}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">
                        {props.rowdata.category['crop_data'] ? "Crop data" : ''}
                        {props.rowdata.category['cultivation'] ? " | Cultivation data" : ''}
                        {props.rowdata.category['practice_data'] ? " | Practice data" : ''}
                        {props.rowdata.category['farmer_profile'] ? " | Farmer profile" : ''}
                        {props.rowdata.category['land_records'] ? " | Land records" : ''}
                        {props.rowdata.category['soil_data'] ? " | Soil data" : ''}
                        {props.rowdata.category['weather_data'] ? " | Weather data" : ''}
                        {props.rowdata.category['research_data'] ? " | Research data" : ''}
                    </span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "40px", "text-align": "left" }}>
                <Col>
                    <span className="secondmainheading">{"Geography"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Corp Detail"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Constantly updating"}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "5px", "text-align": "left" }}>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.geography}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.crop_detail}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.constantly_update ? 'Yes' : 'No'}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "40px", "text-align": "left" }}>
                <Col>
                    <span className="secondmainheading">{"Age of Actual Data"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Data Capture Interval"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Size of Actual Data (Records)"}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "5px", "text-align": "left" }}>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.age_of_date}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.data_capture_start ? dateTimeFormat(props.rowdata.data_capture_start, false) + " - " : 'N/A - '}{props.rowdata.data_capture_end ? dateTimeFormat(props.rowdata.data_capture_end, false) : 'N/A'}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.dataset_size}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "40px", "text-align": "left" }}>
                <Col>
                    <span className="secondmainheading">{"Connector Availablity"}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "5px", "text-align": "left" }}>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.connector_availability}</span>
                </Col>
            </Row>
            <Row className="supportViewDeatilsSecondRow"></Row>
            {!props.isAdminView?<><Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                <span className="mainheading">{"Organization details"}</span>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "30px", "text-align": "left" }}>
                <Col>
                    <span className="secondmainheading">{"Contact Person's Name"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Organization Name"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Email"}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "5px", "text-align": "left" }}>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.user.first_name}{" "}{props.rowdata.user.last_name}</span>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            {props.rowdata.organization.logo ? <Avatar
                                alt={props.rowdata.organization.name}
                                src={UrlConstants.base_url_without_slash + props.rowdata.organization.logo}
                                sx={{ width: 56, height: 56 }}
                            /> : <Avatar sx={{ bgcolor: "#c09507", width: 56, height: 56 }} aria-label="recipe">{props.rowdata.organization.name.charAt(0)}</Avatar>}
                        </Col>
                        <Col style={{ "margin-left": "-63%", "margin-top": "3%" }}><span className="thirdmainheading">{props.rowdata.organization.name}</span></Col>
                    </Row>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.organization.org_email}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "30px", "text-align": "left" }}>
                <Col>
                    <span className="secondmainheading">{"Contact Number"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"Address"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{""}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "5px", "text-align": "left" }}>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.organization['name']}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.organization['address']['address']}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{""}</span>
                </Col>
            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "30px", "text-align": "left" }}>
                <Col>
                    <span className="secondmainheading">{"Country"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{"PIN Code"}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{""}</span>
                </Col>

            </Row>
            <Row style={{ "margin-left": "79px", "margin-top": "5px", "text-align": "left" }}>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.organization['address']['country']['label']}</span>
                </Col>
                <Col>
                    <span className="thirdmainheading">{props.rowdata.organization['address']['pincode']}</span>
                </Col>
                <Col>
                    <span className="secondmainheading">{""}</span>
                </Col>
            </Row>
            <Row className="supportViewDeatilsSecondRow"></Row></>:<></>}
            <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                <span className="mainheading" >{"Sample data table"}</span><span style={{ "margin-left": "67%" }} onClick={() => props.downloadAttachment(props.rowdata.sample_dataset)}>
                    <img
                        src={require('../../Assets/Img/download.svg')}
                        alt="new"
                    />
                </span>
                <span className="supportViewDetailsback" style={{ "margin-top": "4px" }} onClick={() => props.downloadAttachment(props.rowdata.sample_dataset)}>{"Download sample data"}</span>
            </Row>
            <Row style={{
                border: "1px solid #DFDFDF",
                "margin-left": "93px",
                "margin-top": "10px",
                "margin-right": "70px",
                overflow: "scroll"
            }}>
                <Col><Table aria-label="simple table" style={{ overflow: "scroll" }}>
                    <TableHead >
                        <TableRow>
                            {props.tabelkeys.map((key) => (<TableCell>{key}</TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rowdata.content.map((row) => (
                            <TableRow
                                key={row.name}
                            >
                                {props.tabelkeys.map((key) => (<TableCell>{row[key]}</TableCell>))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table></Col>
            </Row>

        </>
    );
}
