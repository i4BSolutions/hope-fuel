import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASEHOST,
  user: process.env.DATABASEUSER,
  password: process.env.DATABASEPASSWORD,
  database: process.env.DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust this number based on your server capacity
  queueLimit: 0,
});

export default async function db(query, params) {
  try {
    const [rows] = await pool.query(query, params);
    //  console.log("Rows form db:", rows);
    return rows;
  } catch (error) {
    console.error("Error connecting to db", error);
    throw new Error("Failed to connect to db");
  } finally {
    pool.end;
  }
}
