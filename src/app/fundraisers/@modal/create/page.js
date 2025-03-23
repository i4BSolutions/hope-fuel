"use client";
import FundraisingForm from "../../components/FundraisingForm";

import Modal from "../../../components/Modal";
export default function CreateFundraiserModal() {


  return (
    <Modal maxWidth="sm" maxHeight="100vh">
      <FundraisingForm />
    </Modal>
  );
}
