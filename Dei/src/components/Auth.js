import { AsyncStorage } from 'react-native';

export const isLoggedInKey = 'isLoggedIn';
export const UserLoginDetailsKey = 'UserLoginDetails';
export const UserTokenKey = 'UserToken';
export const PUSHTOKEN = 'PushToken';

export const resetUserInfo = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(UserLoginDetailsKey)
      .then(res => {
        console.log(res);
        resolve(true);
      })
      .catch(err => reject(false));
  });
};

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(UserLoginDetailsKey)
      .then(res => {
        if (res !== null) {
          resolve(JSON.parse(res));
        } else {
          resolve({});
        }
      })
      .catch(err => reject({}));
  });
};

export const getUserToken = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(UserTokenKey)
      .then(res => {
        if (res !== null) {
          resolve(res);
        } else {
          resolve('');
        }
      })
      .catch(err => reject(''));
  });
};

export const saveUserTokenInfo = details => {
  AsyncStorage.setItem(UserLoginDetailsKey, JSON.stringify(details));
  AsyncStorage.setItem(UserTokenKey, details.token);
};
export const getPushToken = () =>
  new Promise((resolve, reject) => {
    AsyncStorage.getItem(PUSHTOKEN)
      .then(res => {
        if (res !== null) {
          resolve(`${res}`);
        } else {
          resolve('');
        }
      })
      .catch(err => reject(err));
  });

export const savePushToken = pushtoken =>
  new Promise((resolve, reject) => {
    AsyncStorage.setItem(PUSHTOKEN, pushtoken)
      .then(() => {
        console.log('It was saved successfully');
        resolve(true);
      })
      .catch(err => {
        console.log('There was an error saving the push token');
        reject(err);
      });
  });
