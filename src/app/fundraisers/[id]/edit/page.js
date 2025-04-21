"use client";

import { useEffect, useState } from "react";
import FundraisingForm from "../../components/FundraisingForm";
import { useParams, useRouter } from "next/navigation";
import Modal from "../../../components/Modal";

function FundraiserEditPage() {
  const { id } = useParams();
  const router = useRouter();

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
      await fetch(`/api/v1/fundraisers/update/${id}`, {
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
        <Modal maxWidth="sm" maxHeight="100vh">
          <FundraisingForm
            defaultValues={fundraiser}
            onSubmitHandler={handleSubmit}
            onCancel={() => router.back()}
          />
        </Modal>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default FundraiserEditPage;
