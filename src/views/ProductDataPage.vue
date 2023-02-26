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
            @click="addDialog=true"
         >
               추가
            </v-btn>
         </v-col>  
       </v-row>
    <v-divider />

    <!-- 품목 테이블 -->
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
            @click="openEditDialog(item)"
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
      max-width="900px"
   >
      <v-card>
         <v-form ref="form">
         <v-row class="mx-5 mt-5">
            <v-col cols="12" md="6">
               <v-select
                  v-model="addCategory"
                  label="품목"
                  :rules="textRule"
                  :items="['토너', '부품', '프린터', '복합기']"
                  ></v-select>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="addMfr"
                  :rules="textRule"
                  :counter="10"
                  label="제조사"
                  required
               ></v-text-field>
            </v-col>
         </v-row>
         <v-row class="mx-5">  
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="addName"
                  :rules="textRule"
                  :counter="20"
                  label="제품명"
                  required
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="addPrice"
                  :rules="priceRule"
                  type="number"
                  :counter="10"
                  label="단가(원)"
                  required
               ></v-text-field>
            </v-col>
         </v-row> 
         <v-row class="mx-5">
            <v-col>
               <v-text-field
                  v-model="addNote"
                  :counter="20"
                  label="메모"
                  required
               ></v-text-field>
            </v-col>
         </v-row>
         <v-card-actions>
            <v-row class=" justify-space-between mx-7">
               <v-btn @click="add()" color="success" variant="flat" >추가</v-btn>
               <v-btn @click="addDialog=false" color="blue-grey-lighten-1" variant="flat">닫기</v-btn>
            </v-row>
         </v-card-actions>
         </v-form>
      </v-card>  
   </v-dialog>

   <!-- 품목 정보 수정 -->
   <v-dialog
      v-model="editDialog"
      persistent
      max-width="900px"
   >
      <v-card>
         <v-form ref="form">
         <v-row class="mx-5 mt-5">
            <v-col cols="12" md="6">
               <v-select
                  v-model="editCategory"
                  label="품목"
                  :rules="textRule"
                  :disabled="this.isDelete"
                  :items="['토너', '부품', '프린터', '복합기']"
                  ></v-select>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="editMfr"
                  :disabled="this.isDelete"
                  :rules="textRule"
                  :counter="10"
                  label="제조사"
                  required
               ></v-text-field>
            </v-col>
         </v-row>
         <v-row class="mx-5">  
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="editName"
                  :disabled="this.isDelete"
                  :rules="textRule"
                  :counter="20"
                  label="제품명"
                  required
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="editPrice"
                  :disabled="this.isDelete"
                  type="number"
                  :rules="priceRule"
                  :counter="10"
                  label="단가(원)"
                  required
               ></v-text-field>
            </v-col>
         </v-row> 
         <v-row class="mx-5">
            <v-col>
               <v-text-field
                  v-model="editNote"
                  :disabled="this.isDelete"
                  :counter="20"
                  label="메모"
                  
               ></v-text-field>
            </v-col>
         </v-row>
         <v-card-actions>
            <v-row class=" justify-space-between mx-7">
               <v-btn v-if="isDelete==false" @click="edit()" color="success" variant="flat" >수정</v-btn>
               <v-btn v-if="isDelete==true" @click="deleteDialog=true" color="error" variant="flat" >삭제</v-btn>
               <v-checkbox v-model="isDelete" label="해당 정보 삭제하기"></v-checkbox>
               <v-btn @click="[editDialog=false, isDelete=false]" color="blue-grey-lighten-1" variant="flat">닫기</v-btn>
            </v-row>
         </v-card-actions>
         </v-form>
      </v-card>  
   </v-dialog>

   <!-- 품목 삭제 확인 -->
   <v-dialog
      v-model="deleteDialog"
      max-width="450px"
   >
      <v-card>
         <v-banner
            text="정말 삭제하시겠습니까?"
            stacked
         >
         </v-banner>
         <v-card-actions>
            <v-row class="justify-space-between mx-5">
               <v-btn @click="deleteData()" color="error" variant="flat">예</v-btn>
               <v-btn @click="deleteDialog=false" color="success" variant="flat">아니오</v-btn>
            </v-row>   
         </v-card-actions>
      </v-card>  
   </v-dialog>
</template>

<script>
import axios from "axios";
import { ip } from '../router/ip';

export default {
   data() {
      return {
         valid: true,

         addDialog: false,
         editDialog: false,
         isDelete: false,
         deleteDialog: false,

         category: '토너',
         product: '',
         productDBList: [],
         filterList: [],

         editCategory: null,
         editMfr: 'kyocera',
         editName: null,
         editPrice: null,
         editNote: null,

         addCategory: null,
         addMfr: 'kyocera',
         addName: null,
         addPrice: null,
         addNote: null,

         textRule: [
            v => !!v || '필수 입력 값 입니다!',
            v => (v && v.length <= 20) || '20자를 초과할 수 없습니다',
         ],
         priceRule: [
            v => !!v || '필수 입력 값 입니다!',
            v => (v && v * 1 > 0) || '양수만 입력 가능!',
         ]
      }
   },

   methods: {
      //제품 DB 정보 가져오기
      getProductData() {
         //this.productDBList = []
         axios.get(ip + `/product`).then((res) => {

            //this.productDBList = [...res.data];
            //this.productDBList = JSON.parse(JSON.stringify(res.data))
            //console.log(res.data.productList)
            this.productDBList = [...res.data.productList]
            // id / category / mfr / name / price / note

            this.changeList();
            //console.log('get new list')
         }).finally(() => {
            this.changeList();
         })
      },

      //카테고리에 맞게 리스트 분류
      changeList() {
         var list = [];

         //현재 선택 중인 카테고리 목록만 분류
         for (var index in this.productDBList) {

            if (this.category == this.productDBList[index].category) {
               //console.log('match!')
               list.push(this.productDBList[index])
            }
         }
         //console.log('리스트 변경 완료')

         this.filterList = [...list]

      },

      //수정창 열기
      openEditDialog(object) {
         this.product = object;
         this.editDialog = true;

         //alert(object.name)
      },

      //추가
      async add() {

         const { valid } = await this.$refs.form.validate()

         if (valid) {
            this.addDialog = false;

            axios.post(ip + "/product/add",
               {
                  editData: {
                     category: this.addCategory,
                     mfr: this.addMfr,
                     name: this.addName,
                     price: this.addPrice,
                     note: this.addNote
                  }
               }).then((res) => {
                  console.log(res);
                  alert("success!")
               }).catch((err) => {
                  console.log(err);
                  alert(err);
               }).finally(() => {
                  //console.log("항상 마지막에 실행");
                  console.log('항목 추가')
                  this.resetEditData()
                  this.getProductData()
               })
         }

      },

      //수정
      async edit() {
         const { valid } = await this.$refs.form.validate()

         if (valid) {
            this.editDialog = false;

            this.product.category = this.editCategory
            this.product.mfr = this.editMfr
            this.product.name = this.editName
            this.product.price = this.editPrice
            this.product.note = this.editNote

            axios.post(ip + "/product/edit",
               {
                  editData: {
                     id: this.product.id,
                     category: this.editCategory,
                     mfr: this.editMfr,
                     name: this.editName,
                     price: this.editPrice,
                     note: this.editNote
                  }
               }).then((res) => {
                  console.log(res);
                  alert("success!")
               }).catch((err) => {
                  console.log(err);
                  alert(err);
               }).finally(() => {
                  //console.log("항상 마지막에 실행");
                  //this.filterList = []
                  console.log('항목 수정')
                  this.resetEditData()
                  this.getProductData()
               })
         }
      },

      //해당 항목 삭제
      deleteData() {
         this.deleteDialog = false;
         this.editDialog = false;

         axios.post(ip + "/product/delete",
            {
               editData: {
                  id: this.product.id,
               }
            }).then((res) => {
               console.log(res);
               alert("success!")
            }).catch((err) => {
               console.log(err);
               alert(err);
            }).finally(() => {
               //console.log("항상 마지막에 실행");
               console.log('항목 삭제')
               this.resetEditData()
               this.getProductData()
            })
      },

      resetEditData() {
         this.product = null

         this.editCategory = null
         this.editMfr = 'kyocera'
         this.editName = null
         this.editPrice = null
         this.editNote = null

         this.addCategory = null
         this.addMfr = 'kyocera'
         this.addName = null
         this.addPrice = null
         this.addNote = null
      }
   },

   watch: {
      category() {
         this.changeList()
      },

      editDialog() {
         this.editCategory = this.product.category
         this.editMfr = this.product.mfr
         this.editName = this.product.name
         this.editPrice = this.product.price
         this.editNote = this.product.note
      },

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