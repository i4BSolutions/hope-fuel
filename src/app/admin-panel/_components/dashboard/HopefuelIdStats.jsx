import dayjs from "dayjs";

export default function HopefuelIdStats({ currentMonth }) {
  return (
    <div>
      <h3>
        HopefuelIdStats Stats for {dayjs(currentMonth).format("MMMM YYYY")}
      </h3>
    </div>
  );
}
