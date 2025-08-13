import { NextResponse } from "next/server";
import db from "../../../../utilites/db";

async function CreatelogEditHistory(
  agentId,
  customerId,
  field,
  oldValue,
  newValue
) {
  const query = `
    INSERT INTO CustomerAuditLogs (AgentId, CustomerId, FieldChanged, OldValue, NewValue, ChangeDate) 
             VALUES (?, ?, ?, ?, ?, NOW())
    `;
  const values = [agentId, customerId, field, oldValue, newValue];
  try {
    await db(query, values);
  } catch (error) {
    console.error("[DB] Error logging edit history:", error);
    throw new Error("Failed to log edit history");
  }
}
async function fetchCustomerValues(customerId) {
  const query = `
    SELECT * FROM Customer where CustomerId = ?
    `;
  const values = [customerId];
  try {
    const customer = await db(query, values);
    return customer[0];
  } catch (error) {
    console.error("[DB] Error fetching customer:", error);
    throw new Error("Failed to fetch customer");
  }
}

async function UpdateCustomerField(customerId, field, newValue) {
  const query = `UPDATE Customer SET ${field} = ? WHERE CustomerId = ?`;
  const values = [newValue, customerId];
  try {
    await db(query, values);
  } catch (error) {
    console.error("[DB] Error updating customer field:", error);
    throw new Error("Failed to update customer field");
  }
}

async function checkDuplicateCustomer(field, value, excludeCustomerId) {
  const query = `
    SELECT CustomerId FROM Customer 
    WHERE ${field} = ? AND CustomerId <> ?
  `;
  const values = [value, excludeCustomerId];
  try {
    const rows = await db(query, values);
    return rows.length > 0;
  } catch (error) {
    console.error(`[DB] Error checking duplicate ${field}:`, error);
    throw new Error(`Failed to check duplicate ${field}`);
  }
}

export async function POST(req, { params }) {
  const { id } = params;
  const { agentId, updates } = await req.json();

  if (!id || !agentId || !updates) {
    return NextResponse.json(
      { message: "Missing required fields in request" },
      { status: 400 }
    );
  }

  try {
    const currentCustomer = await fetchCustomerValues(id);
    if (!currentCustomer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }
    let changesMade = false;
    let updateQueries = [];
    let auditLogs = [];

    for (const { field, newValue } of updates) {
      const allowedFields = ["Name", "Email", "UserCountry"]; //allowed fields to be updated
      if (!allowedFields.includes(field)) {
        return NextResponse.json(
          { message: `Field not allowed to be updated for ${field}` },
          { status: 400 }
        );
      }

      const oldValue = currentCustomer[field];

      if (
        (field === "Email" || field === "Name") &&
        newValue &&
        newValue !== oldValue
      ) {
        const isDuplicate = await checkDuplicateCustomer(field, newValue, id);
        if (isDuplicate) {
          return NextResponse.json(
            { message: `${field} is already associated with another customer` },
            { status: 409 }
          );
        }
      }

      if (oldValue !== newValue) {
        updateQueries.push({ field, newValue });
        auditLogs.push({ field, oldValue, newValue });
        changesMade = true;
      }
    }

    // Apply batch updates
    for (const { field, newValue } of updateQueries) {
      await UpdateCustomerField(id, field, newValue);
    }

    // Log all changes at once
    for (const { field, oldValue, newValue } of auditLogs) {
      await CreatelogEditHistory(agentId, id, field, oldValue, newValue);
    }

    if (changesMade) {
      return NextResponse.json(
        { message: "Customer updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "No changes made" }, { status: 200 });
    }
  } catch (error) {
    console.error("[API] Error updating customer:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
