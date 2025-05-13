import { Popover, List, ListItem, ListItemText } from "@mui/material";
import { MouseEvent } from "react";

export default function WalletPopover({ anchorEl, open, onClose, wallets }) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { minWidth: 160, boxShadow: 3, borderRadius: 2 } }}
    >
      <List dense>
        {wallets.map((wallet, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={wallet} />
          </ListItem>
        ))}
      </List>
    </Popover>
  );
}
