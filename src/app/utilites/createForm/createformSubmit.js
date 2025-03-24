// Desc: This file contains the function that is used to submit the form data to the database

export default async function createFormSubmit(event, currency, supportRegion ,files, userInfo, setloading, formFillingPerson, setAmountValidate, setmonthValidate, setmanyChatValidate,fileExist, setfileExist,agentId) {
  event.preventDefault();
  setAmountValidate(false);
  setmonthValidate(false);
  setmanyChatValidate(false);
  console.log("from the createFormSubmit", fileExist);
  // setloading(true)

  const data = new FormData(event.currentTarget);
  const amount = data.get("amount");
  const month = data.get("month");
  const manychat = data.get("manyChat");
  const wallet = JSON.parse(data.get("wallets"));
  const notes = data.get("notes");
  const contactLink = data.get("contactLink");
  //validate month and amount
  if (!/^\d+(\.\d{1,2})?$/g.test(amount) || amount == "") {
    
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

  //check if file exist
  if (files.length == 0) {
    setfileExist(false);
    setloading(false);
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log("agentID is " + agentId);
  console.log("UserInfo", userInfo);


  let raw = JSON.stringify({
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    agentId: agentId,
    supportRegionId: supportRegion["SupportRegionID"],
    manyChatId: manychat,
    contactLink: contactLink,
    amount: amount,
    month: month,
    note: notes,
    walletId: wallet,
    screenShot: files.map((url) => {
      return { url: url.href };
    }),
  });

  console.log("RawData is ");
  console.log(raw)

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  
  let answ = await fetch("/api/submitPayment/", requestOptions);

  if (!answ.ok) {
    // console.error(`Error: ${answ.status} - ${answ.statusText}`);
    if (answ.status === 400) {
      // console.error("Bad Request: Please check the submitted data.");
      return {
        error: true,
        status: answ.status,
        message: answ.status === 400 ? "Bad Request: Please check the submitted data." : answ.statusText,
      };
    }
    setloading(false);
    return;
  }
  
  let res = await answ.json();
  console.log("My answer id: " + res);
  location.reload();

  return {
    success: true,
    status: answ.status,
  };
}
// var raw = JSON.stringify({
//   "records": [
//     {
//       "fields": {
//         "Name": userInfo.name,
//         "Email": userInfo.email,
//         "Status":  '၁ - ဖောင်တင်သွင်း',
//         "Currency":  currency,
//         "Amount": parseInt(amount),
//         "Month": parseInt(month),
//         "support_region": supportRegion,
//         "notes": notes,
//         "contact_person_link": contactLink,
//         "wallet": [wallet.id],
//         "screenshot": files.map((url) => {return {url: url.href}}),
//         "notion_form_filled_person": formFillingPerson,
//         "manychat_id": parseInt(manychat)
        
//       }
//     }
//   ]
// });

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

//  let response = await fetch(`/api/createNewUser`, requestOptions)

//  let json = await response.json();
//  location.reload();


