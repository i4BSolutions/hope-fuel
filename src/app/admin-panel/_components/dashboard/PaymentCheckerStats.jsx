import dayjs from "dayjs";

export default function PaymentCheckerStats({ currentMonth }) {
  return (
    <div>
      <h3>
        Payment checker Stats for {dayjs(currentMonth).format("MMMM YYYY")}
      </h3>
    </div>
  );
}
