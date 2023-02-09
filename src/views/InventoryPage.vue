<template lang="">

     <!-- 카테고리 선택창 -->
    <v-radio-group
      v-model="category"
      inline
    >
     <v-radio
        label="전체"
        value="전체"
        color="primary"
      ></v-radio>
      <v-radio
        label="토너"
        value="토너"
        color="primary"
      ></v-radio>
      <v-radio
        label="부품"
        value="부품"
        color="primary"
      ></v-radio>
      <v-radio
        label="프린터"
        value="프린터"
        color="primary"
      ></v-radio>
      <v-radio
        label="복합기"
        value="복합기"
        color="primary"
      ></v-radio>
    </v-radio-group>

    <!-- 재고 목록 테이블 -->
     <v-table
    fixed-header
    height="500px"
  >
    <thead>
      <tr>
        <th class="text-left">
          품목
        </th>
        <th class="text-left">
          물품
        </th>
        <th class="text-left">
          단가
        </th>
        <th class="text-left">
          개수
        </th>

      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in filterList"
        :key="item"
      >
        <td>{{ item.category }}</td>
        <td>{{ item.product }}</td>
        <td>{{ item.price.toLocaleString('ko-KR') }}</td>
        <td>{{ item.count }}</td>

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