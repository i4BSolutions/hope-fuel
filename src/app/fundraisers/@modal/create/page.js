"use client";
import FundraisingForm from "../../components/fundraisingForm";

import Modal from "../../../components/Modal";
export default function CreateFundraiserModal() {


  return (
    <Modal maxWidth="md">
      <FundraisingForm />
    </Modal>
  );
}
