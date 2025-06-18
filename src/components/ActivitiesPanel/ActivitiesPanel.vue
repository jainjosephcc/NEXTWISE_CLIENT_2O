<script setup lang="ts">
import { Slideover } from "@/components/Base/Headless";
import { Menu } from "@/components/Base/Headless";
import Lucide from "@/components/Base/Lucide";
import activities from "@/fakers/activities";
import FileIcon from "@/components/Base/FileIcon";
import _ from "lodash";

interface MainProps {
  activitiesPanel: boolean;
  setActivitiesPanel: (val: boolean) => void;
}

const props = withDefaults(defineProps<MainProps>(), {
  activitiesPanel: false,
  setActivitiesPanel: () => {},
});
</script>

<template>
  <div>
    <Slideover
      :open="props.activitiesPanel"
      @close="
        () => {
          props.setActivitiesPanel(false);
        }
      "
    >
      <Slideover.Panel
        class="w-72 rounded-[0.75rem_0_0_0.75rem/1.1rem_0_0_1.1rem]"
      >
        <a
          href=""
          class="focus:outline-none hover:bg-white/10 bg-white/5 transition-all hover:rotate-180 absolute inset-y-0 left-0 right-auto flex items-center justify-center my-auto -ml-[60px] sm:-ml-[105px] border rounded-full text-white/90 w-8 h-8 sm:w-14 sm:h-14 border-white/90 hover:scale-105"
          @click="
            (e) => {
              e.preventDefault();
              props.setActivitiesPanel(false);
            }
          "
        >
          <Lucide class="w-8 h-8 stroke-[1]" icon="X" />
        </a>
        <Slideover.Title class="px-6 py-5">
          <h2 class="mr-auto text-base font-medium">Latest Updates</h2>
        </Slideover.Title>
        <Slideover.Description class="p-0">
          <div class="px-5 py-3 flex flex-col gap-3.5">
            <div
              class="relative overflow-hidden before:content-[''] before:absolute before:w-px before:bg-slate-200/60 before:left-0 before:inset-y-0 before:dark:bg-darkmode-400 before:ml-[14px]"
            >
              No new Notifications
            </div>
          </div>
        </Slideover.Description>
      </Slideover.Panel>
    </Slideover>
  </div>
</template>
