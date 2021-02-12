<template lang="pug">
div.h-screen
  div(v-if="!loaded")
    p Loading...
  div(v-else)
    div.container
      h1.pt-10.pb-4.pl-4 Aint No Scrub
      div
        Visualiser(
          :audioContext="audioContext",
          :audioBuffer="rawBuffer",
          :playing="playing"
          :loaded="loaded"
        )
      div.p-4.text-center
        h2.pb-2.mt-4 Mixer
        div
          button(@click="onTrackAdd") Add Audio Track
          AudioTrack(
            v-for="trackIndex in trackCount"
            :key="trackIndex"
            :color="colorMap[trackIndex%5]"
            :trackNumber="trackIndex"
            :audioContext="audioContext",
            :audioBuffer="rawBuffer",
            :playing="playing"
          )
    div.m-0.w-screen.fixed.bottom-0.z-100.object-bottom
      Transport(
        :audioContext="audioContext",
        :audioBuffer="rawBuffer",
        :playing="playing"
        :loaded="loaded"
        @onPlay="onPlay"
      )
</template>


<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { spectrogram } from "spectrogram";
import { CanvasHTMLAttributes } from "vue";
import AudioTrack from "./AudioTrack.vue";
import Visualiser from "./Visualiser.vue";
import Transport from "./Transport.vue";
import { Watch } from "vue-property-decorator";

@Options({
  props: {},
  components: {
    AudioTrack,
    Visualiser,
    Transport
  },
})
export default class Main extends Vue {
  audioContext = new AudioContext();
  trackCount = 1;
  rawBuffer!: AudioBuffer;

  url =
    "https://f002.backblazeb2.com/file/mino-altherr-public/blog/audio/sailure-to-sun.mp3";
  playing = false;
  loaded = false;

  colorMap2 = [
    "#D4CDFF",
    "#CEE3FF",
    "#C9FFD9",
    "#FFFECB",
    "#FFCED0",
    "#FFBAE4",
  ]

  colorMap = [
    "#F400FF",
    "#6F00EF",
    "#007FFF",
    "#77FB00",
    "#FEFF00",
    "#FAAB00",
  ]


  mounted() {
    const request = new XMLHttpRequest();
    request.open("GET", this.url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      this.audioContext.decodeAudioData(
        request.response,
        (buffer) => {
          this.rawBuffer = buffer;
          this.loaded = true;
          console.log(this.rawBuffer);
        },
        null
      );
    };
    request.send();

  }

  onPlay() {
    console.log("hey")
    this.playing = this.playing ? false : true;
  }

  onTrackAdd() {
    this.trackCount += 1
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding-bottom: 150px;
}
</style>