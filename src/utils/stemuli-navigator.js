import axios from 'axios';
import Cookies from 'js-cookie';

export default class StemuliNavigator {
  #tenantId;

  #tenantKey;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_STEMULI_NAVIGATOR_API, // Ensure this environment variable is correctly set
      withCredentials: true,
    });
  }

  setTenant(name) {
    if (name === 'REACH') {
      this.#tenantId = import.meta.env.VITE_REACH_TENANT_ID;
      this.#tenantKey = import.meta.env.VITE_REACH_TENANT_KEY;
    } else if (name === 'STRIDE') {
      this.#tenantId = import.meta.env.VITE_STRIDE_TENANT_ID;
      this.#tenantKey = import.meta.env.VITE_STRIDE_TENANT_KEY;
    } else if (name === 'STEMULI') {
      this.#tenantId = import.meta.env.VITE_STEMULI_TENANT_ID;
      this.#tenantKey = import.meta.env.VITE_STEMULI_TENANT_KEY;
    }
  }

  async setBasicToken(token) {
    this.api.defaults.headers.common.Authorization = `Basic ${token}`;
  }

  async signIn(tenant, email, password) {
    this.setTenant(tenant);
    const base64String = btoa(`${email}:${password}`);
    this.setBasicToken(base64String);
    const response = await this.api.post('/nucleus-auth/v2/signin', {
      client_id: this.#tenantId,
      client_key: this.#tenantKey,
      grant_type: 'credential',
    });

    this.handleLocalStorage(response);

    return response.data;
  }

  handleLocalStorage = (response) => {
    window.localStorage.setItem('access_token', response.data.access_token, { expires: 1 });
    window.dispatchEvent(new Event('storage'));
  };

  async getTokenDetails() {
    const token = localStorage.getItem('access_token');
    this.api.defaults.headers.common.Authorization = `Token ${token}`;
    const response = await this.api.get('/nucleus-auth/v2/token', {});

    return { ...response.data, token };
  }

  async getRosterList(userId, tenantId, token, offset = 0, limit = 10) {
    try {
      this.api.defaults.headers.common.Authorization = `Token ${token}`;
      const response = await this.api.get(`/admin/v1/custom/roster/list`, {
        params: {
          tenantId,
          userId,
          offset,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch roster list:', error);
      throw error;
    }
  }

  async uploadRosterFile(userId, tenantId, token, file) {
    try {
      const fileFormData = new FormData();
      fileFormData.append('', file);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/admin/v1/custom/roster/upload?userId=${userId}&tenantId=${tenantId}&fileUploadType=rostering`,
        headers: {
          Authorization: `Token ${token}`,
        },
        data: fileFormData,
      };

      const response = await this.api(config);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}
