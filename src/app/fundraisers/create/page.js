"use client";
import CustomButton from "../../components/Button";
import AddIcon from "@mui/icons-material/Add";

export default function CreateFundraiserPage() {
  return (
    <div>
      <h1>Create Fundraiser</h1>
      <CustomButton
        onClick={() => alert("Create new fundraiser")}
        text="Create New"
        icon={<AddIcon />}
      />
    </div>
  );
}
