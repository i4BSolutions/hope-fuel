// Checks if a user exists in Airtable or MySQL and returns user info if found, otherwise null
export default async function checkUserSubmit(name, email) {
  // Helper to build request options
  const buildRequestOptions = (body) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  try {
    // 1. Check if user exists in Airtable
    const airtableResponse = await fetch(
      "/api/checkUser",
      buildRequestOptions({ name, email })
    );
    const airtableResult = await airtableResponse.json();

    if (airtableResult.message === true) {
      return {
        name,
        email,
        prf_no: airtableResult.prf_no,
        expire_date: Array.isArray(airtableResult.expire_date)
          ? airtableResult.expire_date[0]
          : airtableResult.expire_date,
      };
    }

    // 2. Check if user exists in MySQL
    const mysqlResponse = await fetch(
      "/api/InCustomerTable",
      buildRequestOptions({ name, email })
    );
    const mysqlResult = await mysqlResponse.json();

    if (mysqlResult.Name) {
      return {
        name,
        email,
        prf_no: mysqlResult.CardID,
        expire_date: mysqlResult.ExpireDate,
      };
    }

    // 3. User not found in either system
    return null;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
}
