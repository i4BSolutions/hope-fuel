export const dynamic = "force-dynamic";

export async function POST(request) {
  let json = await request.json();

  const { name, email } = json;

  try {
    // Query to find the user with the given username and email
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${process.env.AIRTABLE_TOKEN}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let userNameURL = encodeURIComponent(name);
    let emailURL = encodeURIComponent(email);
    let response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_APP_ID}/${process.env.HQID_TABLE}?fields%5B%5D=manychat_id&filterByFormula=IF(AND(manychat_id+!%3D+BLANK()%2C+manychat_id+!%3D+0%2C+trim_name%3D'${userNameURL}'%2C+Email%3D'${emailURL}')%2C+TRUE()%2C+FALSE()+)`,
      requestOptions
    );
    json = await response.json();
    let records = json["records"];
    if (records.length > 0) {
      let manychatid = json["records"][0]["fields"]["manychat_id"];
      return Response.json({ answer: true, manychatid });
    }
    return Response.json({ answer: false });
  } catch (error) {
    console.error("Error checking user:", error);
    return Response.json({ answer: false }); // Return false in case of an error
  }
}
