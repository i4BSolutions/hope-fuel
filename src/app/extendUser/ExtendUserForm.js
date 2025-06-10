"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AGENT_ROLE } from "../../lib/constants";
import { useAgentStore } from "../../stores/agentStore";
import ExtendForm from "../createForm/extendForm";
import ExtendOrNot from "../createForm/extendOrNot";
import checkPrfSubmit from "../utilites/ExtendUser/checkPrfSubmit";

const ExtendUserForm = () => {
  const { agent } = useAgentStore();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [hasPermissionThisMonth, setHasPermissionThisMonth] = useState(true);
  const [checkInputComplete, setCheckInputComplete] = useState(false);
  const [hasContinue, setHasContinue] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOtpComplete = async (value) => {
    setCheckInputComplete(true);
    setIsChecking(true);
    
    await checkPrfSubmit(
      value,
      setUserExist,
      setIsChecking,
      setUserInfo,
      setHasPermissionThisMonth,
      agent.roleId
    );
    setIsChecking(false);
  };

  const handleDecline = () => {
    setOtp("");
    setUserInfo({});
    setHasContinue(false);
    setUserExist(false);
    setCheckInputComplete(false);
  };

  return (
    <Box
      sx={{
        mt: 4,
        maxWidth: 900,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <MuiOtpInput
        value={otp}
        length={7}
        onComplete={handleOtpComplete}
        onChange={setOtp}
      />

      {!userExist && checkInputComplete && !isChecking && (
        <>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            ဒီ user မရှိပါဘူး — <strong>အရင်စာရင်းသွင်းပါ</strong>
          </Alert>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="flex-end"
            sx={{ mt: 3, mb: 2 }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setOtp("");
                setCheckInputComplete(false);
              }}
            >
              သက်တမ်းပြန်တိုးမယ်
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => router.push("/createForm")}
            >
              အသစ်သွင်းမယ်
            </Button>
          </Stack>
        </>
      )}

      {isChecking && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Checking user...</Typography>
        </Box>
      )}

      {userExist && checkInputComplete && !isChecking && (
        <>
          {!hasPermissionThisMonth && agent.roleId !== AGENT_ROLE.ADMIN ? (
            <Typography>
              ယခုလအတွင်း ဖော်ပြပါထောက်ပို့တပ်သားအတွက် စာရင်းသွင်းထားပြီးပါပြီ။
              ထူးခြားဖြစ်စဥ် ဖြစ်ပါက Admin ကိုဆက်သွယ်ပါ
            </Typography>
          ) : !hasContinue ? (
            <ExtendOrNot
              userInfo={userInfo}
              onConfirm={() => setHasContinue(true)}
              onDecline={handleDecline}
            />
          ) : (
            <ExtendForm
              userInfo={userInfo}
              setLoading={setLoading}
              onSuccess={() => setIsSuccessModalOpen(true)}
            />
          )}
        </>
      )}

      <Modal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        aria-labelledby="success-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 50, color: "green" }} />
          <Typography sx={{ fontSize: 18, fontWeight: "bold", mt: 2, mb: 2 }}>
            Membership Registration Successful.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setIsSuccessModalOpen(false);
              window.location.reload();
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ExtendUserForm;
