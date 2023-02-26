<template lang="">
  <v-container>
   
        <!-- 카테고리 선택창 -->
        <v-btn-toggle
        v-model="category"
        color="deep-purple-accent-3"
        variant="outlined"
        group
        class=""
        >
          <v-btn value="전체" class="font-weight-black">
            전체
          </v-btn>
          <v-btn value="토너" class="font-weight-black">
            토너
          </v-btn>
          <v-btn value="부품" class="font-weight-black">
            부품
          </v-btn>
          <v-btn value="프린터" class="font-weight-black">
            프린터
          </v-btn>
          <v-btn value="복합기" class="font-weight-black">
            복합기
          </v-btn>
        </v-btn-toggle>
      

    <!-- 재고 목록 테이블 -->
    <v-card variant="outlined" color="blue" max-width="800px">
     <v-table
      fixed-header
      height="600px"
    >
      <thead>
        <tr>
          <th class="text-center">
            품목
          </th>
          <th class="text-center">
            물품
          </th>
          <th class="text-center">
            단가
          </th>
          <th class="text-center">
            개수
          </th>

        </tr>
      </thead>
      <tbody>
        <v-scroll-y-transition group="true">
        <tr
          v-for="item in filterList"
          :key="item"
          class="text-center"
        >
          <td>{{ item.category }}</td>
          <td>{{ item.product }}</td>
          <td>{{ item.price.toLocaleString('ko-KR') }}</td>
          <td>{{ item.count }}</td>

        </tr>
        </v-scroll-y-transition>
      </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
import { ip } from '../router/ip';

export default {
  data() {
    return {
      category: null,
      inventory: [],
      filterList: [],
    }
  },
  methods: {
    //사무실 재고 목록 불러오기
    getInventory() {
      axios.get(ip + "/inventory").then((res) => {
        console.log(res.data)
        this.inventory = res.data;
        this.category = '전체'
      })
    },
    //카테고리별로 제품 목록 분류
    changeProductList() {
      if (this.category != '전체') {
        var list = [];

        //현재 선택 중인 카테고리 목록만 분류
        for (var index in this.inventory) {
          if (this.category == this.inventory[index].category) {
            list.push(this.inventory[index])
          }
        }
        this.filterList = [...list]
      } else {
        this.filterList = [...this.inventory]
      }

    },
  },
  //최초 한번만 실행
  mounted() {
    this.getInventory()
  },

  watch: {
    //카테고리가 변하면 실행
    category() {
      this.changeProductList()
    },
  }
}
</script>
<style lang="">
    
</style>