<template lang="pug">
div
  h1 Aint No Scrub
  canvas.w-screen.h-auto(ref="visualizer")
  button.border.rounded.p-1(:disabled="!loaded", @click="onPlay") {{ buttonText }}
  AudioTrack(
    :audioContext="audioContext",
    :audioBuffer="rawBuffer",
    :playing="playing"
  )
  AudioTrack(
    :audioContext="audioContext",
    :audioBuffer="rawBuffer",
    :playing="playing"
  )
  AudioTrack(
    :audioContext="audioContext",
    :audioBuffer="rawBuffer",
    :playing="playing"
  )
  AudioTrack(
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
import { Watch } from "vue-property-decorator";

@Options({
  props: {},
  components: {
    AudioTrack,
  },
})
export default class Visulizer extends Vue {
  audioContext = new AudioContext();
  audioTracks = [new Audio(), new Audio()];
  currentTimes = [0, 0];
  analyzer = this.audioContext.createAnalyser();

  invisibleNode!: AudioBufferSourceNode;
  rawBuffer!: AudioBuffer;

  url =
    "https://f002.backblazeb2.com/file/mino-altherr-public/blog/audio/sailure-to-sun.mp3";
  playing = false;
  loaded = false;

  get buttonText() {
    return this.playing ? "Pause" : "Play";
  }

  get canvas() {
    return this.$refs.visualizer as HTMLCanvasElement;
  }

  get canvasCtx() {
    return this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  mounted() {
    const request = new XMLHttpRequest();
    request.open("GET", this.url, true);
    request.responseType = "arraybuffer";
    let outputBuffer;

    this.canvas.width = window.innerWidth
    this.canvas.height = 200;

    request.onload = () => {
      this.audioContext.decodeAudioData(
        request.response,
        (buffer) => {
          this.rawBuffer = buffer;
          this.loaded = true;
        },
        null
      );
    };
    request.send();
  }

  onPlay() {
    this.playing = this.playing ? false : true;
    if (this.playing) {
      this.createInvisibleNode();
      this.draw();
    } else {
      this.invisibleNode.stop()
    }
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  createInvisibleNode() {
    this.invisibleNode = this.audioContext.createBufferSource();
    this.invisibleNode.buffer = this.rawBuffer;
    this.invisibleNode.connect(this.analyzer);
    this.invisibleNode.start(0);
  }

  draw() {
    this.analyzer.fftSize = 256;
    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    console.log(dataArray);
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const drawFrequency = () => {
      requestAnimationFrame(drawFrequency)
      this.analyzer.getFloatFrequencyData(dataArray);

      this.canvasCtx.fillStyle = "rgb(200, 200, 200)";
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasCtx.lineWidth = 2;
      this.canvasCtx.strokeStyle = "rgb(0,0,0)";
      this.canvasCtx.beginPath();
      const barWidth = (this.canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] + 140) * 2;
        this.canvasCtx.fillStyle =
          "rgb(" + Math.floor(barHeight + 100) + ", 50, 50)";
        this.canvasCtx.fillRect(
          x,
          this.canvas.height - barHeight / 2,
          barWidth,
          barHeight / 2
        );
        x += barWidth + 1;
      }
    };

    const drawTime = () => {
      requestAnimationFrame(drawTime);

      this.analyzer.getFloatTimeDomainData(dataArray);

      this.canvasCtx.fillStyle = "rgb(200, 200, 200)";
      this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasCtx.lineWidth = 2;
      this.canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      this.canvasCtx.beginPath();

      const sliceWidth = (this.canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] * 200.0;
        const y = this.canvas.height / 2 + v;

        if (i === 0) {
          this.canvasCtx.moveTo(x, y);
        } else {
          this.canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasCtx.stroke();
    };

    drawFrequency();
  }
}
</script>
