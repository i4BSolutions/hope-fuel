// Desc: This file contains the function that is used to submit the form data to the database

export default async function createFormSubmit(
  formData,
  files,
  userInfo,
  setloading,
  agentId,
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

  setloading(true);

  const payload = {
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    agentId,
    supportRegionId: supportRegion,
    countryId: donorCountry,
    manyChatId,
    contactLink,
    amount,
    month,
    note,
    walletId,
    screenShot: files.map((file) => ({ key: file.key })),
  };

  try {
    const response = await fetch("/api/submitPayment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setloading(false);
      return {
        success: false,
        status: response.status,
        errorMsg: result?.error || "Unknown error",
      };
    }

    setloading(false);
    onSuccess?.();
    return { success: true, status: response.status };
  } catch (error) {
    console.error("Error submitting payment", error);
    setloading(false);
    return { success: false, status: 500 };
  }
}
