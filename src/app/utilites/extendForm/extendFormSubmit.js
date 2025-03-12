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
  agentID
) {
  event.preventDefault();
  setAmountValidate(false);
  setmonthValidate(false);
  setmanyChatValidate(false);
  // setloading(true)
  const data = new FormData(event.currentTarget);
  const amount = data.get("amount");
  const month = data.get("month");
  const manychat = data.get("manyChat");
  const wallet = JSON.parse(data.get("wallets"));
  const notes = data.get("notes");
  const contactLink = data.get("contactLink");
  let cardId = userInfo["prf_no"];
  console.log(cardId);
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
  // console.log("First URL of Image: " + files[0].href)

  let tmp = {
    amount,
    month,
    manychat,
    wallet,
    notes,
    contactLink,
    supportRegionID,
    files,
    agentID,
    expireDate: expireDate,
    cardID: cardId,
  };


  // validate month and amount
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    console.log("Amount validation failed:", amount);
    setAmountValidate(true);
    setloading(false);
    return;
  }
  if (!/^\d+$/g.test(month)) {
    setmonthValidate(true);
    setloading(false);
    return;
  }
  if (!/^\d+$/g.test(manychat)) {
    setmanyChatValidate(true);
    setloading(false);
    return;
  }

  // //check if file exist
  if (files.length == 0) {
    setfileExist(false);
    setloading(false);
    return;
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
      supportRegionId: supportRegionID,
      walletId: wallet,
      amount: amount,
      agentId: agentID,
      noteId: note["id"],
      transactionDate: new Date(),
      month: month,
      screenShot: files.map((url) => {
        return { url: url.href };
      }),
      cardId: cardId,
      manyChatId: manychat,
    });

    requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let response = await fetch(`/api/extendUser`, requestOptions);
    location.reload();
  } // treat this as new customer but get the requried user information from airtable
  else {
    // // get customer information from airtable using name and email
    // raw = JSON.stringify({
    //   "name": userInfo.name,
    //   "email": userInfo.email
    // })
    // requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow'
    // };

    // let response = await fetch('/api/checkuser' , requestOptions)
    // response = response.json()

    // submitpaymentinformation

    let raw = JSON.stringify({
      customerName: userInfo.name,
      customerEmail: userInfo.email,
      agentId: agentID,
      supportRegionId: supportRegionID,
      manyChatId: manychat,
      contactLink: contactLink,
      amount: amount,
      month: month,
      note: notes,
      walletId: wallet,
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
    let answ = await fetch("/api/submitPaymentolduser/", requestOptions);
    let { status } = await answ.json();
    //console.log(status);
    location.reload();
  }
}
