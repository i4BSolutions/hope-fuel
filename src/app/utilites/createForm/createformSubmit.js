export default async function createFormSubmit(FormData){
    console.log("Validated Data:", FormData);
    
  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(FormData),
    redirect: "follow",
  };
  try{
    console.log("trying into submitPaymentAPI ......");
let answ = await fetch("/api/submitPayment/", requestOptions);

  let res = await answ.json();
  console.log("I submitted createForm : " + res);
  }catch (error) {
    console.error("Error fetching support regions:", error);
  }
  

}