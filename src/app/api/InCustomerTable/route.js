export const dynamic = "force-dynamic";
import db from "../../utilites/db";

export async function POST(request) {
  let json = await request.json();

  const { name, email } = json;

  try {
    // Query to find the user with the given username and email
    const rows = await db(
      `
        SELECT
            c.*,
            bc.BaseCountryID AS UserCountry,
            bc.BaseCountryName AS UserCountryName
        FROM
            Customer c
        LEFT JOIN
            BaseCountry bc ON c.UserCountry = bc.BaseCountryID
        WHERE
            Name = ? AND Email = ?
    `,
      [name, email]
    );

    // Check if a user was found
    if (rows.length > 0) {
      // Return the user row
      return Response.json(rows[0]);
    } else {
      return Response.json("false"); // No user found
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return Response.json(false); // Return false in case of an error
  }
}
