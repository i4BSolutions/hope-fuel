"use client";
import CreateButton from "../components/CreateButton";

export default function CreateFundraiserPage() {
  return (
    <div>
      <h1>Create Fundraiser</h1>
      <CreateButton onClick={() => alert("Create new fundraiser")} />
    </div>
  );
}
