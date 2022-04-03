<template lang="pug">
div.h-64
    button.w-full.p-0.m-0.border-0.justify-center.bg-red-300.align-middle.h-full(v-if="!recording" @click="onRecord") Record
    button.w-full.p-0.m-0.border-0.justify-center.bg-red-300.animate-pulse.align-middle.h-full(v-else @click="onStop") Stop
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
  mediaRecorder!: MediaRecorder;
  audioBuffer: Array<Blob> = [];

  recording = false;

  onRecord() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
        this.audioBuffer.push(e.data);
        console.log("data avail");
      };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioBuffer, {
          type: "audio/ogg; codecs=opus"
        });
        const audioURL = URL.createObjectURL(blob);
        this.updateUrl(audioURL);
      };
      this.recording = true;
    });
  }

  onStop() {
    this.mediaRecorder.stop();
  }

  updateUrl(url: string) {
    this.$emit("update:modelValue", url);
  }

  uploadFile(files: any) {
    const url = URL.createObjectURL(files[0]);
    this.updateUrl(url);
  }
}
</script>

<style></style>
