<template lang="">
   <v-container>
      <v-row>
         <v-col cols="12" md="6">
         <!-- 카테고리 선택창 -->
         <v-btn-toggle
            v-model="category"
            color="deep-purple-accent-3"
            variant="outlined"
            group
            class="mb-5"
         >
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
         </v-col>
         <v-col cols="12" md="6">
         <v-btn
            variant="flat"
            color="success"
            size="large"
            class="float-right"
            @click="addDialog = true"
         >
               추가
            </v-btn>
         </v-col>  
       </v-row>
    <v-divider />

    <!-- 품목 테이블 -->
    <v-table
      fixed-header
      max-height="600px"
    >
      <thead>
        <tr>
          <th class="text-center">
            품목
          </th>
          <th class="text-center">
            제조사
          </th>
          <th class="text-center">
            품명
          </th>
          <th class="text-center">
            단가
          </th>
          <th class="text-center">
            메모
          </th>
        </tr>
      </thead>
      <tbody>

         <v-scroll-y-transition group="true">
            <!-- @mouseover="() => {this.product = item}" -->
         <tr
            v-for="item in filterList"
            :key="item"
            class="text-center hover-event"
            @click="edit(item)"
         >
         
            <td>{{ item.category }}</td>
            <td>{{ item.mfr }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.price.toLocaleString('ko-KR') }} 원</td>
            <td>{{ item.note }}</td>
         </tr>
         </v-scroll-y-transition>
     
      </tbody>
      </v-table>

   </v-container> 


   <!-- 품목 정보 추가 -->
   <v-dialog
      v-model="addDialog"
      persistent
      max-width="600px"
   >
      <v-card>
         테스트
         <v-btn @click="addDialog=false">닫기</v-btn>
      </v-card>  
   </v-dialog>

   <!-- 품목 정보 수정 -->
   <v-dialog
      v-model="editProduct"
      persistent
      max-width="600px"
   >
      <v-card>
         {{this.product.name}}
         <v-btn @click="editProduct=false">닫기</v-btn>
      </v-card>  
   </v-dialog>
</template>

<script>
import axios from "axios";
import { ip } from '../router/ip';

export default {
   data() {
      return {
         addDialog: false,
         editProduct: false,
         category: '토너',
         product: '',
         productDBList: [],
         filterList: [],
      }
   },

   methods: {
      getProductData() {
         axios.get(ip + `/product`).then((res) => {

            this.productDBList = [...res.data];
            // id / category / mfr / name / price / note

            this.changeList();
         })
      },

      changeList() {
         var list = [];

         //현재 선택 중인 카테고리 목록만 분류
         for (var index in this.productDBList) {
            //console.log(this.category + ' / ' + this.productList[index].category)

            if (this.category == this.productDBList[index].category) {
               //console.log('match!')
               list.push(this.productDBList[index])
            }
         }
         //console.log(list)

         this.filterList = [...list]
      },

      edit(object) {
         this.product = object;
         this.editProduct = true;

         //alert(object.name)
      }
   },

   watch: {
      category() {
         this.changeList()
      }
   },

   mounted() {
      this.getProductData()
   }

}
</script>
<style >
.hover-event:hover {
   color: white;
   background-color: #50C8FF;
   cursor: pointer;
}
</style>