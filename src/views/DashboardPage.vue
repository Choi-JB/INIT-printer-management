<template lang="">
    <Bar :data="data" :options="options" />
</template>

<script >
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'App',
  components: {
    Bar
  },
  data() {
    return {
      data: {
        labels: ['1월', '2월', '3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',],
        datasets: [{ data: [40, 20, 12,40, 20, 12,40, 20, 12,40, 20, 12,],
        backgroundColor:'#0000FF',
        label: 'Data test' }]
      },
      options: {
        responsive: true
      }
    }
  }
}
</script>
<style lang="">
    
</style>