import { createRouter, createWebHashHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Connexion from "@/views/Connexion.vue";
import Enregistrer from "@/views/Enregistrer.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    name: "Home",
    path: "/",
    component: Home,
    meta: {
      title: "Accueil",
    },
  },
  {
    name: "Connexion",
    path: "/Connexion",
    component: Connexion,
    meta: {
      title: "A propos",
    },
  },
  {
    name: "Enregistrer",
    path: "/Enregistrer",
    component: Enregistrer,
    meta: {
      title: "Enregistrer",
    },
  },
  {
    name: "NotFound",
    path: "/:pathMatch(.*)",
    component: NotFound,
    meta: {
      title: "404 Not Found",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach((to, from) => {
  console.log(from, to);
  document.title = to.meta.title;
});

export default router;
