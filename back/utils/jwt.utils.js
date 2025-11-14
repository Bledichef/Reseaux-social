// Imports
var jwt = require("jsonwebtoken");

// Utiliser la variable d'environnement ou une valeur par défaut pour le développement
const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET || "RANDOM_TOKEN_SECRET_CHANGE_THIS_IN_PRODUCTION";

// Function Exporté
module.exports = {
  generateTokenForUser: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: "24h",
      }
    );
  },
  parseAuthorization: function (authorization) {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },
  getUserId: function (authorization) {
    var userId = -1;
    var token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        if (!JWT_SIGN_SECRET) {
          console.error("❌ JWT_SIGN_SECRET n'est pas défini!");
          return userId;
        }
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null) {
          userId = jwtToken.userId;
          console.log("✅ Token vérifié - userId extrait:", userId);
        }
      } catch (err) {
        console.error("❌ Erreur lors de la vérification du token:", err.message);
      }
    } else {
      console.error("❌ Token est null - authorization:", authorization ? authorization.substring(0, 30) + "..." : "AUCUN");
    }
    return userId;
  },

  getAdmin: function (authorization) {
    let isAdmin = false;
    let token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        if (!JWT_SIGN_SECRET) {
          console.error("❌ JWT_SIGN_SECRET n'est pas défini!");
          return false;
        }
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null) {
          isAdmin = jwtToken.isAdmin || false;
          console.log("✅ Token vérifié - isAdmin extrait:", isAdmin);
        }
      } catch (err) {
        console.error("❌ Erreur lors de la vérification du token (isAdmin):", err.message);
      }
    }
    return isAdmin;
  },
};
