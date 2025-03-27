"use client";

import { useEffect, useState } from "react";
import FundraisingForm from "../../components/FundraisingForm";
import { useParams } from "next/navigation";
import Modal from "../../../components/Modal";

function FundraiserEditPage() {
  console.log("FundraiserEditPage::: ");
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

  return (
    <>
      {fundraiser ? (
        <Modal>
          <FundraisingForm defaultValues={fundraiser} />
        </Modal>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default FundraiserEditPage;
