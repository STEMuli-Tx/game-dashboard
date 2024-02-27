import axios from 'axios';

import { toast } from 'react-toastify';
export default class GameService {
  #accessToken;
  constructor(accessToken) {
    this.#accessToken = accessToken;

    this.api = axios.create({
      baseURL: import.meta.env.VITE_GAME_SERVICE_BASE_URL, // Ensure this environment variable is correctly set
    });

    this.setHeaders();
  }
  async setHeaders() {
    this.api.defaults.headers['x-api-key'] = `${this.#accessToken}`;
  }

  async getQuests() {
    const response = await this.api.get('/user-quest');

    return response.data;
  }

  async resetQuests(questIds) {
    toast.info(`Resetting quests...`, {
      theme: 'colored',
    });
    const response = await this.api.post('/user-quest/reset', { questIds: questIds });

    toast.success(`Reset ${response.data.data.modifiedCount} quests`, {
      theme: 'colored',
    });

    return response.data;
  }

  async markQuestsComplete(questIds) {
    toast.info(`Marking Quests complete...`, {
      theme: 'colored',
    });
    const response = await this.api.post('/user-quest/complete-all', { questIds: questIds });

    toast.success(`${response.data.data.modifiedCount} marked completed!`, {
      theme: 'colored',
    });

    return response.data;
  }

  async resetInventory() {
    toast.info(`Cleaning Inventory...`, {
      theme: 'colored',
    });
    const response = await this.api.post('/inventory/reset');

    toast.success(`Cleaned out inventory!`, {
      theme: 'colored',
    });

    return response.data;
  }

  async syncQuest() {
    toast.info(`Syncing quests...`, {
      theme: 'colored',
    });
    const response = await this.api.delete('/user-roster');

    toast.info(`Fetching all quests again, this may take some time...`, {
      theme: 'colored',
    });

    return response.data;
  }
}
