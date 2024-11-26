import { TOKEN_KEY } from '../constants';

const isToken = (tokenName: string = TOKEN_KEY) => {
  return !!localStorage.getItem(tokenName);
};

const setToken = (token: string, tokenName: string = TOKEN_KEY) => {
  localStorage.setItem(tokenName, token);
};

const getToken = (tokenName: string = TOKEN_KEY) => {
  return localStorage.getItem(tokenName);
};

const clearToken = (tokenName: string = TOKEN_KEY) => {
  return localStorage.removeItem(tokenName);
};

export { isToken, getToken, setToken, clearToken };