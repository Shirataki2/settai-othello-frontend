<template>
  <div align="center">
    <h4 style="padding: 15px">{{ modetxt }}モード</h4>
    <span id="you"><img src="/B.png">あなた<br/><span id="you-score">{{ N_Black }}</span></span>
    <span id="cpu"><img src="/W.png">CPUちゃん<br/><span id="cpu-score">{{ N_White }}</span></span>
    <template v-for="(row, x) in board">
      <template v-for="(col, y) in row">
        <span class="box" :id="`box-${y}${x}`" @click="push($event)">
          <img v-if="col !== '.'" :src="`/${col}.png`" alt="">
        </span>
      </template>
      <br/>
    </template>
    <h4 style="padding: 15px">{{ help }}</h4>
    <template v-if="endflag">
      <div id="back"></div>
      <span id="result" :style="color">{{result}}</span>
      <div id="top">
        <a @click="back" class="btn-flat-border">トップ画面へ</a>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Game extends Vue {
  mode: string = "";
  help: string = "Play";
  difficulty: string = "";
  modetxt: string = "";
  board: string[][] = [];
  putable: string[] = [];
  endflag: boolean = false;

  get N_Black() {
    let ctr = 0;
    this.board.flat().forEach(elem => {
      elem === "B" && ctr++;
    });
    return ctr;
  }

  get N_White() {
    let ctr = 0;
    this.board.flat().forEach(elem => {
      elem === "W" && ctr++;
    });
    return ctr;
  }

  get result() {
    if (this.N_Black > this.N_White) return "You Win!";
    if (this.N_Black < this.N_White) return "You Lose...";
    return "Draw";
  }

  get color() {
    if (this.N_Black > this.N_White) return "color: red;";
    if (this.N_Black < this.N_White) return "color: blue;";
    return "color: green;";
  }

  get adv() {
    if (this.$store.state.adv)
      return { adv: true, W: this.$store.state.W, w: this.$store.state.w };
    else return { adv: false };
  }

  back() {
    this.$router.push("/");
  }

  async push(e: any) {
    const tgt = e.target!;
    const putable = tgt.classList.contains("putable");
    const y = parseInt(tgt.id[4]);
    const x = parseInt(tgt.id[5]);
    if (!putable) return;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        document.getElementById(`box-${y}${x}`)!.classList.remove("putable");
        document.getElementById(`box-${y}${x}`)!.classList.remove("player");
        document.getElementById(`box-${y}${x}`)!.classList.remove("cpu");
      }
    }
    document.getElementById(`box-${y}${x}`)!.classList.add("player");
    this.help = "通信中...";
    const { data } = await this.$axios.post("/put", {
      board: this.encodeBoard(),
      x: x,
      y: y,
      mode: this.mode,
      difficulty: this.difficulty,
      ...this.adv
    });
    this.help = "CPU思考中...";
    const p: string[][] = data.player;
    const q: string[][] = data.com;
    const qpos: [number, number] | string = data.pos;
    this.board = p;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        document.getElementById(`box-${y}${x}`)!.classList.remove("putable");
        document.getElementById(`box-${y}${x}`)!.classList.remove("player");
        document.getElementById(`box-${y}${x}`)!.classList.remove("cpu");
      }
    }
    if (qpos === "pass") {
      this.help = "CPUは置ける駒がないようです．";
      const ev = await this.$axios.post("/eval", {
        board: this.encodeBoard(),
        mode: this.mode,
        difficulty: this.difficulty
      });
      if (ev.data.put.length === 0) {
        this.help = "CPUもプレイヤーも置ける駒がないようです．終局です";
        this.endflag = true;
      } else {
        (ev.data.put as number[][]).forEach(pos => {
          document
            .getElementById(`box-${pos[1]}${pos[0]}`)!
            .classList.add("putable");
        });
      }
      return;
    }
    const wait = (sec: number) => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, sec);
      });
    };
    document.getElementById(`box-${y}${x}`)!.classList.add("player");
    await wait(400);
    this.board = q;
    let ev = await this.$axios.post("/eval", {
      board: this.encodeBoard(),
      mode: this.mode,
      difficulty: this.difficulty
    });
    while (ev.data.put.length === 0) {
      this.help = "置ける場所がないようです...パスします";
      await wait(300);
      this.help += ".";
      await wait(300);
      this.help += ".";
      await wait(300);
      this.help += ".";
      const { data } = await this.$axios.post("/put", {
        board: this.encodeBoard(),
        x: -1,
        y: -1,
        mode: this.mode,
        difficulty: this.difficulty,
        ...this.adv
      });
      const q2: string[][] = data.com;
      const qpos2: [number, number] | string = data.pos;
      if (qpos2 !== "pass") {
        this.board = q2;
        document
          .getElementById(`box-${qpos2[1]}${qpos2[0]}`)!
          .classList.add("cpu");
        ev = await this.$axios.post("/eval", {
          board: this.encodeBoard(),
          mode: this.mode,
          difficulty: this.difficulty
        });
      } else {
        this.help = "CPUも置ける場所がないようです.終局です．";
        this.endflag = true;
        return;
      }
    }
    (ev.data.put as number[][]).forEach(pos => {
      document
        .getElementById(`box-${pos[1]}${pos[0]}`)!
        .classList.add("putable");
    });
    document.getElementById(`box-${qpos[1]}${qpos[0]}`)!.classList.add("cpu");
    if (typeof this.board.flat().find(elem => elem === ".") === "undefined") {
      this.help = "終局です!!";
      this.endflag = true;
    }
    this.help = "Play";
  }

  encodeBoard() {
    let bf = "";
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        bf += this.board[y][x];
      }
    }
    return bf;
  }

  decodeBoard(bf: string) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        this.board[y][x] = bf[8 * y + x];
      }
    }
  }

  async mounted() {
    this.mode = this.$store.state.mode;
    this.difficulty = this.$store.state.difficulty;
    if (!this.$store.state.adv) {
      if (this.difficulty === "4") this.modetxt = "";
      if (this.difficulty === "3") this.modetxt = "やや";
      if (this.difficulty === "1") this.modetxt = "きもーち";
      this.modetxt += this.mode === "settai" ? "接待" : "本気";
    } else {
      if (this.difficulty.toString() === "0") {
        this.modetxt += "乱択";
      } else {
        this.modetxt = "カスタマイズド";
        this.modetxt += this.mode === "settai" ? "接待" : "本気";
      }
    }
    const init = await this.$axios.get("");
    if (init.status !== 200) {
      this.$router.push("/error");
    }
    this.board = [
      [".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", "B", "W", ".", ".", "."],
      [".", ".", ".", "W", "B", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", "."]
    ];
    const { data } = await this.$axios.post("/eval", {
      board: this.encodeBoard(),
      mode: this.mode,
      difficulty: this.difficulty
    });
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        document.getElementById(`box-${y}${x}`)!.classList.remove("putable");
        document.getElementById(`box-${y}${x}`)!.classList.remove("player");
        document.getElementById(`box-${y}${x}`)!.classList.remove("cpu");
      }
    }
    (data.put as number[][]).forEach(pos => {
      document
        .getElementById(`box-${pos[1]}${pos[0]}`)!
        .classList.add("putable");
    });
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Noto+Serif+JP:900&display=swap");
#result {
  font-family: "Noto Serif JP", serif;
  font-size: 110px;
  position: fixed;
  width: 100%;
  left: 0px !important;
  top: 30%;
  z-index: 2000;
}
#you,
#cpu {
  position: fixed;
  top: 30%;
  left: 0;
  font-size: 27px;
  z-index: 9999;
}

#you {
  left: 10%;
}
#cpu {
  left: 80%;
}

#you img {
  width: 27px;
}

#cpu img {
  width: 27px;
}

#you-score,
#cpu-score {
  font-family: "Noto Serif JP", serif;
  font-size: 99px !important;
}

#you-score {
  color: red;
}

#cpu-score {
  color: blue;
}

.box img {
  width: 100%;
}

#back {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffffcc;
  position: fixed;
  z-index: 1000;
}
.box {
  width: 80px;
  height: 80px;
  display: inline-block;
  background-color: olivedrab;
  border: inset 2px;
  vertical-align: middle;
  text-align: center;
  line-height: 82px;
  font-size: 72px;
}

.putable {
  background-color: darkgreen;
  cursor: pointer;
}

.player {
  background-color: rgb(255, 32, 77);
}

.cpu {
  background-color: rgb(77, 32, 255);
}

.btn-flat-border {
  margin: 0px;
  display: inline-block;
  padding: 0.3em 1em;
  text-decoration: none;
  color: #003353;
  border: solid 2px #003353;
  border-radius: 3px;
  transition: 0.4s;
}

.btn-flat-border:hover {
  background: #040035;
  color: rgb(255, 255, 255);
}

#top {
  position: fixed;
  z-index: 99999;
  top: 50%;
  left: 45%;
}
</style>