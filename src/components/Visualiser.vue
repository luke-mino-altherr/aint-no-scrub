<template lang="pug">
div
  canvas.w-screen(ref="visualiser")
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Watch } from "vue-property-decorator";

@Options({
  props: {
    trackNumber: Number,
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
    playing: Boolean,
    loaded: Boolean
  }
})
export default class Visualiser extends Vue {
  audioContext!: AudioContext;
  audioBuffer!: AudioBuffer;
  playing!: boolean;
  loaded = false;

  numberSamples = 200;

  mounted() {
    if (this.loaded) this.drawWaveform();
  }

  get canvas() {
    return this.$refs.visualiser as HTMLCanvasElement;
  }

  get canvasCtx() {
    return this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  get filteredData() {
    const rawData = this.audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const samples = this.numberSamples; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  }

  get normalizedData() {
    const multiplier = Math.pow(Math.max(...this.filteredData), -1);
    return this.filteredData.map(n => n * multiplier);
  }

  @Watch("loaded")
  drawWaveform() {
    if (!this.loaded) return;
    const drawLineSegment = (
      ctx: CanvasRenderingContext2D,
      x: number,
      height: number,
      width: number,
      isEven: boolean
    ) => {
      ctx.lineWidth = 2; // how thick the line is
      ctx.strokeStyle = "#000"; // what color our line is
      ctx.beginPath();
      height = isEven ? height : -height;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
      ctx.lineTo(x + width, 0);
      ctx.stroke();
    };

    const drawGraph = () => {
      const dpr = window.devicePixelRatio || 1;
      const padding = 120;
      this.canvas.width = this.canvas.offsetWidth * dpr;
      this.canvas.height = (this.canvas.offsetHeight + padding * 2) * dpr;
      this.canvasCtx.scale(dpr, dpr);
      this.canvasCtx.translate(0, this.canvas.offsetHeight / 2);

      const width = this.canvas.offsetWidth / this.normalizedData.length;
      for (let i = 0; i < this.normalizedData.length; i++) {
        const x = width * i;
        let height =
          this.normalizedData[i] * this.canvas.offsetHeight - padding / 2;
        if (height < 0) {
          height *= -1;
        }
        if (height > this.canvas.offsetHeight / 2) {
          height = this.normalizedData.length - padding / 2;
        }
        drawLineSegment(this.canvasCtx, x, height, width, (i + 1) % 2 == 0);
      }
    };
    drawGraph();
  }
}
</script>
