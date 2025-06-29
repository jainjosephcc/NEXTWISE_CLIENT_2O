<script lang="ts">
export default {
  inheritAttrs: false,
};

interface FormSelectProps extends /* @vue-ignore */ SelectHTMLAttributes {
  value?: SelectHTMLAttributes["value"];
  modelValue?: SelectHTMLAttributes["value"];
  formSelectSize?: "sm" | "lg";
}
</script>

<script setup lang="ts">
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import {
  computed,
  type SelectHTMLAttributes,
  useAttrs,
  inject,
  ref,
} from "vue";
import { type ProvideFormInline } from "./FormInline.vue";

interface FormSelectEmit {
  (e: "update:modelValue", value: string): void;
}

const selectRef = ref<HTMLSelectElement>();
const props = defineProps<FormSelectProps>();
const attrs = useAttrs();
const formInline = inject<ProvideFormInline>("formInline", false);

const computedClass = computed(() =>
  twMerge([
    "disabled:bg-slate-100 disabled:cursor-not-allowed disabled:dark:bg-darkmode-700/50",
    "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-700/50",
    "bg-chevron-black transition duration-200 ease-in-out w-full text-sm border-slate-300/60 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:bg-chevron-white",
    props.formSelectSize == "sm" && "text-xs py-1.5 pl-2 pr-8",
    props.formSelectSize == "lg" && "text-lg py-1.5 pl-4 pr-8",
    formInline && "flex-1",
    typeof attrs.class === "string" && attrs.class,
  ])
);

const emit = defineEmits<FormSelectEmit>();

const localValue = computed({
  get() {
    if (props.modelValue === undefined && props.value === undefined) {
      const firstOption = selectRef.value?.querySelectorAll("option")[0];
      return (
        firstOption !== undefined &&
        (firstOption.getAttribute("value") !== null
          ? firstOption.getAttribute("value")
          : firstOption.text)
      );
    }

    return props.modelValue === undefined ? props.value : props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
</script>

<template>
  <select
    ref="selectRef"
    :class="computedClass"
    v-bind="_.omit(attrs, 'class')"
    v-model="localValue"
  >
    <slot></slot>
  </select>
</template>
