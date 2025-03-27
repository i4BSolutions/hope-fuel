"use client";

import { useEffect, useState } from "react";
import FundraisingForm from "../../components/FundraisingForm";
import { useParams } from "next/navigation";
import Modal from "../../../components/Modal";

function FundraiserEditPage() {
  const { id } = useParams();

  const [fundraiser, setFundraiser] = useState(null);

  useEffect(() => {
    const fetchFundraiser = async () => {
      const response = await fetch(`/api/v1/fundraisers/details/${id}`);
      const result = await response.json();
      if (response.ok && result.data) {
        const transformed = {
          ...result.data,
          ...result.data.ContactLinks,
        };
        setFundraiser(transformed);
      }
    };

    fetchFundraiser();
  }, []);

  const handleSubmit = async (data) => {
    console.log("Data:", data);
    try {
      const response = await fetch(`/api/v1/fundraisers/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
    } catch (error) {
      console.log("Error:", error);
      throw new Error("Failed to update fundraiser");
      
    }
   
  };


  return (
    <>
      {fundraiser ? (
        <Modal>
          <FundraisingForm defaultValues={fundraiser} onSubmitHandler={handleSubmit} />
        </Modal>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default FundraiserEditPage;
