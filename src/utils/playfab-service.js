import axios from 'axios';
import { toast } from 'react-toastify';

const titleId = import.meta.env.VITE_PLAYFAB_TITLE_ID;
const secretKey = import.meta.env.VITE_PLAYFAB_SECRET_KEY;

const getUrls = () => ({
  AUTH: `https://${titleId}.playfabapi.com/authentication/GetEntityToken`,
  CREATE_UPLOAD_URLS: `https://${titleId}.playfabapi.com/catalog/CreateUploadUrls`,
  CREATE_DRAFT_ITEM: `https://${titleId}.playfabapi.com/catalog/CreateDraftItem`,
  LOGIN_WITH_CUSTOM_ID: `https://${titleId}.playfabapi.com/client/LoginWithCustomID`,
  DELETE_PLAYER: `https://${titleId}.playfabapi.com/server/DeletePlayer`,
  GET_CATALOG_CONFIG: `https://${titleId}.playfabapi.com/catalog/GetCatalogConfig`,
});

export const getCatalogConfig = async () => {
  const entityToken = await getEntityToken();

  const response = await fetch(getUrls().GET_CATALOG_CONFIG, {
    method: 'POST',
    headers: {
      'X-EntityToken': entityToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || 'Failed to get catalog config');
  }

  const data = await response.json();
  return data.data.Config.Catalog;
};

export function loginWithCustomID(customId) {
  try {
    const data = JSON.stringify({
      CustomId: customId,
      CreateAccount: true,
      TitleId: titleId,
    });

    return axios.post(getUrls().LOGIN_WITH_CUSTOM_ID, data, {
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

    const response = axios.post(getUrls().DELETE_PLAYER, data, {
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

export const getUploadUrls = async (fileNames) => {
  const entityToken = await getEntityToken();

  const response = await fetch(getUrls().CREATE_UPLOAD_URLS, {
    method: 'POST',
    headers: {
      'X-EntityToken': entityToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Files: fileNames.map((fileName) => ({ FileName: fileName })),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || 'Failed to get upload URLs');
  }

  const data = await response.json();
  return data.data.UploadUrls;
};

export const uploadToBlob = async (uploadUrl, file) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload to blob storage');
  }

  return true;
};

export const createDraftItem = async (itemData) => {
  const entityToken = await getEntityToken();

  const response = await fetch(getUrls().CREATE_DRAFT_ITEM, {
    method: 'POST',
    headers: {
      'X-EntityToken': entityToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || 'Failed to create draft item');
  }

  return response.json();
};

export const getEntityToken = async () => {
  const response = await fetch(getUrls().AUTH, {
    method: 'POST',
    headers: {
      'X-SecretKey': secretKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage || 'Failed to get entity token');
  }

  const data = await response.json();
  return data.data.EntityToken;
};
