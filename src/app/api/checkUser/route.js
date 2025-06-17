// accept name and email
// return if user don't exist => return {message: false}
// if user exist => return {message: true, name: name, email: emai; prfNo: prfNo}

export const dynamic = "force-dynamic"; // defaults to force-static
export async function POST(request) {
  const { name, email } = await request.json();

  //get the customer data base
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.AIRTABLE_TOKEN}`);
  // myHeaders.append("Cookie", "brw=brwb8tzTqMzSEOnxJ; AWSALB=q0M9u0z8adQoHf839TIv42MWfxs27RilDRAi9z1GULKpLzBj+OW1pgPIfs9tEtyfrKt48Z7hLNYC11hQ9rkfdml27PiOPeUDeuL9hycGodaQFHXJbIwdbGOU2CWr; AWSALBCORS=q0M9u0z8adQoHf839TIv42MWfxs27RilDRAi9z1GULKpLzBj+OW1pgPIfs9tEtyfrKt48Z7hLNYC11hQ9rkfdml27PiOPeUDeuL9hycGodaQFHXJbIwdbGOU2CWr");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  let userNameURL = encodeURIComponent(name);
  let emailURL = encodeURIComponent(email);
  let response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_APP_ID}/${process.env.CUSTOMER_TABLE}?filterByFormula=IF(AND(%22${userNameURL}%22+%3D+trim_name%2C+%22${emailURL}%22+%3D+trim_email)%2CTRUE()%2CFALSE())`,
    requestOptions
  );

  let json = await response.json();
  let records = await json.records;
  let answer = false;

  //if userExist
  if (records.length != 0) {
    return Response.json({
      message: !answer,
      name: records[0].fields["Name"],
      email: records[0].fields["Email"],
      prf_no: records[0].fields["prf_card_no"],
      expire_date: records[0].fields["expire_date (from test_hqid)"],
    });
  } else {
    return Response.json({
      message: answer,
    });
  }
}
