import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styles from "../dataset_integration.module.css"
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Button, CircularProgress } from '@mui/material';
import { Cpu } from 'react-bootstrap-icons';
const Join = (props) => {
    const { circleLoad, listOfDatasetSelected, listOfFilesSelected, listOfDatsetFileAvailableForColumn, generateData, finalDataNeedToBeGenerated } = props
    const [join, setJoin] = useState({})
    const [joinVal1, setJoinVal1] = useState("")
    const [joinVal2, setJoinVal2] = useState("")
    const [age, setAge] = React.useState('');
    const [joinType, setJoinType] = useState("")
    const [finalJoin, setFinalJoin] = useState({})
    const handleChange = (event, source) => {
        console.log(event.target.value)
        if (source == "val1") {
            setJoinVal1(event.target.value);
        } else {
            setJoinVal2(event.target.value)
        }
        if (finalJoin[event.target.value]) {
            let obj = { ...finalJoin }
            delete obj[event.target.value]
            setFinalJoin(obj)
        }
        let list = [...Object.keys(listOfDatsetFileAvailableForColumn)];
        let join1Obj = list.filter((each, index) => {
            return each == event.target.value
        })
        let obj = { [event.target.value]: listOfDatsetFileAvailableForColumn[join1Obj[0]] }
        setJoin({ ...obj, ...join })
    };

    const handleChangeJoin = (e, source) => {
        if (source == "join1") {
            setFinalJoin({ ...finalJoin, [joinVal1]: e.target.value })
        } else {
            setFinalJoin({ ...finalJoin, [joinVal2]: e.target.value })
        }
    }
    console.log(listOfDatsetFileAvailableForColumn, "listOfDatsetFileAvailableForColumn")
    let arr = Object.keys(finalDataNeedToBeGenerated)
    let firstColms = finalDataNeedToBeGenerated[arr[0]]
    let secondColms = finalDataNeedToBeGenerated[arr[1]]
    useEffect(() => {
    }, [])
    return (
        <Container className='dataset_selector_in_integration'>
            <Row>
                <Col className={styles.select_dataset_logo} lg={8} sm={12} sx={12}>
                    <span >Join</span>
                </Col>
            </Row>
            <Row>
                <Col lg={2}>
                    <FormControl variant="standard" style={{ width: "80%" }}>
                        <InputLabel id="primary_join_type_label">Join type</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="primary_join_type_select"
                            value={joinType}
                            onChange={(e) => setJoinType(e.target.value)}
                            label="Primary dataset"
                        >
                            <MenuItem value="">
                                <em>Clear</em>
                            </MenuItem>
                            <MenuItem value="left">
                                Left
                            </MenuItem>
                            <MenuItem value="right">
                                Right
                            </MenuItem>
                            <MenuItem value="inner">
                                Inner
                            </MenuItem>
                            <MenuItem value="outer">
                                Outer
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Col>

                <Col lg={4} sm={12}>
                    <Row>
                        <Col lg={6} sm={6}>
                            <FormControl variant="standard" style={{ width: "80%" }}>
                                <InputLabel id="primary_dataset_label_for_join">Primary dataset</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="primary_dataset_select_for_join"
                                    value={joinVal1}
                                    onChange={(e) => handleChange(e, "val1")}
                                    label="Primary dataset"
                                >
                                    <MenuItem value="">
                                        <em>Clear</em>
                                    </MenuItem>
                                    {Object.keys(listOfDatsetFileAvailableForColumn).map((eachFile, index) => {
                                        if (listOfFilesSelected.includes(eachFile)) {
                                            if (eachFile != joinVal1) {
                                                return <MenuItem value={eachFile}>{eachFile.split("/")[eachFile.split("/").length - 1]}</MenuItem>
                                            } else {
                                                return <MenuItem disabled value={eachFile}>{eachFile.split("/")[eachFile.split("/").length - 1]}</MenuItem>

                                            }
                                        }
                                    })}
                                </Select>
                            </FormControl>
                        </Col>
                        <Col lg={6} sm={6}>
                            <FormControl variant="standard" style={{ width: "80%" }}>
                                <InputLabel id="demo-simple-select-standard-label">Primary dataset column name</InputLabel>
                                <Select
                                    labelId="primary_col_label_for_join"
                                    id="primary_col_select_for_join"
                                    value={finalJoin.first}
                                    onChange={(e) => handleChangeJoin(e, "join1")}
                                    label="Primary dataset colounm name"
                                >
                                    <MenuItem value="">
                                        <em>Clear</em>
                                    </MenuItem>
                                    {finalDataNeedToBeGenerated[joinVal1]?.map((eachFile, index) => {
                                        return <MenuItem value={eachFile}>{eachFile}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                </Col>
                <Col lg={1} sm={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <DragHandleIcon />
                </Col>
                <Col lg={4} sm={12}>
                    <Row>
                        <Col lg={6} sm={6}>
                            <FormControl variant="standard" style={{ width: "80%" }}>
                                <InputLabel id="secondary_dataset_label_for_join">Primary dataset</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="secondary_dataset_select_for_join"
                                    value={joinVal2}
                                    onChange={(e) => handleChange(e, "val2")}
                                    label="Primary dataset"
                                >
                                    <MenuItem value="">
                                        <em>Clear</em>
                                    </MenuItem>
                                    {Object.keys(listOfDatsetFileAvailableForColumn).map((eachFile, index) => {
                                        if (eachFile != joinVal1) {
                                            return <MenuItem value={eachFile}>{eachFile.split("/")[eachFile.split("/").length - 1]}</MenuItem>
                                        } else {
                                            return <MenuItem disabled value={eachFile}>{eachFile.split("/")[eachFile.split("/").length - 1]}</MenuItem>

                                        }
                                    })}
                                </Select>
                            </FormControl>
                        </Col>
                        <Col lg={6} sm={6}>
                            <FormControl variant="standard" style={{ width: "80%" }}>
                                <InputLabel id="secondary_col_label_for_join">Primary dataset column name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="secondary_col_select_for_join"
                                    value={finalJoin.second}
                                    onChange={(e) => handleChangeJoin(e, "join2")}
                                    label="Primary dataset colounm name"
                                >
                                    <MenuItem value="">
                                        <em>Clear</em>
                                    </MenuItem>
                                    {finalDataNeedToBeGenerated[joinVal2]?.map((eachFile, index) => {
                                        return <MenuItem value={eachFile}>{eachFile}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col lg={12} sm={12} className={styles.generate_btn_parent_col}>
                    {console.log(joinVal1, joinVal2, finalJoin)}
                    <Button id='generate_button' className={(joinType && joinVal1 && joinVal2 && finalJoin[joinVal1] && finalJoin[joinVal2] && Object.keys(finalJoin).length >= 2 && arr.length >= 2 && firstColms.length > 0 && secondColms.length > 0) ? styles.generate_data_btn : styles.generate_data_btn_dis} onClick={() => generateData(finalJoin[joinVal1], finalJoin[joinVal2], joinType)}>
                        Generate data
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Join