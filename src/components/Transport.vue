<template lang="pug">
div.border.bg-opacity-100.bg-gray-700.transport.p-4
  div.flex-list.align-middle
    ul
      li   
        button.border.rounded.p-1(:disabled="!loaded", @click="onPlay") {{ buttonText }}
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
    return this.playing ? "Pause" : "Play";
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: -1px;
}
.flex-list li {
    flex-grow: 1;
    flex-basis: auto;
    text-align: right;
}
</style>