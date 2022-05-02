import { createRouter, createWebHashHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Connexion from "@/views/Connexion.vue";
import NotFound from "@/views/NotFound.vue";
import Profile from "@/views/Profile";
import Enregistrer from "@/views/Enregistrer";

const routes = [
  {
    name: "Home",
    path: "/Home/",
    component: Home,
    props: true,
    meta: {
      title: "Accueil",
    },
  },
  {
    name: "Connexion",
    path: "/",
    component: Connexion,
    props: true,
    meta: {
      title: "Connexion",
    },
  },
  {
    name: "Enregistrer",
    path: "/Enregistrer/",
    component: Enregistrer,
    props: true,
    meta: {
      title: "Enregistrer",
    },
  },
  {
    name: "Profile",
    path: "/Profile",
    component: Profile,
    props: true,
    meta: {
      title: "Profile",
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
