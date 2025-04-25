export default async function extendFormSubmit(
  event,
  currency,
  supportRegion,
  files,
  userInfo,
  setloading,
  formFillingPerson,
  setAmountValidate,
  setmonthValidate,
  setmanyChatValidate,
  fileExist,
  setfileExist,
  agentID,
  contactLink,
  notes,
  manyChatId,
  walletId,
  amount,
  month
) {
  event.preventDefault();

  setAmountValidate(false);
  setmonthValidate(false);
  setmanyChatValidate(false);

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
      note: notes,
      agentID: agentID,
    });
    requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let note = await fetch("/api/insertNote/", requestOptions);
    note = await note.json();

    myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //console.log(ans);
    raw = JSON.stringify({
      customerId: ans["CustomerId"],
      supportRegionId: supportRegion,
      walletId: walletId,
      amount: amount,
      agentId: agentID,
      noteId: note["id"],
      transactionDate: new Date(),
      month: month,
      screenShot: files.map((url) => {
        return { url: url.href };
      }),
      cardId: cardId,
      manyChatId: manyChatId,
    });

    requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(`/api/extendUser`, requestOptions);
      console.log(response);

      const data = await response.json();

      if (response.status == 400) {
        return {
          success: false,
          status: 400,
          errorMsg: data.error,
        };
      }

      setloading(false);

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
      agentId: agentID,
      supportRegionId: supportRegionID,
      manyChatId: manyChatId,
      contactLink: contactLink,
      amount: amount,
      month: month,
      note: notes,
      walletId: walletId,
      screenShot: files.map((url) => {
        return { url: url.href };
      }),
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
      console.log(response);

      const data = await response.json();

      if (response.status == 400) {
        return {
          success: false,
          status: 400,
          errorMsg: data.error,
        };
      }

      setloading(false);

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
  }
}
