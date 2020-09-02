<template>
  <div class="t-tab-pane" v-show="active">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TTabPane',
  props: ['name', 'label'],
  inject: ['rootTabs'],
  computed: {
    active () {
      return this.rootTabs.currentName === this.name
    }
  }
}
</script>

<style>

</style>
