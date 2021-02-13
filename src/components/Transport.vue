<template lang="pug">
div.border.bg-opacity-100.bg-gray-700.transport.p-4
  div.flex.align-middle
    .flex-0.flex.items-center.mr-3
      button.border.rounded-full.h-14.w-14.text-xl(v-if="!this.playing" :disabled="!loaded", @click="onPlay" class="hover:text-gray-400 hover:border-gray-400") &#x25b6;
      button.border.rounded-full.h-14.w-14.text-xl.text-green-300.border-green-300.animate-pulse(v-if="this.playing" :disabled="!loaded", @click="onPlay" class="hover:text-green-400 hover:border-green-400") &#x25b6;
    .flex-1.flex.align-left
      button.border.rounded-full.h-14.w-14.text-xl(:disabled="!loaded", @click="onStop" class="hover:text-gray-400 hover:border-gray-400") &#x25a0;
    ul.flex-initial
      li 
        b File Duration: 
        p {{ duration }}
      li 
        b Sample Length: 
        p {{ sampleDuration }}
      li 
        b Sample Rate:
        p {{ sampleRate }}
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CanvasHTMLAttributes } from "vue";
import { Watch } from "vue-property-decorator";

@Options({
  props: {
    trackNumber: Number,
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
    playing: Boolean,
    loaded: Boolean,
  },
})
export default class Transport extends Vue {
  audioContext!: AudioContext;
  audioBuffer!: AudioBuffer;
  playing!: boolean;
  loaded = false;

  get buttonText() {
    return this.playing ? "Pause" : "&#x25B6;";
  }

  get duration() {
    return this.loaded ? this.audioBuffer.duration : 0;
  }

  get sampleDuration() {
    return this.loaded ? this.audioBuffer.length : 0;
  }

  get sampleRate() {
    return this.loaded ? this.audioBuffer.sampleRate : 0;
  }

  onPlay() {
    this.$emit("onPlay");
  }

  onStop() {
    this.$emit("onStop");
  }
}
</script>

<style>
.transport {
  color: white;
}
.flex-list {
    position: relative;
    margin: 0.3em;
    overflow: hidden;
    vertical-align: middle;
}
.flex-list ul {
/*     display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between; */
    margin-left: -1px;
}
.flex-list li {
/*     flex-basis: auto; */
   text-align: right;
}
.flex-item {
  display: flex;
  flex-direction: row
}
</style>