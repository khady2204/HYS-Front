export interface Environment {
  production: boolean;
  apiBase: string;
  withCredentials: boolean;
  googleClientId: string;
}

export const environment: Environment = {
  production: true,
  apiBase: 'http://api.hysinternational.com:8080', 
  withCredentials: true,
  googleClientId: '440755805165-0lsmqghacaffjq393md8g6bpngn1d3a6.apps.googleusercontent.com'
};
