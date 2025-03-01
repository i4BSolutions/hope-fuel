import { NextResponse } from "next/server";
import db from "../../../../utilites/db"; 

async function CreatelogEditHistory(agentId, customerId, field, oldValue, newValue) {
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
export async function fetchCustomerValues(customerId) {
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

export async function UpdateCustomerField(customerId, field, newValue) {
    const query = `
    UPDATE Customer SET ${field} = ? WHERE CustomerId = ?
    `;
    const values = [newValue, customerId];
  try {
    await db(query, values);
  } catch (error) {
    console.error("[DB] Error updating customer field:", error);
    throw new Error("Failed to update customer field");
  }
}

export async function POST(req, { params }) {
    const { id } = params;
    const { agentId, updates } = await req.json();

    if ( !id || !agentId || !updates) {
      return NextResponse.json(
        { message: "Missing required fields in request" },
        { status: 400 }
      );
    }

    try{
        const currentCustomer = await fetchCustomerValues(id);
        if (!currentCustomer) {
          return NextResponse.json(
            { message: "Customer not found" },
            { status: 404 }
          );
        }
        let changesMade = false;

         for (const { field, newValue } of updates) {
          const oldValue = currentCustomer[field];

        
          if (oldValue !== newValue) {
            await UpdateCustomerField(id, field, newValue);
            await CreatelogEditHistory(agentId, id, field, oldValue, newValue);
            changesMade = true;
          }
          else {
            changesMade = false;
          }
        
        }
        if (changesMade) {
          return NextResponse.json(
            { message: "Customer updated successfully" },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { message: "No changes made" },
            { status: 200 }
          );
        }


    }catch(error){
         console.error("[API] Error updating customer:", error);
         return NextResponse.json(
           { message: "Internal Server Error" },
           { status: 500 }
         );
    }


}