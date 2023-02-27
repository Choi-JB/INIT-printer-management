<template lang="">
    <!-- <Bar :data="data" :options="options" /> -->
  <v-container>
    <v-row>
      <!-- 항목 선택 -->
      <v-col cols="12" md="6">
        <v-btn-toggle
          v-model="select"
          color="deep-purple-accent-3"
          variant="outlined"
          group
          class="my-3"
        >
          <v-btn value="수입" class="font-weight-black">
            수입
          </v-btn>
          <v-btn value="매입" class="font-weight-black">
            매입
          </v-btn>
          <v-btn value="판매" class="font-weight-black">
            판매
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- 거래처 선택 -->
      <v-col cols="12" md="3">
        <v-select
          v-model="client"
          :loading="isUpdating"
          :items="clientList"
          item-title="name"
          item-value="id"
          label="거래처"
          variant="solo"
          return-object
          single-line
        ></v-select>
      </v-col>

      <!-- 년도 선택 -->
      <v-col  cols="12" md="3">
        <div class="d-flex justify-space-around align-center flex-column flex-sm-row fill-height">
        
          <v-btn
            size="x-small"
            :loading="isUpdating"
            icon
            color="info"
            @click="[this.year -= 1,this.isUpdating=true]"
          >
            <v-icon>mdi-menu-left</v-icon>
          </v-btn>

          <p class="text-h5"> {{this.year}}</p>

          <v-btn
            size="x-small"
            :loading="isUpdating"
            icon
            color="info"
            @click="[this.year += 1,this.isUpdating=true]"
          >
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 표 , 차트 부분 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-table>
          <thead>
            <th> </th>
            <th>수익</th>
            <th>지출</th>
            <th>이익</th>
          </thead>
          <tbody>
            <tr>
              <th class="text-center">1월</th>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
            </tr>
            <tr>
              <td class="text-center">
                합계
              </td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
            </tr>
            <tr>
              <td class="text-center" colspan="2">
                월 평균 지출비용
              </td>
              <td class="text-center">0</td>
              <td class="text-center"></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12" md="8">
        <Bar :data="data" :options="options" />
      </v-col>
    </v-row>

  </v-container>



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
        },

        isUpdating: false,
        timeout:null,
        
        year: new Date().getFullYear(),

        select:'수입',

        //id, name
        client:{id:'0', name:'통합'},
        clientList:[
          {id:'0', name:'통합'},
          {id:'1', name:'1'},
          {id:'2', name:'2'},
        ],
        //수익 : id, name, 지출{월별...}, 임대료 수익
        clientData:[],
        
        
      }
    },

    methods:{
      
    },

    watch:{
      isUpdating (val) {
        clearTimeout(this.timeout)

        if (val) {
          this.timeout = setTimeout(() => (this.isUpdating = false), 1000)
        }
      },

      client(){
        this.isUpdating = true;
      }
    }
}
</script>
<style lang="">
    
</style>