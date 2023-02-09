<template lang="">
     <v-table
    fixed-header
    height="500px"
  >
    <thead>
      <tr>
        <th class="text-left">
          구분
        </th>
        <th class="text-left">
          날짜
        </th>
        <th class="text-left">
          거래처
        </th>
        <!-- <th class="text-left">
          품목
        </th> -->
        <th class="text-left">
          품명
        </th>
        <th class="text-left">
          단가
        </th>
        <th class="text-left">
          개수
        </th>
        <th class="text-left">
          총액
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in history"
        :key="item"
      >
        <td>{{ item.type }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.client }}</td>
        <!-- <td>{{ item.category }}</td> -->
        <td>{{ item.product }}</td>
        <td>{{ item.price.toLocaleString('ko-KR') }}</td>
        <td>{{ item.count }}</td>
        <td>{{ item.total.toLocaleString('ko-KR') }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import axios from "axios";
import { ip } from '../router/ip';

export default {
  data() {
    return {
      history: [],
    }
  },
  methods: {
    getHistory() {
      axios.get(ip + "/history").then((res) => {
        console.log(res.data)
        this.history = res.data;

      })


    }
  },

  mounted() {  //페이지 로드 시 최초 1번 실행
    this.getHistory()
  }
}
</script>
<style lang="">
    
  
</style>