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
          <v-btn value="임대수입" class="font-weight-black">
            임대 수입
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
            :disabled="btn_disabled"
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
      <v-col cols="12" md="6">
        <v-table v-if="this.select=='임대수입'">
          <thead>
            <th> </th>
            <th>수익</th>
            <th>지출</th>
            <th>이익</th>
          </thead>
          <tbody>
            <tr
              v-for="item in clientData"
              :key="item"
              class="text-center"
            >
              <th class="text-center">{{item.mm}}월</th>
              <td v-if="item.rental==null" class="text-center">0</td>
              <td v-else class="text-center">{{item.rental.toLocaleString('ko-KR')}}</td>
              <td v-if="item.total==null" class="text-center">0</td>
              <td v-else class="text-center">{{item.total.toLocaleString('ko-KR')}}</td>
              <td class="text-center">{{(item.rental*1 - item.total*1).toLocaleString('ko-KR')}}</td>
            </tr>
            <tr>
              <td class="text-center">
                합계
              </td>
              <td class="text-center">{{this.rentTotal.toLocaleString('ko-KR')}}</td>
              <td class="text-center">{{this.outTotal.toLocaleString('ko-KR')}}</td>
              <td class="text-center">{{(this.rentTotal*1 - this.outTotal).toLocaleString('ko-KR')}}</td>
            </tr>
            <tr>
              <td class="text-center" colspan="2">
                월 평균 지출비용
              </td>
              <td class="text-center">{{Math.ceil(this.outAverage).toLocaleString('ko-KR')}}</td>
              <td class="text-center"></td>
            </tr>
          </tbody>
        </v-table>

        <v-table v-if="this.select=='매입'">
          <thead>
            <th> </th>
            <th class="text-center">매입</th>
          </thead>
          <tbody>
            <tr
              v-for="item in clientData"
              :key="item"
              class="text-center"
            >
              <th class="text-center">{{item.mm}}월</th>
              <td v-if="item.total==null" class="text-center">0</td>
              <td v-else class="text-center">{{item.total.toLocaleString('ko-KR')}}</td>
            </tr>
            <tr>
              <td class="text-center">합계</td>
              <td class="text-center">{{this.purchaseTotal.toLocaleString('ko-KR')}}</td>
            </tr>
            <tr>
              <td class="text-center">월 평균</td>
              <td class="text-center">{{Math.ceil(this.purchaseAverage).toLocaleString('ko-KR')}}</td>
            </tr>
          </tbody>
        </v-table>

        <v-table v-if="this.select=='판매'">
          <thead>
            <th> </th>
            <th class="text-center">판매</th>
          </thead>
          <tbody>
            <tr
              v-for="item in clientData"
              :key="item"
              class="text-center"
            >
              <th class="text-center">{{item.mm}}월</th>
              <td v-if="item.total==null" class="text-center">0</td>
              <td v-else class="text-center">{{item.total.toLocaleString('ko-KR')}}</td>
            </tr>
            <tr>
              <td class="text-center">합계</td>
              <td class="text-center">{{this.purchaseTotal.toLocaleString('ko-KR')}}</td>
            </tr>
            <tr>
              <td class="text-center">월 평균</td>
              <td class="text-center">{{Math.ceil(this.purchaseAverage).toLocaleString('ko-KR')}}</td>
            </tr>
          </tbody>
        </v-table>
    
      </v-col>

      <!-- 차트 부분 -->
      <v-col cols="12" md="6">
        <Bar :data="data" :options="options" />
      </v-col>
    </v-row>

  </v-container>



</template>

<script >
import axios from 'axios'
import { ip } from '../router/ip';

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
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',],
        datasets: [],
        // [{
        //   data: [40, 20, 12, 40, 20, 12, 40, 20, 12, 40, 20, 12,],
        //   backgroundColor: '#0000FF',
        //   label: this.chart_title
        // }]

      },

      options: {
        responsive: true
      },


      //업데이트 중 사용 불가
      isUpdating: false,
      timeout: null,

      //다음 년도 버튼 비활성화
      btn_disabled: true,

      year: new Date().getFullYear(),

      select: '임대수입',
      type: '출고',

      //id, name
      client: { id: '0', name: '통합' },
      clientList: [
        { id: '0', name: '통합' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
      ],
      //수익 : id, name, 지출{월별...}, 임대료 수익
      clientData: [],

      //임대 수익 합계
      rentTotal: 0,
      //지출 합계
      outTotal: 0,
      //월 평균 지출
      outAverage: 0,

      purchaseTotal: 0,
      purchaseAverage: 0,
    }
  },

  methods: {
    //거래처 list 가져오기
    getClientList() {
      if (this.select == '매입') {
        axios.get(ip + `/dashboard/clientList?data=${encodeURIComponent('매입')}`).then((res) => {
          this.clientList = [...res.data.clientList]
        }).finally(() => {
          this.clientList.push({ id: '0', name: '통합' })
        })
      } else {
        axios.get(ip + `/dashboard/clientList?data=${encodeURIComponent('고객')}`).then((res) => {
          this.clientList = [...res.data.clientList]
        }).finally(() => {
          this.clientList.push({ id: '0', name: '통합' })
        })
      }
    },

    //임대 수입 데이터 가져오기
    getBenefitData() {
      axios.get(ip + `/dashboard`, { params: { client: this.client.name, year: this.year, type: this.type } }).then((res) => {
        //console.log(res.data);
        let data = res.data
        let list = []

        let rent = 0;
        let out = 0;

        let valid = 0;

        for (let i = 0; i < 12; i++) {
          if (data[i]) {
            if (data[i].rental) {
              list.push(data[i].rental * 1 - data[i].total * 1);
              rent += data[i].rental * 1;
              out += data[i].total * 1;
            } else {
              list.push(0)
            }
            valid++;
          } else {
            list.push(0)
          }
        }

        this.outAverage = out / valid;
        this.rentTotal = rent;
        this.outTotal = out;

        this.data = {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',],
          datasets: [{
            label: this.client.name + ' ' + this.select,
            data: list,
            backgroundColor: '#0000FF'
          }]
        }

        this.clientData = [...data]

      }).finally(() => {

      })
    },

    //매입 데이터 가져오기
    getPurchaseData() {
      axios.get(ip + `/dashboard/purchaseData`, { params: { client: this.client.name, year: this.year, type: this.type } }).then((res) => {
        let data = res.data
        let list = []

        let total = 0;

        let valid = 0;

        for (let i = 0; i < 12; i++) {
          if (data[i]) {
            if (data[i].total) {
              list.push(data[i].total);
              total += data[i].total * 1;
            } else {
              list.push(0)
            }
            valid++;
          } else {
            list.push(0)
          }
        }

        this.purchaseTotal = total;
        if (total == 0) {
          this.purchaseAverage = 0;
        } else {
          this.purchaseAverage = total / valid;
        }


        this.data = {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',],
          datasets: [{
            label: this.client.name + ' ' + this.select,
            data: list,
            backgroundColor: '#0000FF'
          }]
        }

        this.clientData = [...data]
      }).finally(() => {

      })
    }

  },

  watch: {
    isUpdating(val) {
      clearTimeout(this.timeout)

      if (val) {
        this.timeout = setTimeout(() => (this.isUpdating = false), 1000)
      }
    },

    //년도가 올해일때 내년 선택 못하게 그리고 통계 데이터 가져오기
    year() {
      if (this.year == new Date().getFullYear()) this.btn_disabled = true
      else this.btn_disabled = false

      //임대 수익 합계
      this.rentTotal = 0
      //지출 합계
      this.outTotal = 0
      //월 평균 지출
      this.outAverage = 0

      this.purchaseTotal = 0
      this.purchaseAverage = 0


      if (this.select == '임대수입') {
        this.getBenefitData()
      } else if (this.select == '매입') {
        this.getPurchaseData()
      }
      else if (this.select == '판매') {
        this.getPurchaseData()
      }
    },

    //거래처 변경할때마다 통계 데이터 가져오기
    client() {
      this.isUpdating = true;
      if (this.select == '임대수입') {
        this.getBenefitData()
      } else if (this.select == '매입') {
        this.getPurchaseData()
      }
      else if (this.select == '판매') {
        this.getPurchaseData()
      }
      //this.getData()
    },

    //항목 변경 때마다 거래처 목록 변경
    select() {
      this.getClientList()
      if (this.select == '임대수입') {
        this.type = '출고'
        this.client = { id: 0, name: '통합' }
      } else if (this.select == '매입') {
        this.type = '매입'
        this.client = { id: 0, name: '통합' }
      } else if (this.select == '판매') {
        this.type = '판매'
        this.client = { id: 0, name: '통합' }
      }
    }
  },

  mounted() {
    this.getClientList()
    this.getBenefitData()
  }
}
</script>
<style lang="">
    
</style>