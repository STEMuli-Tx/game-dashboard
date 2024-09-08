import axios from 'axios';

const titleId = import.meta.env.VITE_PLAYFAB_TITLE_ID;
export function loginWithCustomID(customId) {
  try {
    const data = JSON.stringify({
      CustomId: customId,
      CreateAccount: false,
    });

    return axios.post(`https://${titleId}.playfabapi.com/client/LoginWithCustomID`, data);
  } catch (e) {
    console.log('Error in loginWithCustomID', e);
    throw e;
  }
}

//   static async setTitlePlayerAccountFields(sessionTicket, data) {
//     return new Promise((resolve, reject) => {
//       PlayFab.settings.sessionTicket = sessionTicket;
//       PlayFab.ClientApi.UpdateUserData(
//         {
//           Data: data,
//         },
//         (error, result) => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(result.data);
//           }
//         }
//       );
//     });
//   }
// }
