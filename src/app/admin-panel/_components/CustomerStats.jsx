import dayjs from "dayjs";

export default async function CustomerStats({ currentMonth }) {
  console.log("CustomerStats", currentMonth);
  await new Promise((res) => setTimeout(res, 1000));
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await res.json();

  return (
    <div>
      <h3>📊 Customer Stats for {dayjs(currentMonth).format("MMMM YYYY")}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
