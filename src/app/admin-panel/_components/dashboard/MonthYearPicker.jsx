import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import useForkRef from "@mui/utils/useForkRef";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  useParsedFormat,
  usePickerContext,
  useSplitFieldProps,
} from "@mui/x-date-pickers/hooks";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useValidation, validateDate } from "@mui/x-date-pickers/validation";
import dayjs from "dayjs";

function ButtonDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, "date");

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      color={hasValidationError ? "error" : "primary"}
      ref={handleRef}
      className={pickerContext.rootClassName}
      sx={{
        ...pickerContext.rootSx,
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: "0 5px 0 12px",
        borderWidth: "2px",
        gap: "2px",
        color: (theme) =>
          hasValidationError
            ? theme.palette.primary.main
            : theme.palette.neutral.grey900,

        borderColor: (theme) =>
          hasValidationError
            ? theme.palette.primary.main
            : theme.palette.neutral.grey300,
        "&:hover": {
          backgroundColor: (theme) =>
            hasValidationError
              ? theme.palette.primary.red50
              : theme.palette.neutral.grey50,
        },
      }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
        {pickerContext.label ? `${pickerContext.label}: ${valueStr}` : valueStr}
      </Typography>
      <ExpandMoreIcon sx={{ mb: 0.2 }} />
    </Button>
  );
}

function ButtonFieldDatePicker(props) {
  return (
    <DatePicker
      {...props}
      slots={{ ...props.slots, field: ButtonDateField }}
      format="MMMM YYYY"
      views={["month", "year"]}
      yearsOrder="desc"
      maxDate={dayjs()}
      value={props.currentMonth}
      onChange={(newValue) => {
        props.handleMonthChange(newValue);
      }}
    />
  );
}

export default function MonthYearPicker({ currentMonth, handleMonthChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonFieldDatePicker
        currentMonth={currentMonth}
        handleMonthChange={handleMonthChange}
      />
    </LocalizationProvider>
  );
}
