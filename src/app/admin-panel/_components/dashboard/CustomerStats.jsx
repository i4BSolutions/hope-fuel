import dayjs from "dayjs";
import { useEffect } from "react";

export default function CustomerStats({ currentMonth }) {
  useEffect(() => {
    console.log("Current Month for customers:", currentMonth);
  }, [currentMonth]);

  return (
    <div>
      <h3>Customer Stats for {dayjs(currentMonth).format("MMMM YYYY")}</h3>
    </div>
  );
}
