<template>
  <text :transform="position">
    <tspan class="st3 st5" x="0" y="0">{{ temp1 }}℃</tspan>
    <tspan class="st3 st5" x="0" y="15.86">{{ temp2 }}℃</tspan>
    <tspan class="st3 st5" x="0" y="31.71">{{ temp3 }}℃</tspan>
  </text>
</template>

<script>
export default {
  name: "textItem",
  props: {
    temp1: {
      type: Number,
      default: 0
    },
    temp2: {
      type: Number,
      default: 0
    },
    temp3: {
      type: Number,
      default: 0
    },
    position: {
      type: String
    }
  }
}
</script>

<style scoped>
.st3 {
  font-family: 'SimSun', serif;
}

.st5 {
  font-size: 13px;
}
</style>
