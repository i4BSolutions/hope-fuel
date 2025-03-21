"use client";
import FundraisingForm from "../../components/fundraisingForm";

import Modal from "../../../components/Modal";
export default function CreateFundraiserModal() {


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <Modal>
          <FundraisingForm />
        </Modal>
      </div>
    </div>
  );
}
