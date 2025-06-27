export default async function extendFormSubmit(
  formData,
  files,
  userInfo,
  setLoading,
  agentId,
  customerId,
  onSuccess
) {
  const {
    currency,
    amount,
    walletId,
    month,
    supportRegion,
    donorCountry,
    manyChatId,
    contactLink,
    note,
  } = formData;

  setLoading(true);

  const transactionDate = new Date();

  let cardId = userInfo["prf_no"];

  //if cardID exist for the extend user
  if (cardId) {
    console.log("Inside cardId ");
    cardId = String(userInfo["prf_no"]);
    const regexp = /\d+/g;
    cardId = cardId.match(regexp)[0];
    cardId = parseInt(cardId);
  }

  const supportRegionID = supportRegion.SupportRegionID;

  let expireDate = userInfo["expire_date"];
  if (expireDate) {
    expireDate = new Date(userInfo["expire_date"]);
  }

  // check if the user exist in mysql
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    name: userInfo.name,
    email: userInfo.email,
  });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let res = await fetch("/api/InCustomerTable/", requestOptions);
  let ans = await res.json();

  // if the user already in mysql table
  if (Object.hasOwn(ans, "Name")) {
    // create a note
    raw = JSON.stringify({
      note: note,
      agentID: agentId,
    });
    requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let noteResponse = await fetch("/api/insertNote/", requestOptions);
    noteResponse = await noteResponse.json();

    const payload = {
      customerName: userInfo.name,
      customerEmail: userInfo.email,
      agentId,
      customerId,
      supportRegionId: supportRegion,
      countryId: donorCountry,
      manyChatId,
      contactLink,
      amount,
      month,
      noteId: noteResponse.id,
      walletId,
      transactionDate,
      screenShot: files.map((f) => ({
        key: f.key,
      })),
    };

    myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //console.log(ans);
    raw = JSON.stringify(payload);

    requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch("/api/extendUser", requestOptions);
      console.log(response);

      const data = await response.json();

      if (response.status == 400) {
        return {
          success: false,
          status: 400,
          errorMsg: data.error,
        };
      }

      setLoading(false);
      onSuccess?.();
      return {
        success: true,
        status: 200,
      };
    } catch (error) {
      console.error("Error submitting payment", error);

      return {
        success: false,
        status: 500,
      };
    }
  } // treat this as new customer but get the requried user information from airtable
  else {
    // get customer information from airtable using name and email
    // submitpaymentinformation

    let raw = JSON.stringify({
      customerName: userInfo.name,
      customerEmail: userInfo.email,
      agentId: agentId,
      supportRegionId: supportRegionID,
      manyChatId: manyChatId,
      contactLink: contactLink,
      amount: amount,
      month: month,
      noteId: noteResponse.id,
      walletId: walletId,
      screenShot: files.map((file) => ({ key: file.key })),
      expireDate: expireDate,
      cardId: cardId,
    });
    //console.log(JSON.parse(raw));
    requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "/api/submitPaymentolduser/",
        requestOptions
      );
      const data = await response.json();

      if (data.status == 400) {
        return {
          success: false,
          status: 400,
          errorMsg: data.error,
        };
      }

      setLoading(false);

      onSuccess?.();
    } catch (error) {
      console.error("Error submitting payment", error);

      return {
        success: false,
        status: 500,
      };
    }
  }
}
