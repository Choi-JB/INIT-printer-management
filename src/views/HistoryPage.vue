<template lang="">
      


     <v-table
      fixed-header
      height="600px"
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