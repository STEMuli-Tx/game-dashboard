import axios from 'axios';
import { toast } from 'react-toastify';

const titleId = import.meta.env.VITE_PLAYFAB_TITLE_ID;
const secretKey = import.meta.env.VITE_PLAYFAB_SECRET_KEY;

export function loginWithCustomID(customId) {
  try {
    const data = JSON.stringify({
      CustomId: customId,
      CreateAccount: true,
      TitleId: titleId,
    });

    return axios.post(`https://${titleId}.playfabapi.com/client/LoginWithCustomID`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.log('Error in loginWithCustomID', e);
    throw e;
  }
}

export function deletePlayer() {
  try {
    toast.info(`Deleting Title Player`, {
      theme: 'colored',
    });

    const data = JSON.stringify({
      PlayFabId: localStorage.getItem('playfabId'),
    });

    const response = axios.post(`https://${titleId}.playfabapi.com/server/DeletePlayer`, data, {
      headers: { 'Content-Type': 'application/json', 'X-SecretKey': secretKey },
    });
    toast.success(`Successfully Deleted`, {
      theme: 'colored',
    });
    return response;
  } catch (e) {
    toast.error(`Error deleting title player from playfab`, {
      theme: 'colored',
    });
    throw e;
  }
}
