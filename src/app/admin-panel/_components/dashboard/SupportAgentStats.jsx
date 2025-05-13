import dayjs from "dayjs";

export default function SupportAgentStats({ currentMonth }) {
  return (
    <div>
      <h3>Support Agent Stats for {dayjs(currentMonth).format("MMMM YYYY")}</h3>
    </div>
  );
}
