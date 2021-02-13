<template lang="pug">
div.relative.bg-gray-300.font-sans
  Main()
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Main from "./components/Main.vue";

@Options({
  components: {
    Main
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');
#app {
/*   h1,h2 {
    font-family: 'Fredoka One', Helvetica, Arial, sans-serif;
  }
  font-family:  Lato, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
}
</style>
