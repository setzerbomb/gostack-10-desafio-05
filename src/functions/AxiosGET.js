import api from '../services/api';

export default async function (url, query = {}) {
  try {
    const { data } = await api.get(url, query);
    return data;
  } catch (e) {
    return { error: e?.message };
  }
}
