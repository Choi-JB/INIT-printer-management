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
            <v-btn value="고객" class="font-weight-black">
            고객
            </v-btn>
            <v-btn value="매입" class="font-weight-black">
            매입
            </v-btn>
            <v-btn value="기타" class="font-weight-black">
            기타
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

    <!-- 거래처 정보 테이블 -->
    <v-table
      fixed-header
      height="600px"
    >
      <thead>
        <tr>
          <th class="text-center">
            분류
          </th>
          <th class="text-center">
            거래처명
          </th>
          <th class="text-center">
            연락처
          </th>
          <th class="text-center">
            주소
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
            <td>{{ item.name }}</td>
            <td>{{ item.phone }} </td>
            <td>{{ item.address }}</td>
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
                  label="*분류"
                  :rules="textRule"
                  :items="['고객', '매입', '기타']"
                  ></v-select>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                  v-model="addName"
                  :rules="textRule"
                  :counter="20"
                  label="*거래처명"
                  required
               ></v-text-field>
            </v-col>
         </v-row>
         <v-row class="mx-5">  
            <v-col cols="12" md="6">   
                <v-text-field
                  v-model="addPhone"

                  :counter="20"
                  label="연락처"
                  
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="addAddress"
                  :counter="30"
                  label="주소"
                  
               ></v-text-field>
            </v-col>
         </v-row> 
         <v-row class="mx-5">
            <v-col>
                <v-text-field
                  v-model="addNote"

                  :counter="20"
                  label="메모"
                  
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
                  label="*분류"
                  :disabled="this.isDelete"
                  :rules="textRule"
                  :items="['고객', '매입', '기타']"
                  ></v-select>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                  v-model="editName"
                  :rules="textRule"
                  :disabled="this.isDelete"
                  :counter="20"
                  label="*거래처명"
                  required
               ></v-text-field>
            </v-col>
         </v-row>
         <v-row class="mx-5">  
            <v-col cols="12" md="6">
               <v-text-field
                  v-model="editPhone"
                  :disabled="this.isDelete"
                  :counter="20"
                  label="연락처"
                  
               ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                  v-model="editAddress"
                  :disabled="this.isDelete"
                  :counter="30"
                  label="주소"
                  
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

         category: '고객',
         client: '',
         clientDBList: [],
         filterList: [],

         editCategory: null,
         editName: null,
         editAddress: ' ',
         editPhone: ' ',
         editNote: ' ',

         addCategory: null,
         addName: null,
         addAddress: ' ',
         addPhone: ' ',
         addNote: ' ',

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
      //거래처 정보 가져오기
      getClientData() {
         axios.get(ip + `/client`).then((res) => {
            this.clientDBList = [...res.data.clientList]
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
         for (var index in this.clientDBList) {

            if (this.category == this.clientDBList[index].category) {
               //console.log('match!')
               list.push(this.clientDBList[index])
            }
         }
         //console.log('리스트 변경 완료')

         this.filterList = [...list]

      },

      //수정창 열기
      openEditDialog(object) {
         this.client = object;
         this.editDialog = true;

         //alert(object.name)
      },

      //추가
      async add() {

         const { valid } = await this.$refs.form.validate()

         if (valid) {
            this.addDialog = false;

            axios.post(ip + "/client/add",
               {
                  editData: {
                     category: this.addCategory,
                     name: this.addName,
                     address: this.addAddress,
                     phone: this.addPhone,
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
                  this.getClientData()
               })
         }

      },

      //수정
      async edit() {
         const { valid } = await this.$refs.form.validate()

         if (valid) {
            this.editDialog = false;

            this.client.category = this.editCategory
            this.client.name = this.editName
            this.client.address = this.editAddress
            this.client.phone = this.editPhone
            this.client.note = this.editNote

            axios.post(ip + "/client/edit",
               {
                  editData: {
                     id: this.client.id,
                     category: this.editCategory,

                     name: this.editName,
                     address: this.editAddress,
                     phone: this.editPhone,
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
                  this.getClientData()
               })
         }
      },

      //해당 항목 삭제
      deleteData() {
         this.deleteDialog = false;
         this.editDialog = false;

         axios.post(ip + "/client/delete",
            {
               editData: {
                  id: this.client.id,
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
               this.getClientData()
            })
      },

      resetEditData() {
         this.product = null

         this.editCategory = null
         this.editName = null
         this.editAddress = ' '
         this.editPhone = ' '
         this.editNote = ' '

         this.addCategory = null
         this.addName = null
         this.addAddress = ' '
         this.addPhone = ' '
         this.addNote = ' '
      }
   },

   watch: {
      category() {
         this.changeList()
      },

      editDialog() {
         this.editCategory = this.client.category
         this.editName = this.client.name
         this.editAddress = this.client.address
         this.editPhone = this.client.phone
         this.editNote = this.client.note
      },

   },

   mounted() {
      this.getClientData()
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