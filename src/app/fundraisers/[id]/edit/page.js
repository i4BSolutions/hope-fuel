"use client";

import { useEffect, useState, } from "react";
import FundraisingForm from "../../components/FundraisingForm";
import { useParams } from "next/navigation";

function FundraiserEditPage() {
  const [fundraiser, setFundraiser] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    const fetchFundraiser = async () => {
      const response = await fetch(
        `/api/v1/fundraisers/details/${id}`
      );
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
      {console.log("Fundraisers from EditPgae::: ", fundraiser)}
      {fundraiser ? (
        <FundraisingForm
         defaultValues={fundraiser}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default FundraiserEditPage;
