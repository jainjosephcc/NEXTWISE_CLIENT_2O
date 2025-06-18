import { defineStore } from "pinia";
import Hurricane from "@/themes/Hurricane/index.ts";
import Ravage from "@/themes/Ravage/index.ts";
import Echo from "@/themes/Echo/index.ts";
import Hook from "@/themes/Hook/index.ts";
import Razor from "@/themes/Razor/index.ts";
import Havoc from "@/themes/Havoc/index.ts";
import Dagger from "@/themes/Dagger/index.ts";
import Shuriken from "@/themes/Shuriken/index.ts";
import Raze from "@/themes/Raze/index.ts";
import Exort from "@/themes/Exort/index.ts";
import Viper from "@/themes/Viper/index.ts";

export const themes = [
  {
    name: "echo",
    component: Echo,
  },
  {
    name: "hurricane",
    component: Hurricane,
  },
  {
    name: "ravage",
    component: Ravage,
  },
  {
    name: "hook",
    component: Hook,
  },
  {
    name: "razor",
    component: Razor,
  },
  {
    name: "havoc",
    component: Havoc,
  },
  {
    name: "dagger",
    component: Dagger,
  },
  {
    name: "shuriken",
    component: Shuriken,
  },
  {
    name: "raze",
    component: Raze,
  },
  {
    name: "exort",
    component: Exort,
  },
  {
    name: "viper",
    component: Viper,
  },
] as const;

export type Themes = (typeof themes)[number];

interface ThemeState {
  value: Themes["name"];
}

export const getTheme = (search?: Themes["name"]) => {
  const theme = search === undefined ? localStorage.getItem("theme") : search;
  return (
    themes.filter((item, key) => {
      return item.name === theme;
    })[0] || themes[0]
  );
};

export const useThemeStore = defineStore("theme", {
  state: (): ThemeState => ({
    value:
      localStorage.getItem("theme") === null ? themes[0].name : getTheme().name,
  }),
  getters: {
    theme(state) {
      if (localStorage.getItem("theme") === null) {
        localStorage.setItem("theme", "echo");
      }

      return state.value;
    },
  },
  actions: {
    setTheme(theme: Themes["name"]) {
      this.value = theme;

      localStorage.setItem("theme", theme);
    },
  },
});