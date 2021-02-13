<template lang="pug">
div.m-4.text-left.border.rounded.bg-gray-200
  div.p-2.text-align-left.align-middle.items-center.flex
    .p-1.flex.flex-0
      a(@click="collapsed = !collapsed")
        h2.inline(v-if="!collapsed") &#x25BE;
        h2.inline(v-else) &#x25B8;
    .p-1.flex.flex-0
      button.border.rounded-full.h-5.w-5.text-xs.inline.text-green-500.border-green-500(v-if="enabled" class="hover:text-green-600 hover:border-green-600" @click="enabled = !enabled")
        fa(icon="power-off" class="power-off")
      button.border.rounded-full.h-5.w-5.text-xs.inline.text-red-500.border-red-500(v-if="!enabled" class="hover:text-red-600 hover:border-red-600" @click="enabled = !enabled")
        fa(icon="power-off" class="power-off")
    h2.inline Track {{ trackNumber }}
    .pl-4
      button.h-6.w-6(@click="trigger")
        fa(icon="volume-up" class="volume-up" class="hover:text-gray-600")
  div(v-if="!collapsed")
    div.p-2
      label Playback Speed
      VueSlider(v-model="playbackSpeed", min=0, max=7, interval=0.001)
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
      VueSlider(v-model="locator", min=0, max=1, interval=0.0001)
      label Duration: {{ ( duration * 100 | round ) / 100 }}
      label ; Normalized Duration: {{ ( duration * 100 / playbackSpeed | round ) / 100 }}
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
    color: String,
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
  color!: string;

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

  get colorStyle() {
    return { 
      backgroundColor: this.color, 
      //opacity: "30%"
    }
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
<style lang="scss">
.vue-slider {
  z-index: 0;
}
</style>
