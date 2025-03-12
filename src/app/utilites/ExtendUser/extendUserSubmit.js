import { useAgent } from "../../context/AgentContext";

export default async function extendUserSubmit(
  event,
  userInfo,
  currency,
  supportRegion,
  files,
  setLoading,
  formFillingPerson,
  setAmountValidate,
  setMonthValidate,
  setManyChatValidate,
  fileExist,
  setFileExist,
  wallets,
  agentId,
) {
  event.preventDefault();

  // Extract form data
  const data = new FormData(event.currentTarget);


  
  const amount = data.get("amount");
  const month = data.get("month");
  const manyChat = data.get("manyChat");
  const wallet = JSON.parse(data.get("wallets") || "{}");
  const notes = data.get("notes");
  const contactLink = data.get("contactLink");
  let cardId = String(userInfo["prf_no"]);

  // Process cardId if it exists
  if (cardId) {
    const regexp = /\d+/g;
    cardId = cardId.match(regexp)?.[0];
    cardId = parseInt(cardId, 10);
  }

  const supportRegionID = supportRegion?.SupportRegionID || null;
  let expireDate = userInfo["expire_date"]
    ? new Date(userInfo["expire_date"])
    : null;

  const tmp = {
    amount,
    month,
    manyChat,
    agentId,
    wallet,
    notes,
    contactLink,
    supportRegionID,
    files,
    expireDate,
    cardID: cardId,
  };
  console.log("tmp from extendUserSubmit:", tmp);

  // Validate amount
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    setAmountValidate(true);
    setLoading(false);
    return;
  } else {
    setAmountValidate(false);
  }

  // Validate month
  if (!/^\d+$/.test(month)) {
    setMonthValidate(true);
    setLoading(false);
    return;
  } else {
    setMonthValidate(false);
  }

  // Validate manyChat
  if (!/^\d+$/.test(manyChat)) {
    setManyChatValidate(true);
    setLoading(false);
    return;
  } else {
    setManyChatValidate(false);
  }

  // Check if files exist
  if (!files || files.length === 0) {
    setFileExist(false);
    setLoading(false);
    return;
  }

  try {
    // Check if the user exists in MySQL
    const customerCheckPayload = JSON.stringify({
      name: userInfo.name,
      email: userInfo.email,
    });

    let response = await fetch("/api/InCustomerTable/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: customerCheckPayload,
    });
    const customerCheckResult = await response.json();

    // User exists
    if (customerCheckResult?.Name) {
      console.log("Existing customer found:", customerCheckResult);

      // Insert note
      const notePayload = JSON.stringify({
        note: notes,
        agentID: agentId,
      });

      response = await fetch("/api/insertNote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: notePayload,
      });
      const noteResult = await response.json();

      // Create transaction for existing user
      const transactionPayload = JSON.stringify({
        customerId: customerCheckResult["CustomerId"],
        supportRegionId: supportRegionID,
        walletId: wallet,
        amount: amount,
        agentId: agentId,
        noteId: noteResult.id,
        transactionDate: new Date(),
        month: month,
        screenShot: files.map((file) => ({ url: file.href })),
        cardId: cardId,
        manyChatId: manyChat,
      });

      console.log("TransactionPayload is ");

      console.log(JSON.stringify(transactionPayload));

      response = await fetch(`/api/extendUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: transactionPayload,
      });

      console.log("Transaction response:", response);
    } else {
      // New customer flow
      console.log("New customer detected. Proceeding with registration...");

      const newCustomerPayload = JSON.stringify({
        customerName: userInfo.name,
        customerEmail: userInfo.email,
        agentId: agentId,
        supportRegionId: supportRegionID,
        manyChatId: manyChat,
        contactLink: contactLink,
        amount: amount,
        month: month,
        note: notes,
        walletId: wallet,
        screenShot: files.map((file) => ({ url: file.href })),
        expireDate: expireDate,
        cardId: cardId,
      });

      response = await fetch("/api/submitPaymentolduser/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newCustomerPayload,
      });

      const paymentResponse = await response.json();
      console.log("New customer transaction status:", paymentResponse.status);
    }
    location.reload();
  } catch (error) {
    console.error("Error in extendUserSubmit:", error);
    setLoading(false);
  }
}
