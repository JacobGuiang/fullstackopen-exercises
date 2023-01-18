import axios from 'axios';

const baseUrl = '/api/users';
let token = null;

const STORAGE_KEY = 'loggedUser';

const setLoggedUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  token = user.token;
};

const getLoggedUser = () => {
  const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY);
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    token = user.token;
    return user;
  }

  return null;
};

const getUser = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const getAllUsers = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const clearUser = () => {
  localStorage.clear();
  token = null;
};

const getToken = () => token;

export default {
  setLoggedUser,
  getLoggedUser,
  getUser,
  getAllUsers,
  clearUser,
  getToken,
};
