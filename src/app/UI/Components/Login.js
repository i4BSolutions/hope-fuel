// // components/Login.tsxResponsiveAppBar
// "use client";

// import { withAuthenticator } from "@aws-amplify/ui-react";
// import { AuthUser } from "aws-amplify/auth";
// import { redirect } from "next/navigation";
// import { use, useEffect } from "react";
// import ResponsiveAppBar from "../AppBar/AppBar";
// import { useUser } from "../../context/UserContext";

// function Login({ user }) {
//   const { setUser } = useUser();
//   useEffect(() => {
//     console.log("User from Login components: ", user);
//     if (user) {
//       setUser(user) ;
//       redirect("/createForm") ;

//     }
//   }, [user]);
//   return null;
// }

// export default withAuthenticator(Login);
