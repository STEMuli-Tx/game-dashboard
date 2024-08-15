import axios from 'axios';
import Cookies from 'js-cookie';

class StemuliNavigator {
  #tenantId;

  #tenantKey;

  constructor() {
    if (!StemuliNavigator.instance) {
      this.api = axios.create({
        baseURL: import.meta.env.VITE_STEMULI_NAVIGATOR_API,
        withCredentials: true,
      });
      StemuliNavigator.instance = this;
    }
  }

  setTenant(name) {
    switch (name) {
      case 'REACH':
        this.#tenantId = import.meta.env.VITE_REACH_TENANT_ID;
        this.#tenantKey = import.meta.env.VITE_REACH_TENANT_KEY;
        break;
      case 'STRIDE':
        this.#tenantId = import.meta.env.VITE_STRIDE_TENANT_ID;
        this.#tenantKey = import.meta.env.VITE_STRIDE_TENANT_KEY;
        break;
      case 'STEMULI':
        this.#tenantId = import.meta.env.VITE_STEMULI_TENANT_ID;
        this.#tenantKey = import.meta.env.VITE_STEMULI_TENANT_KEY;
        break;
      default:
        throw new Error('Invalid tenant name');
    }
  }

  async setToken(token) {
    this.api.defaults.headers.common.Authorization = `Token ${token}`;
  }

  async signIn(tenant, email, password) {
    try {
      this.setTenant(tenant);
      const base64String = btoa(`${email}:${password}`);
      const response = await this.api.post(
        '/nucleus-auth/v2/signin',
        {
          client_id: this.#tenantId,
          client_key: this.#tenantKey,
          grant_type: 'credential',
        },
        {
          headers: {
            Authorization: `Basic ${base64String}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  }

  async getTokenDetails() {
    try {
      const token = localStorage.getItem('access_token');
      this.api.defaults.headers.common.Authorization = `Token ${token}`;
      const response = await this.api.get('/nucleus-auth/v2/token');
      return { ...response.data, token };
    } catch (error) {
      console.error('Error fetching token details:', error);
      throw error;
    }
  }

  async getRosterList(userId, tenantId, offset = 0, limit = 10) {
    try {
      const response = await this.api.get('/admin/v1/custom/roster/list', {
        params: { tenantId, userId, offset, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch roster list:', error);
      throw error;
    }
  }

  async uploadRosterFile(userId, tenantId, file) {
    try {
      const fileFormData = new FormData();
      fileFormData.append('', file);
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/admin/v1/custom/roster/upload?userId=${userId}&tenantId=${tenantId}&fileUploadType=rostering`,
        data: fileFormData,
      };
      const response = await this.api(config);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getUsers(offset = 0, limit = 10, searchTerms = '', role = 'student') {
    try {
      const response = await this.api.get('/admin/v1/roster/users', {
        params: { offset, limit, search_terms: searchTerms, role },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }
}

const instance = new StemuliNavigator();
Object.freeze(instance);

export default instance;
