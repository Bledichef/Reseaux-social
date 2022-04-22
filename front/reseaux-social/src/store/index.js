import { remove } from "@vue/shared";
import { createStore } from "vuex";

const axios = require("axios");

const instance = axios.create({
  baseUrl: "http://localhost:8080/api/users/",
});

let user = localStorage.getItem("user");
if (!user) {
  user = {
    userId: -1,
    token: "",
  };
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common["Authorization"] = user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: "",
    };
  }
}
// Create store
const store = createStore({
  state: {
    status: "",
    userId: {
      id: -1,
      token: "",
    },
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      instance.defaults.headers.common["Authorization"] = user.token;
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    logout: function (state) {
      state.user = {
        userId: -1,
        token: "",
      };
      localStorage.removeItem("user");
    },
    deleteUser: function (state, userInfos, user) {
      console.log(userInfos);
      instance.defaults.headers.common["Authorization"] = user.token;

      state.userInfos = userInfos;
    },
    updateUser: function (state, user) {
      instance.defaults.headers.common["Authorization"] = user.token;
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },

    postMessage: function (state, user, userInfos) {
      instance.defaults.headers.common["Authorization"] = user.token;
      state.userInfos = userInfos;
    },
    updateMessage: function (state, userInfos, Messageid) {
      instance.defaults.headers.common["Authorization"] = user.token;

      state.userInfos = userInfos;
    },
    likeMessage: function (state, userInfos, Messageid) {
      instance.defaults.headers.common["Authorization"] = user.token;

      state.userInfos = userInfos;
    },
    dislikeMessage: function (state, userInfos, Messageid) {
      instance.defaults.headers.common["Authorization"] = user.token;

      state.userInfos = userInfos;
    },
    GetComment: function (state, Messageid) {},
    postComment: function (state, user, userInfos, Messageid) {
      instance.defaults.headers.common["Authorization"] = user.token;
      state.userInfos = userInfos;
    },
  },
  actions: {
    createAccount: ({ commit }, userInfos) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        commit;
        console.log(userInfos);
        instance
          .post("http://localhost:8080/api/users/register", userInfos)
          .then(function (response) {
            commit("setStatus", "created");
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_create");
            reject(error);
            console.log(error);
          });
      });
    },
    login: ({ commit }, userInfos) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        console.log(userInfos);
        instance
          .post("http://localhost:8080/api/users/login", userInfos)
          .then(function (response) {
            commit("setStatus", "");
            commit("logUser", response.data);
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    getUserInfos: ({ commit }) => {
      instance
        .get("http://localhost:8080/api/users/me")
        .then(function (response) {
          commit("userInfos", response.data);
        })
        .catch(function () {});
    },
    updateUser: ({ commit }, userInfos) => {
      commit("userInfos");
      return new Promise((resolve, reject) => {
        commit;
        console.log(userInfos);
        instance
          .put("http://localhost:8080/api/users/me", userInfos)
          .then(function (response) {
            commit("setStatus", "");
            commit("logUser", response.data);
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    deleteUser: ({ commit }, userInfos) => {
      commit("userInfos");
      return new Promise((resolve, reject) => {
        commit;
        console.log(userInfos);
        instance
          .delete("http://localhost:8080/api/users/me", userInfos)
          .then(function (response) {
            commit("setStatus", "");
            commit("logUser", response.data);
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    postMessage: ({ commit }, userInfos, message) => {
      commit("message");
      return new Promise((resolve, reject) => {
        commit;
        instance
          .post("http://localhost:8080/api/messages/new", userInfos, message)
          .then(function (response) {
            commit(response.data);
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    updateMessage: ({ commit }, userInfos, Messageid, message) => {
      (Messageid = localStorage.Messageid), commit("message");
      return new Promise((resolve, reject) => {
        console.log(Messageid);
        commit;
        instance
          .put(
            `http://localhost:8080/api/messages/${Messageid}`,
            userInfos,
            message
          )
          .then(function (response) {
            commit(response.data);
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    likeMessage: ({ commit }, userInfos, Messageid, message) => {
      (Messageid = localStorage.Messageid), commit("message");
      return new Promise((resolve, reject) => {
        console.log(Messageid);
        commit;
        instance
          .post(
            `http://localhost:8080/api/messages/${Messageid}/vote/like`,
            userInfos,
            message
          )
          .then(function (response) {
            commit(response.data);
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    dislikeMessage: ({ commit }, userInfos, Messageid, message) => {
      (Messageid = localStorage.Messageid), commit("message");
      return new Promise((resolve, reject) => {
        console.log(Messageid);
        commit;
        instance
          .post(
            `http://localhost:8080/api/messages/${Messageid}/vote/dislike`,
            userInfos,
            message
          )
          .then(function (response) {
            commit(response.data);
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    GetComment: ({ commit }, Messageid, comment) => {
      (Messageid = localStorage.Messageid), commit("Comment");
      console.log(Messageid);
      commit;
      instance
        .get(`http://localhost:8080/api/messages/${Messageid}/comment`)
        .then(function (response) {
          commit(response);

          console.log(Comment);
          console.log(response);
          console.log(response.data);
          localStorage.removeItem("Messageid");
          localStorage.setItem("Comment", JSON.stringify(response.data));
        })
        .catch(function () {});
    },
    postComment: ({ commit }, userInfos, Messageid, comment) => {
      (Messageid = localStorage.Messageid), commit("Comment");
      console.log(Messageid);
      return new Promise((resolve, reject) => {
        commit;
        instance
          .post(
            `http://localhost:8080/api/messages/${Messageid}/comment/new`,
            userInfos,
            comment
          )
          .then(function (response) {
            commit(response.data);
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
  },
});

export default store;
