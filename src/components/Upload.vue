<template lang="pug">
div.w-full.h-full
  form(enctype="multipart/form-data" novalidate)
    label.file-select.block.h-64.relative.overflow-hidden(for="audio-upload")
      input.overlayed(
        id="audio-upload"
        type="file"
        single
        name="uploadAudioFile"
        @change="uploadFile($event.target.files)"
        accept="audio/*"
      )
      span.overlayed.w-full.border-2.pointer-events-none.flex.justify-center.items-center.bg-gray-100.align-middle.h-full.normal-case
        div.text-center
          slot
            p Drag and Drop an Audio File
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    modelValue: String
  }
})
export default class Upload extends Vue {
  modelValue!: string;

  updateUrl(url: string) {
    this.$emit("update:modelValue", url);
  }

  uploadFile(files: any) {
    const url = URL.createObjectURL(files[0]);
    this.updateUrl(url);
  }
}
</script>

<style>
.overlayed {
  @apply absolute top-0 left-0 right-0 bottom-0 block;
}
</style>
