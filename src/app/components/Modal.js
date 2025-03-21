"use client";


import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function Modal({ children }) {
  const router = useRouter();

  return (
    <Dialog
      open={true} 
      onClose={() => router.back()} 
      fullWidth
      maxWidth="sm" 
    >
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}
