// Desc: This file contains the function that is used to submit the form data to the database

export default async function createFormSubmit(
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
  donorCountry,
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
    countryId: donorCountry,
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
  
  try {
    const response = await fetch("/api/submitPayment/", requestOptions);

    const data = await response.json();

    if (response.status == 400) {
      return {
        success: false,
        status: 400,
        errorMsg: data.error
      }
    }

    setloading(false);

    return {
      success: true,
      status: 200
    }
  } catch (error) {
    console.error("Error submitting payment", error);

    return {
      success: false,
      status: 500
    }
  }
}