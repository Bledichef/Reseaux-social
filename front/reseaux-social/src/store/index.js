import { remove } from "@vue/shared";
import { createStore } from "vuex";

const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
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
    // Ajouter "Bearer " si ce n'est pas déjà présent
    if (user.token) {
      const token = user.token.startsWith("Bearer ") 
        ? user.token 
        : `Bearer ${user.token}`;
      instance.defaults.headers.common["Authorization"] = token;
    }
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
    user: user, // Initialiser avec l'utilisateur du localStorage
    userInfos: null,
    comments: [],
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      // Ajouter "Bearer " si ce n'est pas déjà présent
      const token = user.token && user.token.startsWith("Bearer ") 
        ? user.token 
        : `Bearer ${user.token}`;
      instance.defaults.headers.common["Authorization"] = token;
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
      window.location.reload(true);
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
    deleteMessage: function (state, userInfos, Messageid) {
      instance.defaults.headers.common["Authorization"] = user.token;

      state.userInfos = userInfos;
    },
    likeMessage: function (state, data) {
      if (data && data.userInfos) {
        state.userInfos = data.userInfos;
      }
    },
    dislikeMessage: function (state, data) {
      if (data && data.userInfos) {
        state.userInfos = data.userInfos;
      }
    },
    GetComment: function (state, comments) {
      state.comments = comments;
    },
    postComment: function (state, user, userInfos) {
      if (user && user.token) {
        instance.defaults.headers.common["Authorization"] = user.token;
      }
      if (userInfos) {
        state.userInfos = userInfos;
      }
    },
    updateComment: function (state, data) {
      if (data && data.userInfos) {
        state.userInfos = data.userInfos;
      }
    },
    deleteComment: function (state, data) {
      if (data && data.userInfos) {
        state.userInfos = data.userInfos;
      }
    },
  },
  actions: {
    createAccount: ({ commit }, userInfos) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        commit;
        console.log(userInfos);
        instance
          .post("/users/register", userInfos)
          .then(function (response) {
            commit("setStatus", "created");
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            alert(
              `verifier le formulaire, il comporte une ou plusieurs erreurs, Votre nom d'utilisateur doit contenir entre 2 et 20 lettres et Votre mot de passe doit contenir minimum 6 et au maximum 20 caractères. Doit inclure une majuscule, une minuscule et un chiffre et des caractères spéciaux et ne peut pas non plus commencer par un chiffre, un trait de soulignement ou un caractère spécial`
            );
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
          .post("/users/login/", userInfos)
          .then(function (response) {
            commit("setStatus", "");
            commit("logUser", response.data);
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            alert(
              `verifier le formulaire, il comporte une ou plusieurs erreurs, Votre nom d'utilisateur doit contenir entre 2 et 20 lettres et Votre mot de passe doit contenir minimum 6 et au maximum 20 caractères. Doit inclure une majuscule, une minuscule et un chiffre et des caractères spéciaux et ne peut pas non plus commencer par un chiffre, un trait de soulignement ou un caractère spécial`
            );
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    getUserInfos: ({ commit }) => {
      console.log("🔐 getUserInfos - Token dans headers:", instance.defaults.headers.common["Authorization"] ? "Présent" : "ABSENT");
      instance
        .get("/users/me")
        .then(function (response) {
          commit("userInfos", response.data);
        })
        .catch(function (error) {
          console.error("❌ Erreur getUserInfos:", error);
          localStorage.removeItem("user");
        });
    },
    updateUser: ({ commit }, userInfos) => {
      commit("userInfos");
      return new Promise((resolve, reject) => {
        commit;
        console.log(userInfos);
        instance
          .put("/users/me", userInfos)
          .then(function (response) {
            commit("setStatus", "");
            commit("getUserInfos", response.data);
            resolve(response);
            console.log(response);
            window.location.reload(true);
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
          .delete("/users/me", userInfos)
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
    postMessage: ({ commit, state }, messageData) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        // Récupérer le token depuis localStorage
        let user = localStorage.getItem("user");
        if (user) {
          try {
            user = JSON.parse(user);
          } catch (ex) {
            user = { token: "" };
          }
        } else {
          user = { token: "" };
        }
        
        instance
          .post("/messages/new/", messageData)
          .then(function (response) {
            commit("setStatus", "");
            commit("postMessage", { user: user, userInfos: response.data });
            resolve(response);
            console.log(response);
            window.location.reload(true);
          })
          .catch(function (error) {
            alert(
              "Pensez à vous identifier avant de poster, si vous n'avez pas encore de compte creer en un sur la page de connexion"
            );
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
            `/messages/${Messageid}`,
            userInfos,
            message
          )
          .then(function (response) {
            commit(response.data);
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
            window.location.reload(true);
          })
          .catch(function (error) {
            alert("vous ne pouvez pas effectué cette action");
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    deleteMessage: ({ commit }, userInfos, Messageid, message) => {
      (Messageid = localStorage.Messageid), commit("message");
      return new Promise((resolve, reject) => {
        console.log(Messageid);
        commit;
        instance
          .delete(
            `/messages/${Messageid}`,
            userInfos,
            message
          )
          .then(function (response) {
            commit(response.data);
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
            window.location.reload(true);
          })
          .catch(function (error) {
            alert("vous ne pouvez pas effectué cette action");
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    likeMessage: ({ commit }, data) => {
      let Messageid = data.messageId || JSON.parse(localStorage.getItem("Messageid") || "0");
      return new Promise((resolve, reject) => {
        console.log(Messageid);
        instance
          .post(`/messages/${Messageid}/vote/Like`)
          .then(function (response) {
            commit("likeMessage", { userInfos: response.data, Messageid: Messageid });
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
            window.location.reload(true);
          })
          .catch(function (error) {
            alert(
              "Pensez à vous identifier avant de liker, si vous n'avez pas encore de compte creer en un sur la page de connexion"
            );
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    dislikeMessage: ({ commit }, data) => {
      let Messageid = data.messageId || JSON.parse(localStorage.getItem("Messageid") || "0");
      return new Promise((resolve, reject) => {
        console.log(Messageid);
        instance
          .post(`/messages/${Messageid}/vote/dislike`)
          .then(function (response) {
            commit("dislikeMessage", { userInfos: response.data, Messageid: Messageid });
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
            window.location.reload(true);
          })
          .catch(function (error) {
            alert(
              "Pensez à vous identifier avant de disliker, si vous n'avez pas encore de compte creer en un sur la page de connexion"
            );
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    GetComment: ({ commit }, Messageid) => {
      return new Promise((resolve, reject) => {
        if (!Messageid) {
          Messageid = JSON.parse(localStorage.getItem("Messageid") || "0");
        }
        console.log(Messageid);
        instance
          .get(`/messages/${Messageid}/comment`)
          .then(function (response) {
            commit("GetComment", response.data);
            console.log(response);
            console.log(response.data);
            localStorage.setItem("Comment", JSON.stringify(response.data));
            resolve(response);
            window.location.reload(true);
          })
          .catch(function (error) {
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    postComment: ({ commit }, commentData) => {
      return new Promise((resolve, reject) => {
        let Messageid = commentData.messageId || JSON.parse(localStorage.getItem("Messageid") || "0");
        let user = localStorage.getItem("user");
        if (user) {
          try {
            user = JSON.parse(user);
          } catch (ex) {
            user = { token: "" };
          }
        } else {
          user = { token: "" };
        }
        
        console.log(Messageid);
        instance
          .post(
            `/messages/${Messageid}/comment/new`,
            { content: commentData.content }
          )
          .then(function (response) {
            commit("postComment", { user: user, userInfos: response.data });
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
            window.location.reload(true);
          })
          .catch(function (error) {
            alert(
              "Pensez à vous identifier avant de poster, si vous n'avez pas encore de compte creer en un sur la page de connexion"
            );
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    updateComment: ({ commit }, commentData) => {
      return new Promise((resolve, reject) => {
        let Messageid = commentData.messageId || JSON.parse(localStorage.getItem("Messageid") || "0");
        let Commentid = commentData.commentId || JSON.parse(localStorage.getItem("Commentid") || "0");
        let user = localStorage.getItem("user");
        if (user) {
          try {
            user = JSON.parse(user);
          } catch (ex) {
            user = { token: "" };
          }
        } else {
          user = { token: "" };
        }
        
        console.log("Update comment - MessageId:", Messageid, "CommentId:", Commentid);
        console.log("Token dans headers:", instance.defaults.headers.common["Authorization"] ? "Présent" : "ABSENT");
        instance
          .put(
            `/messages/${Messageid}/comment/${Commentid}/`,
            { content: commentData.content }
          )
          .then(function (response) {
            commit("updateComment", { userInfos: response.data });
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
            localStorage.removeItem("Commentid");
            window.location.reload(true);
          })
          .catch(function (error) {
            alert("vous ne pouvez pas effectuer cette action");
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
    deleteComment: ({ commit }, commentData) => {
      return new Promise((resolve, reject) => {
        let Messageid = commentData.messageId || JSON.parse(localStorage.getItem("Messageid") || "0");
        let Commentid = commentData.commentId || JSON.parse(localStorage.getItem("Commentid") || "0");
        let user = localStorage.getItem("user");
        if (user) {
          try {
            user = JSON.parse(user);
          } catch (ex) {
            user = { token: "" };
          }
        } else {
          user = { token: "" };
        }
        
        console.log("Delete comment - MessageId:", Messageid, "CommentId:", Commentid);
        instance
          .delete(
            `/messages/${Messageid}/comment/${Commentid}/`
          )
          .then(function (response) {
            commit("deleteComment", { userInfos: response.data });
            resolve(response);
            console.log(response);
            localStorage.removeItem("Messageid");
            localStorage.removeItem("Commentid");
            window.location.reload(true);
          })
          .catch(function (error) {
            alert("vous ne pouvez pas effectuer cette action");
            commit("setStatus", "error_logged");
            reject(error);
            console.log(error);
          });
      });
    },
  },
});

export default store;
