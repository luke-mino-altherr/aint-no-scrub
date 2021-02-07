<template lang="pug">
div.border.m-4.text-left
  div.p-2.text-align-left
    a(@click="collapsed = !collapsed")
      h2(v-if="!collapsed") &#x25BE; Track
      h2(v-else) &#x25B8; Track
    input(type="checkbox" v-model="enabled")
  div(v-if="!collapsed")
    div.p-2
      label Playback Speed
      VueSlider(v-model="playbackSpeed", min=0, max=7, interval=0.1)
    div.p-2
      label Predelay (s)
      VueSlider(v-model="predelay", min=0, max=5, interval=0.1)
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Watch } from "vue-property-decorator";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

@Options({
  props: {
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
    playing: Boolean,
  },
  components: {
    VueSlider,
  },
})
export default class AudioTrack extends Vue {
  audioContext!: AudioContext;
  audioBuffer!: AudioBuffer;
  playing!: boolean;

  collapsed = true;
  enabled = true;
  bufferSourceNode!: AudioBufferSourceNode;
  startLocation = 0;
  endLocation!: number;
  loop!: boolean;
  predelay = 0;
  playbackSpeed = 1;

  @Watch("playing")
  onPlayStateChange() {
    if (!this.playing) {
      this.bufferSourceNode.stop(0);
    } else if (this.playing && this.enabled) {
      this.bufferSourceNode = this.audioContext.createBufferSource();
      this.bufferSourceNode.buffer = this.audioBuffer;
      this.bufferSourceNode.loop = this.loop;
      this.bufferSourceNode.playbackRate.value = this.playbackSpeed;

      this.bufferSourceNode.connect(this.audioContext.destination);
      this.bufferSourceNode.start(this.audioContext.currentTime + this.predelay);
    }
  }

  @Watch("playbackSpeed")
  onPlaybackSpeedChange() {
    if (this.bufferSourceNode) this.bufferSourceNode.playbackRate.value = this.playbackSpeed;
  }
}
</script>
<style lang="">
</style>
