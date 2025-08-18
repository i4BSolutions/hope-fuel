import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import moment from "moment-timezone";

const EditHistory = ({ historyData }) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "90vh",
        borderRadius: 2,
        outline: "none",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          py: 5,
          bgcolor: "#f9f9f9",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: "#0F172A",
            fontWeight: 600,
            fontSize: 28,
          }}
          variant="h5"
          id="edit-history-modal"
          fontWeight="medium"
        >
          Edit History
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          maxHeight: "calc(90vh - 70px)",
          alignSelf: "center",
        }}
      >
        <List sx={{ py: 0 }}>
          {historyData.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  display: "block",
                  p: 0,
                }}
              >
                {!item.isOriginal ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "8px",
                        mr: 2,
                        "&::before": {
                          content: '""',
                          display: "block",
                          width: "8px",
                          height: "60px",
                          bgcolor: "#FF9800",
                        },
                      }}
                    />
                    <ListItemText
                      primaryTypographyProps={{
                        color: "#000000",
                        fontSize: 14,
                        fontWeight: 400,
                      }}
                      primary={moment(item.timestamp).format(
                        "DD-MM-YYYY HH:mm"
                      )}
                      secondary={`Edited by ${item.editedBy}`}
                      secondaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "8px",
                        mr: 2,
                        "&::before": {
                          content: '""',
                          display: "block",
                          width: "8px",
                          height: "30px",
                          bgcolor: "#F44336",
                          borderRadius: "4px",
                        },
                      }}
                    />
                    <ListItemText primary="Original" />
                  </Box>
                )}

                <Box
                  sx={{
                    p: 2,
                    pl: 2,
                    pr: 2,
                    bgcolor: "#FFFFFF",
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{ borderRadius: 1, py: 1, px: 1, minWidth: 460 }}
                  >
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            component="th"
                            sx={{
                              pl: 0,
                              color: "#0F172A",
                              fontWeight: 600,
                              borderBottom: "none",
                              width: "100px",
                            }}
                          >
                            {item.FieldChanged}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#0F172A",
                              borderBottom: "none",
                              fontWeight: 400,
                              fontSize: 18,
                            }}
                          >
                            {item.NewValue}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>
                </Box>
              </ListItem>
              {index < historyData.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default EditHistory;
