import axios from 'axios';

import { toast } from 'react-toastify';

export default class GameService {
  #accessToken;

  constructor(accessToken, baseURL) {
    this.#accessToken = accessToken;
    this.setBaseURL(baseURL);

    this.setHeaders();
  }

  async setHeaders() {
    this.api.defaults.headers['x-api-key'] = `${this.#accessToken}`;
  }

  setBaseURL(baseURL) {
    if (this.api) {
      this.api.defaults.baseURL = baseURL;
    } else {
      this.api = axios.create({
        baseURL,
      });
    }
  }

  async getQuests() {
    console.log('Current baseURL:', this.api.defaults.baseURL);
    const response = await this.api.get('/user-quest', { baseURL: this.api.defaults.baseURL });

    console.log('Fetched with baseURL', response);
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

  async markKioskObjectivesComplete() {
    try {
      toast.info(`Marking Kiosk Objectives Complete`, {
        theme: 'colored',
      });
      const response = await this.api.post('/user-objective/complete/kiosk');

      toast.success(`Done marking objectives Complete!`, {
        theme: 'colored',
      });

      return response.data;
    } catch (e) {
      toast.error(`Error marking objectives`, {
        theme: 'colored',
      });
    }
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

  async deleteTitlePlayer() {
    toast.info(`Deleting Title Player`, {
      theme: 'colored',
    });
    const response = await this.api.post('/player/delete-title-player');

    toast.success(`Deleted Player!`, {
      theme: 'colored',
    });

    return response.data;
  }

  async addAllInventoryItems() {
    toast.info(`Job started to add all items, this may take a few moments...`, {
      theme: 'colored',
    });
    const response = await this.api.post('/inventory/add-all-items');

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

  async resetPlayerLevelData() {
    toast.info(`Clearing Level Data`, {
      theme: 'colored',
    });
    const response = await this.api.delete('/user-level/items/hard-delete');

    toast.success(`Cleared Level Data`, {
      theme: 'colored',
    });

    return response.data;
  }

  async getRoamingNPCs() {
    const response = await this.api.get('/roaming-npc');

    return response.data.data;
  }
  async resetRoamingNPCs(ids) {
    try {
      toast.info(`Resetting Roaming NPC Dialog...`, {
        theme: 'colored',
      });
      const response = await this.api.post('/roaming-npc/player/reset', { gameObjectIds: ids });

      toast.success(`Reset Roaming NPCs`, {
        theme: 'colored',
      });

      return response.data;
    } catch (error) {
      console.error('Failed to reset roaming NPCs:', error);
      toast.error(`Error Resetting`, {
        theme: 'colored',
      });
    }
  }

  async getStudents() {
    try {
      const response = await this.api.get('/student?perPage=300&sort={"firstName":1}');

      return response.data;
    } catch (error) {
      toast.error(`Error getting students`, {
        theme: 'colored',
      });
    }
  }

  async getNavigatorObjectiveDetails() {
    try {
      const response = await this.api.get('/navigator-objective-detail?perPage=300');

      return response.data;
    } catch (error) {
      console.error('Failed to load activity details:', error);
      toast.error(`Failed to load activity details:`, {
        theme: 'colored',
      });
    }
  }

  async markLearningObjectivesComplete(data) {
    try {
      const response = await this.api.post('/user-objective/kiosk/complete', data);

      toast.success(`🎮 Marked Learning Objectives Complete in game!`, {
        theme: 'colored',
      });

      return response.data;
    } catch (error) {
      console.error('Failed to load activity details:', error);
      toast.error(`Failed to load activity details:`, {
        theme: 'colored',
      });
    }
  }
}
