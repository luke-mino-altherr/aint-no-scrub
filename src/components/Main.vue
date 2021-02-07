<template lang="pug">
div
  h1.pb-4 Aint No Scrub
  div.border
    Visualiser(
      :audioContext="audioContext",
      :audioBuffer="rawBuffer",
      :playing="playing"
      :loaded="loaded"
    )
  div.border.m-2
    h2.pb-2.mt-4 Global Transport
    div
      p.text-sm File Duration: {{ duration }}
      p.text-sm Sample Length: {{ sampleDuration }}
      p.text-sm Sample Rate: {{ sampleRate }}
      button.border.rounded.p-1(:disabled="!loaded", @click="onPlay") {{ buttonText }}
  div.border.m-2
    h2.pb-2.mt-4 Mixer
    div
      button(@click="onTrackAdd") Add Audio Track
      AudioTrack(
        v-for="trackIndex in trackCount"
        :key="trackIndex"
        :trackNumber="trackIndex"
        :audioContext="audioContext",
        :audioBuffer="rawBuffer",
        :playing="playing"
      )
</template>


<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { spectrogram } from "spectrogram";
import { CanvasHTMLAttributes } from "vue";
import AudioTrack from "./AudioTrack.vue";
import Visualiser from "./Visualiser.vue"
import { Watch } from "vue-property-decorator";

@Options({
  props: {},
  components: {
    AudioTrack,
    Visualiser,
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

  get buttonText() {
    return this.playing ? "Pause" : "Play";
  }

  get duration() {
    return this.loaded ? this.rawBuffer.duration : 0;
  }

  get sampleDuration() {
    return this.loaded ? this.rawBuffer.length : 0;
  }

  get sampleRate() {
    return this.loaded ? this.rawBuffer.sampleRate : 0;
  }

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
    this.playing = this.playing ? false : true;
  }

  onTrackAdd() {
    this.trackCount += 1
  }
}
</script>
