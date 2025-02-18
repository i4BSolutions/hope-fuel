

export default async function createFormSubmit(FormData) {
  console.log("Form Data to submit", FormData);

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(FormData),
    redirect: "follow",
  };
  try {
    let response = await fetch("/api/submitPayment/", requestOptions);
    let res = await response.json();
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch data (${response.status})`
      );
    }
 
    return res;

  } catch (error) {
    console.error("Error fetching support regions:", error);
  }
}
