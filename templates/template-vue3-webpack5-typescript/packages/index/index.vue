<template>
  <div class="index-container">
    <p>Index Page</p>
    <p>{{ count }}</p>
    <img src="./resource/logo.png" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Index',
  setup() {
    const count = ref(10);
    return {
      count
    };
  }
});
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'HYYaKuHei';
  src: url('./resource/HYYaKuHei.ttf');
}

.index-container {
  display: flex;
  flex-direction: column;
  color: #f00;
  font-family: 'HYYaKuHei';
  font-size: 30px;
}
</style>
