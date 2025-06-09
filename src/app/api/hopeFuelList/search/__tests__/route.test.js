/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "../route";

import db from "../../../../utilites/db";
jest.mock("../../../../utilites/db");

describe("HopeFuelListSearchRoute", () => {

  it("should return 200 when search text is found within current month", async () => {
    // Arrange
    const mockUrl = "http://localhost:3000/api/hopeFuelList/search?q=ကက";
    const mockRequest = new NextRequest(mockUrl);

    const mockDBResponse = [{
         HopeFuelID: 1,
         Name: "ကက",
         Email: "john@example.com",
         CardID: 101,
         TransactionDate: "2025-02-01T02:55:00.000Z",
         Amount: 100,
         CurrencyCode: "USD",
         Month: 1,
         ScreenShot: 'https://example.com/screenshot1',
         ManyChatId: "MANY123",
         FormFilledPerson: "AWS123",
         TransactionStatus: null,
         Note: "Customer requested refund",
       }];

     db.mockResolvedValue(
      mockDBResponse
     );
    // Act
    const result = await GET(mockRequest);
    const responseBody = await result.json();
    console.log("responseBody", responseBody);

    // Assert
    expect(result.status).toBe(200);
    expect(responseBody).toEqual({
      status: 200,
      message: "Successfully searched in Hope Fuel List",
      data: mockDBResponse.map((row) => ({
        ...row,
        ScreenShot: row.ScreenShot ? row.ScreenShot.split(", ") : [],
      })),
    });
});

  it("should return 404 when search text isn't found within current month", async () => {
    // Arrange
    const mockUrl = "http://localhost:3000/api/hopeFuelList/search?q=mkmkmkmkmkm";
    const mockRequest = new NextRequest(mockUrl);
    db.mockResolvedValue([]);

    // Act
    const result = await GET(mockRequest);
    const responseBody = await result.json();

    // Assert
    expect(result.status).toBe(404);
    expect(responseBody).toEqual({
      error: "No matching records found",
    }); 
  });

    it("should return 400 when there is no search text ", async () => {
      // Arrange
      const mockUrl =
        "http://localhost:3000/api/hopeFuelList/search?q=";
      const mockRequest = new NextRequest(mockUrl);

      // Act
      const result = await GET(mockRequest);
        const responseBody = await result.json();

      // Assert
      expect(result.status).toBe(400);
      expect(responseBody.error).toBe("Search text is required");
    });
});
