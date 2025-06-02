import InboxIcon from "@mui/icons-material/Inbox";
import { Box, LinearProgress, Typography } from "@mui/material";

const itemsPerPage = 8;

const FormFillingAgentRateTable = ({
  data,
  page = 1,
  setPage,
  headerColor = "#DC2626",
  progressColor = "#DC2626",
}) => {
  // const totalPages = Math.ceil(data.AssignedAgents.length / itemsPerPage);

  // const currentAgents = data.AssignedAgents.slice(
  //   (page - 1) * itemsPerPage,
  //   page * itemsPerPage
  // );

  // const handlePageChange = (event, value) => {
  //   setPage(value);
  // };

  const currentAgents = data.AssignedAgents;

  return (
    <Box sx={{ width: "49%" }}>
      <Box
        sx={{
          overflow: "hidden",
          minHeight: currentAgents.length > 0 ? "auto" : "410px",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              backgroundColor: headerColor,
              color: "white",
              py: 2,
              px: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              component="h5"
              fontWeight="bold"
              sx={{
                color: "#FFFFFF",
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-2%",
              }}
            >
              {data.GroupName}
            </Typography>
            <Typography
              variant="h2"
              component="div"
              fontWeight="bold"
              sx={{
                color: "#FFFFFF",
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: "56px",
                letterSpacing: "-4%",
              }}
            >
              {data.TotalTransactionCount.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 4,
              pb: 2,
              borderRight: 2,
              borderLeft: 2,
              borderBottom: 2,
              borderBottomRightRadius: 24,
              borderBottomLeftRadius: 24,
              borderColor: "#CBD5E1",
            }}
          >
            {currentAgents.length > 0 ? (
              currentAgents.map((agent, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: "#0F172A",
                        fontSize: "20px",
                        fontWeight: 500,
                        letterSpacing: "-2%",
                        lineHeight: "34px",
                      }}
                    >
                      {`${index + 1}. ${agent.Username}`}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        color: "#0F172A",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "34px",
                        letterSpacing: "-2%",
                      }}
                    >
                      {agent.TransactionCount}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "100%", mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        data.TotalTransactionCount > 0
                          ? (agent.TransactionCount /
                              data.TotalTransactionCount) *
                            100
                          : 0
                      }
                      sx={{
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: "#E2E8F0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: progressColor,
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 2,
                  justifyContent: "center",
                  width: "100%",
                  height: "300px",
                }}
              >
                <InboxIcon sx={{ fontSize: 60, color: "#999999" }} />
                <Typography
                  sx={{
                    color: "#000000",
                    fontWeight: 600,
                    fontSize: "22px",
                    lineHeight: "28px",
                    letterSpacing: "-2%",
                    mt: 1,
                  }}
                >
                  There is no form filling agent rates.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* {data.AssignedAgents.length > itemsPerPage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 2,
            }}
          >
            <Stack spacing={2} direction="row" alignItems="center">
              <KeyboardArrowLeftIcon />
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                hideNextButton
                hidePrevButton
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 0,
                    mx: 0.5,
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EF4444",
                    color: "#EF4444",
                  },
                }}
              />
              <KeyboardArrowRightIcon />
            </Stack>
          </Box>
        )} */}
      </Box>
    </Box>
  );
};

export default FormFillingAgentRateTable;
