import React, { useEffect, useState } from 'react';
import { Auth } from "aws-amplify";

// function myHeaders() {
//     const[jwtToken,setToken]=useState("");

//     const fetchData = async () => {
//       try {
//         const userSession = await Auth.currentSession();
//         const token = userSession.getAccessToken().getJwtToken();
//         setToken(token);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();

//   const headers = {Authorization: `Bearer ${jwtToken}`};
//   return {headers};
// };
// const headers = myHeaders();


function myHeaders() {
    const jwtToken = sessionStorage.getItem("userInformation");
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return {headers};
}
const headers = myHeaders();

export { headers };
