// playfab.mjs
import PlayFab from 'playfab-sdk/Scripts/PlayFab/PlayFab';
import PlayFabClient from 'playfab-sdk/Scripts/PlayFab/PlayFabClient';
import PlayFabData from 'playfab-sdk/Scripts/PlayFab/PlayFabData';

PlayFab.settings.developerSecretKey = import.meta.env.VITE_PLAYFAB_SECRET_KEY;

export async function customLogin() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }

  const loginRequest = {
    CustomId: userId,
    CreateAccount: true,
  };

  return new Promise((resolve, reject) => {
    PlayFabClient.LoginWithCustomID(loginRequest, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export async function getObjects(entityId, entityType) {
  const request = {
    Entity: {
      Id: entityId,
      Type: entityType,
    },
  };

  return new Promise((resolve, reject) => {
    PlayFabData.GetObjects(request, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export async function setObjects(entityId, entityType, objects) {
  const request = {
    Entity: {
      Id: entityId,
      Type: entityType,
    },
    Objects: objects,
  };

  return new Promise((resolve, reject) => {
    PlayFabData.SetObjects(request, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}