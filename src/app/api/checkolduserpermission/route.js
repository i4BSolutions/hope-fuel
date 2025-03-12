export const dynamic = "force-dynamic";
import db from "../../utilites/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  let json = await request.json();

  const { name, email } = json;

  try {
    // check the user latest transaction in mysql if exist

    const transaction = await db(
      `SELECT t.* 
        FROM Transactions t
        INNER JOIN Customer c ON t.CustomerID = c.CustomerID
        WHERE c.Name = ? 
          AND c.Email = ?
          AND (t.PaymentDenied IS NULL OR t.PaymentDenied = 1 OR t.PaymentDenied = 0)
        ORDER BY t.TransactionDate DESC
        LIMIT 1;`,
      [name, email]
    );

    console.log("thisisthero");
    console.log(transaction);

    // if transacation hasn't been checked yet
    if (transaction.length > 0 && transaction[0]["PaymentDenied"] == 1) {
      console.log("hello world");
      return NextResponse.json(true);
    } else if (
      transaction.length > 0 &&
      (transaction[0]["PaymentDenied"] == null ||
        transaction[0]["PaymentDenied"] == 0)
    ) {
      console.log("transaction this month permission is checking");
      let latestTransaction = transaction[0];
      console.log(latestTransaction);
      let latestTransactionDate = new Date(
        latestTransaction["TransactionDate"]
      );

      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();

      let answer =
        latestTransactionDate.getMonth() < currentMonth ||
        latestTransactionDate.getFullYear() < currentYear;
      console.log("answer", answer);
      return NextResponse.json(answer);
    }

    let answer = await checkPermission(name, email);
    return NextResponse.json(answer);
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ message: "error checking user " }); // Return false in case of an error
  }
}

// check the permission in air table
async function checkPermission(name, email) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer patur9N4mKx7GpWZv.da71f016c51cd75abbcea2d3efae8b4dcc2d73af79e75be47183822e8439def1"
  );
  // myHeaders.append("Cookie", "brw=brwb8tzTqMzSEOnxJ; AWSALB=VqfDhfXjv8JiCp3lJNYXbUYmTndWTwyFShNBsWdkDM8qt85zGxNFW9yr+/FLQmTw7nAbahafAP1b1jC/mCjL+x5gJx8QYlmSGSeiIh1TKQ/PZosgNCkmW1HYRcwe; AWSALBCORS=VqfDhfXjv8JiCp3lJNYXbUYmTndWTwyFShNBsWdkDM8qt85zGxNFW9yr+/FLQmTw7nAbahafAP1b1jC/mCjL+x5gJx8QYlmSGSeiIh1TKQ/PZosgNCkmW1HYRcwe");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let userNameURL = encodeURIComponent(name);
  let emailURL = encodeURIComponent(email);

  let response = await fetch(
    `https://api.airtable.com/v0/appp80DDZ7FHxqCc1/tblm1UaS2JsGRqPrM?fields%5B%5D=notion_create_time&fields%5B%5D=Create+Time&filterByFormula=IF(AND(%22${userNameURL}%22+%3D+TRIM(Name)%2C+%22${emailURL}%22+%3D+TRIM(Email)%2C'%E1%80%95%E1%80%9A%E1%80%BA%E1%80%96%E1%80%BB%E1%80%80%E1%80%BA'+!%3D+Status)%2CTRUE()%2C+FALSE()+)&maxRecords=1&sort%5B0%5D%5Bfield%5D=Create+Time&sort%5B0%5D%5Bdirection%5D=desc`,
    requestOptions
  );

  let json = await response.json();
  let records = await json.records;

  let record = records[0].fields;
  let now = new Date().getMonth();
  let nowYear = new Date().getFullYear();
  if (Object.hasOwn(record, "notion_create_time")) {
    let lastestTranscation = new Date(record["notion_create_time"]);
    let lastestTranscationMonth = lastestTranscation.getMonth();
    let lastestTranscationYear = lastestTranscation.getFullYear();

    let answer =
      lastestTranscationMonth < now || lastestTranscationYear < nowYear;
    // only allow if latest transaction month is past
    return answer;
  }

  let lastestTranscation = new Date(record["Create Time"]);
  let lastestTranscationMonth = lastestTranscation.getMonth();

  let lastestTranscationYear = lastestTranscation.getFullYear();
  let answer =
    lastestTranscationMonth < now || lastestTranscationYear < nowYear;
  return answer;
}
