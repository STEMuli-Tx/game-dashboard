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
    this.api.defaults.headers['x-api-key'] = `${import.meta.env.VITE_API_KEY}`;
    this.api.defaults.headers['x-access-token'] = `${this.#accessToken}`;
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

  async getCategories() {
    const response = await this.api.get(
      'catalog-item-categories?parentCategory=null&sort=sequence&population=[{"path":"subcategories","populate":{"path":"catalogItemsOnSubCategory"}}]'
    );

    return response.data;
  }

  async createCategory(data) {
    const response = await this.api.post('catalog-item-categories', data);

    return response.data;
  }

  async patchCategory(id, data) {
    const response = await this.api.patch(`catalog-item-categories/${id}`, data);

    return response.data;
  }

  async createCatalogItemsToSync(data) {
    const response = await this.api.post(`catalog-item-to-sync`, data);

    return response.data;
  }
}
