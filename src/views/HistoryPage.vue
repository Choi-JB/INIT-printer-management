<template lang="">
  <v-container>    
    <v-row>
      <v-radio-group
        v-model="range"
        inline
      >
        <v-radio
          label="1개월"
          value="1"
        ></v-radio>
        <v-radio
          label="3개월"
          value="3"
        ></v-radio>
        <v-radio
          label="6개월"
          value="6"
        ></v-radio>
        <v-radio
          label="12개월"
          value="12"
        ></v-radio>
      </v-radio-group>
    </v-row>

    <!-- 구분type / 거래처명client / 품목category -->
    <v-row>
      <v-col cols="12" md="3">
        <v-select
          clearable
          variant="solo"
          label="구분"
          v-model="type"
          :items="['출고','매입','판매','직접사용']"
        >
        </v-select>
      </v-col> 
      <v-col cols="12" md="3"> 
        <v-select
          clearable
          variant="solo"
          label="거래처"
          item-title="name"
          item-value="name"
          v-model="client"
          :items="clientList"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item?.raw?.name"
            ></v-list-item>
          </template>
        </v-select>

      </v-col> 
      <v-col cols="12" md="3"> 
        <v-select
          clearable
          variant="solo"
          label="품목"
          v-model="category"
          :items="['토너','부품','프린터','복합기']"
        >
        </v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-table
        fixed-header
        height="700px"
      >
        <thead>
          <tr>
            <th class="text-center">
              구분
            </th>
            <th class="text-center">
              날짜
            </th>
            <th class="text-center">
              거래처
            </th>
            <th class="text-center">
              품목
            </th>
            <th class="text-center">
              품명
            </th>
            <th class="text-center">
              단가
            </th>
            <th class="text-center">
              개수
            </th>
            <th class="text-center">
              총액
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in history"
            :key="item"
            class="text-center"
          >
            <td>{{ item.type }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.client }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.product }}</td>
            <td class="text-center">{{ item.price.toLocaleString('ko-KR') }}</td>
            <td class="text-center">{{ item.count }}</td>
            <td class="text-center">{{ item.total.toLocaleString('ko-KR') }}</td>
          </tr>
        </tbody>
      </v-table>
      
    </v-row>
  </v-container> 
</template>
<script>
import axios from "axios";
import { ip } from '../router/ip';

export default {
  data() {
    return {
      history: [],
      filterList: [],

      range: '1',

      type: '',
      client: '',
      clientList: [],
      category: '',
    }
  },
  methods: {
    //기록 가져오기
    getHistory() {
      axios.get(ip + "/history", { params: { range: this.range, type: this.type, client: this.client, category: this.category } }).then((res) => {
        //console.log(res.data)
        this.history = res.data;

      })

    },

    //거래처 목록
    getClientList() {
      axios.get(ip + "/history/client").then((res) => {
        //console.log(res.data)
        this.clientList = res.data;

      })
    },

    //검색조건에 맞게 분류
    changeList() {
      //var list = [];

      // this.history.forEach((e) => {
      //   if (this.type) {
      //     if (this.client) {
      //       if (this.category) {

      //       } else {

      //       }
      //     } else {

      //     }
      //   } else {
      //     if (this.client) {
      //       if (this.category) {

      //       }
      //     } else {
      //       if (this.category) {

      //       } else {

      //       }
      //     }
      //   }

      //})
    }
  },

  watch: {
    range() {
      this.getHistory()
    },


    type() {
      if (!this.type) this.type = ''
      this.getHistory()
    },
    client() {
      if (!this.client) this.client = ''
      this.getHistory()
    },
    category() {
      if (!this.category) this.category = ''
      this.getHistory()
    }
  },

  mounted() {  //페이지 로드 시 최초 1번 실행
    this.getHistory()
    this.getClientList()
  }
}
</script>
<style lang="">
    
  
</style>