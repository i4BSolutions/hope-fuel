import dayjs from "dayjs";

export default async function SupportAgentStats({ currentMonth }) {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await res.json();
  return (
    <div>
      <h3>📊 Agent Stats for {dayjs(currentMonth).format("MMMM YYYY")}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
