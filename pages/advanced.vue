<template>
  <div class="container" align="center">
    <h1 id="maintitle">
      高度オセロ
    </h1>
    <h2 class="menu">
      盤面の重み設定
    </h2>
    <Accordion>
      <input type="checkbox" id="sym" @input="symmetry=!symmetry" :value="symmetry" checked>
      <label for="sym">対称</label>
      <div v-for="(row, y) in W">
        <div v-for="(col, x) in row" style="display:inline">
          <input class="box" type="number" @input="w_change($event, x, y)" :value="col">
        </div>
      </div>
    </Accordion>
    <h2 class="menu">
      先読みする手数
    </h2>
    <Accordion>
      <p>
        <span id="te">{{ difficulty }}手</span>
      </p>
      <input type="range" class="input-range" :value="difficulty" min="0" max="4" step="1" @input="difficulty = $event.target.valueAsNumber">
      <p v-if="difficulty == 0">完全乱択</p><p v-if="difficulty != 0">Minmax法</p>
    </Accordion>
    <h2 class="menu">
      状況依存の重み設定
    </h2>
    <Accordion>
      <p style="margin: .5em">
        コマ数の差による重み = <input class="weight1" type="number" v-model="f_11"> × (<input class="weight1" type="number" v-model="f_12"> × 自分のコマ数 - <input class="weight1" type="number" v-model="f_13"> × 相手のコマ数)
      </p>
      <p>
        手数の差による重み = <input class="weight1" type="number" v-model="f_21"> × (<input class="weight1" type="number" v-model="f_22"> × 自分の手数 - <input class="weight1" type="number" v-model="f_23"> × 相手の手数)
      </p>
    </Accordion>
    <h2 class="menu">
      総合調整
    </h2>
    <Accordion>
      <p style="margin: .5em">
        自駒の重み = <input class="weight1" type="number" v-model="w_1">
      </p>
      <p style="margin: .5em">
        敵駒の重み = <input class="weight1" type="number" v-model="w_2">
      </p>
      <p style="margin: .1em">
        全体の重みは以下の3つの重みの和に相当する．
      </p>
      <p style="margin: .1em">
        1. 盤面の重みと打駒した盤面をアダマール積した行列の要素の和
      </p>
      <p style="margin: .1em">
        2. コマ数の差による重み
      </p>
      <p style="margin: .1em">
        3. 手数の差による重み
      </p>
      <p style="margin: .5em">
        この重みを
      </p>
      <div class="radio" align="center">
        <input type="radio" name="radio02" class="radio-input" id="radio-02" value="maji" v-model="picked">
        <label for="radio-02">最大化(本気出させるように)</label>
        <input type="radio" name="radio01" class="radio-input" id="radio-01" value="settai" v-model="picked">
        <label for="radio-01">最小化(接待させるように)</label>
      </div>
      <p style="margin: .5em">
        する！
      </p>
    </Accordion>
    <a @click="play" class="btn-flat-border">ゲーム開始！</a>
    <p style="margin: .2em">OR...</p>
    <a @click="$router.push('/')" class="btn-flat-border">詳細設定モードから抜け出す</a>
    <p style="margin: 2em;">Version 2.0</p>
    <p style="margin: 0em;">&copy; KCS 2019</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Accordion from "@/components/Accordion.vue";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    Accordion
  }
})
export default class Adv extends Vue {
  picked: string = "settai";
  difficulty: number = 2;
  symmetry = true;
  f_11: number = 1;
  f_12: number = 1;
  f_13: number = 1;
  f_21: number = 1;
  f_22: number = 1;
  f_23: number = 1;
  w_1: number = 1;
  w_2: number = 1;
  W: number[][] = [
    [70, -12, 0, -1, -1, 0, -12, 70],
    [-12, -15, -3, -3, -3, -3, -15, -12],
    [0, -3, 0, -1, -1, 0, -3, 0],
    [-1, -3, -1, -1, -1, -1, -3, -1],
    [-1, -3, -1, -1, -1, -1, -3, -1],
    [0, -3, 0, -1, -1, 0, -3, 0],
    [-12, -15, -3, -3, -3, -3, -15, -12],
    [70, -12, 0, -1, -1, 0, -12, 70]
  ];
  play() {
    this.$store.commit("setAdvGameConf", {
      mode: this.picked,
      difficulty: this.difficulty,
      W: this.W,
      w: [
        this.f_11,
        this.f_12,
        this.f_13,
        this.f_21,
        this.f_22,
        this.f_23,
        this.w_1,
        this.w_2
      ]
    });
    this.$router.push("/main");
  }

  w_change(e: Event, x: number, y: number) {
    const target = e.target! as HTMLTextAreaElement;
    const v = parseInt(target.value);
    let W: number[][] = cloneDeep(this.W);
    W[y][x] = v;
    if (this.symmetry) {
      const x2: number = 7 - x;
      const y2: number = 7 - y;
      W[y2][x] = v;
      W[y][x2] = v;
      W[y2][x2] = v;
    }
    this.W = W;
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

#te {
  font-size: 2em;
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
  margin: 20px;
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

.box {
  width: 55px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  background-color: darkgreen;
  color: #fff;
}

.weight1 {
  width: 35px;
  height: 35px;
  font-size: 18px;
  text-align: center;
}

.input-range[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: rgb(0, 0, 0);
  height: 5px;
  width: 300px;
  border-radius: 6px;
}

.input-range[type="range"]:focus,
.input-range[type="range"]:active {
  outline: none;
}

.input-range[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.7);
  width: 22px;
  height: 22px;
  display: block;
  background-color: #fff;
  border-radius: 50%;
  -webkit-border-radius: 50%;
}

.input-range[type="range"]:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.6);
  transition: 0.4s;
}
</style>
