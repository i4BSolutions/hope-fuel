export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!name || !email) {
      return Response.json(
        { error: "Both 'name' and 'email' are required." },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const appId = process.env.AIRTABLE_APP_ID;
    const table = process.env.CUSTOMER_TABLE;
    if (!token || !appId || !table) {
      return Response.json(
        { error: "Server configuration error: missing Airtable env vars." },
        { status: 500 }
      );
    }

    const headers = new Headers({ Authorization: `Bearer ${token}` });

    const escapeForFormula = (s) => String(s).replace(/"/g, '\\"');

    const filterFormula = `IF(AND("${escapeForFormula(
      name
    )}" = trim_name, "${escapeForFormula(
      email
    )}" = trim_email), TRUE(), FALSE())`;

    const url = new URL(
      `https://api.airtable.com/v0/${appId}/${encodeURIComponent(table)}`
    );
    url.searchParams.set("filterByFormula", filterFormula);

    const airtableRes = await fetch(url.toString(), {
      method: "GET",
      headers,
      redirect: "follow",
    });

    if (!airtableRes.ok) {
      const details = await airtableRes.text().catch(() => "");
      return Response.json(
        { error: "Airtable request failed.", details },
        { status: airtableRes.status }
      );
    }

    const data = await airtableRes.json().catch(() => ({}));
    const records = Array.isArray(data?.records) ? data.records : [];

    if (
      records.length > 0 &&
      records[0]?.fields &&
      typeof records[0].fields === "object"
    ) {
      const fields = records[0].fields;

      return Response.json({
        message: true,
        name: typeof fields["Name"] === "string" ? fields["Name"] : null,
        email: typeof fields["Email"] === "string" ? fields["Email"] : null,
        prf_no: fields["prf_card_no"] ?? null,
        expire_date: fields["expire_date (from test_hqid)"] ?? null,
      });
    }

    return Response.json({ message: false });
  } catch (err) {
    return Response.json(
      {
        error: "Unexpected server error.",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
