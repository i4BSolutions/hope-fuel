export async function GET(request) {
  console.log(process.env.AIRTABLE_TOKEN);

  //get the wallet data base

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.AIRTABLE_TOKEN}`);
  // myHeaders.append("Cookie", "brw=brwb8tzTqMzSEOnxJ; AWSALB=9ZYiIiD0R1y3BfmkYAiHW3+nOoVCGqeDgFqmGShD1QeRLL3+wePNKkQdW0i2lKZDW+nBA28yxhXkzgZc2tIx+KJkdMEko/25dX+PH982RFbwXOaJCWaPd6d0l4bF; AWSALBCORS=9ZYiIiD0R1y3BfmkYAiHW3+nOoVCGqeDgFqmGShD1QeRLL3+wePNKkQdW0i2lKZDW+nBA28yxhXkzgZc2tIx+KJkdMEko/25dX+PH982RFbwXOaJCWaPd6d0l4bF");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_APP_ID}/${process.env.WALLET_TABLE}`,
    requestOptions
  );
  const json = await response.json();
  let records = json.records;
  let answer = {};
  for (let record = 0; record < records.length; record++) {
    let currency = records[record].fields["Currency"];
    let wallet = records[record].fields["wallet_name"];
    let id = records[record].id;

    //if this key is not, create one
    !Array.isArray(answer[currency]) && (answer[currency] = new Array());

    // push concering wallet to currency
    answer[currency].push({
      id: id,
      name: wallet,
    });
  }

  return Response.json(answer);
}
