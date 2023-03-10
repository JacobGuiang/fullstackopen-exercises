import axios from 'axios';

const baseUrl = '/api/blogs';

const create = (id, newObject) => {
  const request = axios.post(`${baseUrl}/${id}/comments`, newObject);
  return request.then((response) => response.data);
};

export default { create };
