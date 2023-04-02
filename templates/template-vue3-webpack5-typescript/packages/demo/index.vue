<template>
  <div class="demo-container">
    <p>demo Page</p>
    <p>name</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const name = ref<string>('name');
    return {
      name
    };
  }
});
</script>

<style lang="less">
.demo-container {
  font-size: 30px;
  color: #f0f;
  user-select: none;
}
</style>
