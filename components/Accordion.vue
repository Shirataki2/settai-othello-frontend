<template>
  <div class="accordion">
    <p class="header" v-on:click="toggle">
      <span class="header-icon" :class="{ rotate: show }">▶︎</span>
      {{ title }}
    </p>
    <transition name="accordion"
      v-on:before-enter="beforeEnter" v-on:enter="enter"
      v-on:before-leave="beforeLeave" v-on:leave="leave">
      <div class="body" v-show="show">
        <div class="body-inner">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Accordion extends Vue {
  @Prop({ type: String, default: "展開" }) title!: string;

  show = false;

  toggle() {
    this.show = !this.show;
  }
  beforeEnter(el: HTMLElement) {
    el.style.height = "0";
  }
  enter(el: HTMLElement) {
    el.style.height = el.scrollHeight + "px";
  }
  beforeLeave(el: HTMLElement) {
    el.style.height = el.scrollHeight + "px";
  }
  leave(el: HTMLElement) {
    el.style.height = "0";
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Noto+Serif+JP:900&display=swap");

.accordion {
  margin: 0px;
}

.accordion .header {
  cursor: pointer;
}

.accordion .header-icon {
  display: inline-block;
  transform: rotate(0deg);
  transition-duration: 0.2s;
}

.accordion .body {
  margin: 0.3em;
  overflow: hidden;
  transition: 500ms ease-out;
}

.accordion .body-inner {
  overflow-wrap: break-word;
}

.accordion .header-icon.rotate {
  transform: rotate(90deg);
  transition-duration: 0.2s;
}
</style>