export const dynamic = "force-dynamic"; // defaults to force-static

export async function POST(request) {
  const text = await request.text();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.AIRTABLE_TOKEN}`);
  myHeaders.append("Cookie", "brw=brwb8tzTqMzSEOnxJ");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: text,
    redirect: "follow",
  };

  let response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_APP_ID}/${process.env.HQID_TABLE}`,
    requestOptions
  );
  let json = await response.json();
  return Response.json(response);
}
