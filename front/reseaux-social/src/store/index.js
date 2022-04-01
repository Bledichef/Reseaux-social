import { createStore } from "vuex";

const axios = require("axios");

const instance = axios.create({
  baseUrl: "http://localhost:8080/api/users/",
});

// Create store
const store = createStore({
  state: {},
  actions: {
    createAccount: ({ commit }, userInfos) => {
      return new Promise((resolve, reject) => {
        commit;
        console.log(userInfos);
        instance
          .post("http://localhost:8080/api/users/register", userInfos)
          .then(function (response) {
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            reject(error);
            console.log(error);
          });
      });
    },
  },
});

export default store;
