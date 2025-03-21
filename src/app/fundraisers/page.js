"use client";
import CustomButton from "../components/Button";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useRouter } from "next/navigation";

const FundraisingFormPage = () => {
    const router = useRouter();
    return (
      <>
        <CustomButton
          onClick={() => {
           router.push("/fundraisers/create", { scroll: false });
          }}
          text="Create New"
          icon={<AddCircleOutlineOutlinedIcon />}
        />
      </>
    );

};
export default FundraisingFormPage;