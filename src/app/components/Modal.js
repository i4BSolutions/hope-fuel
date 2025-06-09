"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Modal({
  open = true,
  onClose,
  maxWidth = "sm",
  title,
  children,
}) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back(); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={maxWidth}>
      {title && (
        <DialogTitle>
          {title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
