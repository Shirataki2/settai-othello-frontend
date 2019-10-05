<template>
  <div class="container" align="center">
    <h1 id="maintitle">
      {{picked === 'settai' ? "接待" : "卍"}}オセロ
    </h1>
    <h2 class="menu">
      モード選択
    </h2>
    <div class="radio" align="center">
      <input type="radio" name="radio01" class="radio-input" id="radio-01" value="settai" v-model="picked">
      <label for="radio-01">接待モード</label>
      <input type="radio" name="radio02" class="radio-input" id="radio-02" value="maji" v-model="picked">
      <label for="radio-02">本気モード</label>
    </div>
    <h2 class="menu">
      難易度選択
    </h2>
    <div class="radio" align="center">
      <input type="radio" name="radio11" class="radio-input" id="radio-11" value="4" v-model="difficulty">
      <label for="radio-11">{{picked === 'settai' ? "接待" : "本気"}}</label>
      <input type="radio" name="radio12" class="radio-input" id="radio-12" value="3" v-model="difficulty">
      <label for="radio-12">やや{{picked === 'settai' ? "接待" : "本気"}}</label>
      <input type="radio" name="radio13" class="radio-input" id="radio-13" value="1" v-model="difficulty">
      <label for="radio-13">きもーち{{picked === 'settai' ? "接待" : "本気"}}</label>
    </div>
    <a @click="play" class="btn-flat-border">ゲーム開始！</a>
    <p style="margin: 1em;">Version 1.0</p>
    <p style="margin: 5em;">&copy; KCS 2019</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Index extends Vue {
  picked: string = "settai";
  difficulty: string = "3";

  play() {
    this.$store.commit("setGameConf", {
      mode: this.picked,
      difficulty: this.difficulty
    });
    this.$router.push("/main");
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Noto+Serif+JP:900&display=swap");

#maintitle {
  font-size: 8em;
  text-align: center;
  margin: 0.4em 0;
  font-family: "Noto Serif JP", serif;
}

.menu {
  margin: 15px;
}

.container,
.radio {
  margin: 0 auto !important;
}

.radio-input {
  display: none;
}
.radio-input + label {
  padding-left: 20px;
  position: relative;
  margin-right: 20px;
}
.radio-input + label::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  border: 1px solid #999;
  border-radius: 50%;
}
.radio-input:checked + label {
  color: #d01137;
}
.radio-input:checked + label::after {
  content: "";
  display: block;
  position: absolute;
  top: 2px;
  left: 2px;
  width: 11px;
  height: 11px;
  background: #d01137;
  border-radius: 50%;
}

.btn-flat-border {
  margin: 60px;
  display: inline-block;
  padding: 0.3em 1em;
  text-decoration: none;
  color: #67c5ff;
  border: solid 2px #67c5ff;
  border-radius: 3px;
  transition: 0.4s;
}

.btn-flat-border:hover {
  background: #67c5ff;
  color: white;
}
</style>
