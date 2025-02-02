import add_new from "../../Assets/Img/add_new.svg";
import { Card } from "@mui/material";
import React from "react";
import labels from "../../Constants/labels";

const cardSx = {
  maxWidth: 368,
  height: 190,
  border: "1px solid #2CD37F",
  borderRadius: "10px",
  "&:hover": {
    boxShadow: "-40px 40px 80px rgba(145, 158, 171, 0.16)",
    cursor: "pointer",
  },
};

const AddDataSetCardNew = ({ history, addDataset, title, description }) => {
  return (
    <Card
      id="dataset-add-new-dataset-in-gridview"
      className="card cursor-pointer"
      data-testid="add_dataset_card"
      sx={cardSx}
      onClick={() => history.push(addDataset())}
    >
      <div className="add_new_dataset">
        {title ?? `Add New ${labels.renaming_modules.datasets}`}
      </div>
      <div>
        <img src={add_new} alt="add" />
      </div>
      <div className="add_new_dataset_text">
        {description ??
          `Add details about your ${labels.renaming_modules.datasets}.`}
      </div>
    </Card>
  );
};

export default AddDataSetCardNew;
