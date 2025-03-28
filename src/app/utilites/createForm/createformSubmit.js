// Desc: This file contains the function that is used to submit the form data to the database

export default function createFormSubmit(
  event,
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
  agentId,
  contactLink,
  note,
  manyChatId,
  walletId,
  amount,
  month
) {
  event.preventDefault();
  
  // Reset validation states
  setAmountValidate(false);
  setmonthValidate(false);
  setmanyChatValidate(false);
  setloading(true);

  // Validation checks with consistent return
  if (!/^\d+(\.\d{1,2})?$/g.test(amount) || amount === "") {
    setAmountValidate(true);
    setloading(false);
    return {
      success: false,
      error: 'Invalid amount',
      status: 400
    };
  }

  if (!/^\d+$/g.test(month)) {
    setmonthValidate(true);
    setloading(false);
    return {
      success: false,
      error: 'Invalid month',
      status: 400
    };
  }

  if (!/^\d+$/g.test(manyChatId)) {
    setmanyChatValidate(true);
    setloading(false);
    return {
      success: false,
      error: 'Invalid ManyChat ID',
      status: 400
    };
  }

  if (files.length === 0) {
    setfileExist(false);
    setloading(false);
    return {
      success: false,
      error: 'No files uploaded',
      status: 400
    };
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    agentId: agentId,
    supportRegionId: supportRegion,
    manyChatId: manyChatId,
    contactLink: contactLink,
    amount: amount,
    month: month,
    note: note,
    walletId: walletId,
    screenShot: files.map((url) => ({ url: url.href })),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  
  // TODO: handle errors later
  fetch("/api/submitPayment/", requestOptions);
  
  setloading(false);

  return {
    success: true,
    status: 200,
  };
}