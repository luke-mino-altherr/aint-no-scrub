<template lang="pug">
div.border.m-4.text-left
  div.p-2.text-align-left
    a(@click="collapsed = !collapsed")
      h2.inline(v-if="!collapsed") &#x25BE; Track {{ trackNumber }}
      h2.inline(v-else) &#x25B8; Track {{ trackNumber }}
    input.m-2(type="checkbox" v-model="enabled")
    button(@click="trigger") Trigger
  div(v-if="!collapsed")
    div.p-2
      label Playback Speed
      VueSlider(v-model="playbackSpeed", min=0, max=7, interval=0.1)
    div.p-2
      label Pan
      VueSlider(v-model="panLocation", min=-1, max=1, interval=0.1)
    div.p-2
      label Volume
      VueSlider(v-model="gain", min=0, max=1, interval=0.1)          
    div.p-2
      label Predelay (s)
      VueSlider(v-model="predelay", min=0, max=5, interval=0.1)
    div.p-2
      label Playback Locators
      VueSlider(v-model="locator", min=0, max=1, interval=0.01)
    div.p-2
      label Looped
      input.m-2(type="checkbox" v-model="loop")  
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Watch } from "vue-property-decorator";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

@Options({
  props: {
    trackNumber: Number,
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
  trackNumber!: number;

  collapsed = true;
  enabled = true;

  bufferSourceNode!: AudioBufferSourceNode;
  panNode!: StereoPannerNode;
  gainNode!: GainNode;

  locator = [0, 1];
  endLocation!: number;
  loop!: boolean;
  predelay = 0;
  playbackSpeed = 1;
  panLocation = 0;
  gain = 1;

  get playbackStart() {
    return this.audioBuffer.duration * this.locator[0];
  }

  get playbackEnd() {
    return this.audioBuffer.duration * this.locator[1];
  }

  get duration() {
    return this.playbackEnd - this.playbackStart;
  }

  @Watch("playing")
  onPlayStateChange() {
    if (!this.playing) {
      if (this.bufferSourceNode) this.bufferSourceNode.stop(0);
    } else if (this.playing && this.enabled) {
      this.trigger();
    }
  }

  initializeDevice() {
      this.bufferSourceNode = this.audioContext.createBufferSource();
      this.bufferSourceNode.buffer = this.audioBuffer;

      this.setLoopLocation();
      this.setPlaybackSpeed();

      this.panNode = this.audioContext.createStereoPanner();
      this.setPanLocation();

      this.gainNode = this.audioContext.createGain();
      this.setGain();

      this.bufferSourceNode.connect(this.panNode); 
      this.panNode.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)

      this.bufferSourceNode.start(this.audioContext.currentTime + this.predelay, this.playbackStart);
  }

  trigger() {
    if (this.bufferSourceNode) this.bufferSourceNode.stop(0)
    this.initializeDevice()
  }

  @Watch("playbackSpeed")
  setPlaybackSpeed() {
    if (this.bufferSourceNode) this.bufferSourceNode.playbackRate.value = this.playbackSpeed;
  }

  @Watch("panLocation")
  setPanLocation() {
    if (this.panNode) this.panNode.pan.setValueAtTime(this.panLocation, 0);
  }

  @Watch("gain")
  setGain() {
    if (this.gainNode) this.gainNode.gain.setValueAtTime(this.gain, 0);
  }

  @Watch("locator")
  setLoopLocation() {
    if (this.bufferSourceNode) {
      this.bufferSourceNode.loopStart = this.playbackStart;
      this.bufferSourceNode.loopEnd = this.playbackEnd;
      this.bufferSourceNode.loop = this.loop;
    }

  }
}
</script>
<style lang="">
</style>
