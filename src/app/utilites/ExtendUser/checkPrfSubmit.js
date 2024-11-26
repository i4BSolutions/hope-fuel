// accept prfno
// return if user don't exist => side effect
// if user exist => side effect + userInfo

import { userInfo } from "os";

export default async function checkPrfSubmit(
  prfno,
  setuserExist,
  setisChecking,
  setUserInfo,
  setHasPermissonThisMonth,
  userRole
) {
  console.log(prfno);
  setisChecking(true);
  // Get the prfNo id (Or customer id)
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    prfno: prfno,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const result = await fetch("/api/getUserId", requestOptions);
  let json = await result.json();
  let answer = json.message;

  raw = JSON.stringify({
    cardId: parseInt(prfno),
  });

  requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let res = await fetch("api/getCustomerFromCardID", requestOptions);
  res = await res.json();
  console.log("res from checkprf", res);

  //if the data is not there
  if (!answer && !Object.hasOwn(res, "Name")) {
    //handle the case
    setuserExist(false);
    setisChecking(false);

    return;
  } else if (Object.hasOwn(res, "Name")) {
    // if mysql has the user
    // check to see if the user has permission
    var raw = JSON.stringify({
      name: res["Name"],
      email: res["Email"],
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let response1 = await fetch("api/checkolduserpermission", requestOptions);
    let res1 = await response1.json();

    // if user don't have permission
    if (!res1) {
      setisChecking(false);
      setHasPermissonThisMonth(res1);
      setuserExist(true);
      console.log("user role from checjprf: ", userRole[0]);
      if (userRole[0] == "admin") {
        setUserInfo({
          name: res["Name"],
          email: res["Email"],
          prf_no: res["CardID"],
          expire_date: res["ExpireDate"],
        });
      }

      return;
    }

    // if user has permission
    setHasPermissonThisMonth(true);
    console.log(res);
    setUserInfo({
      name: res["Name"],
      email: res["Email"],
      prf_no: res["CardID"],
      expire_date: res["ExpireDate"],
    });
    console.log("user info, res", res["Name"]);
    setuserExist(true);
    setisChecking(false);
  } else {
    //check if the user has permission
    var raw = JSON.stringify({
      name: json.name.trim(),
      email: json.email.trim(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let response1 = await fetch("api/checkPermission", requestOptions);
    let bool = await response1.json();
    console.log("bool from checkpermission: ", bool);
    if (!bool) {
      setisChecking(false);
      setHasPermissonThisMonth(bool);
      setuserExist(true);
      if (userRole[0] == "admin") {
        setUserInfo({
          name: json.name,
          email: json.email,
          prf_no: json.prf_no,
          expire_date: json.expire_date,
        });
      }
      console.log("result = ", bool);
      return;
    }
    setHasPermissonThisMonth(true);

    setUserInfo({
      name: json.name,
      email: json.email,
      prf_no: json.prf_no,
      expire_date: json.expire_date,
    });

    setuserExist(true);
    setisChecking(false);
    // set the user data
  }

  //if prfno don't exist, set the userDon't exsit
}
