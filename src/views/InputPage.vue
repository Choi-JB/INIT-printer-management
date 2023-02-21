<template lang="">
    <div>
    <!-- 입력 항목 선택창 -->
    <v-container fluid>
    <v-radio-group
      v-model="inline"
      inline
    >
      <v-radio
        label="Option 1"
        value="radio-1"
      ></v-radio>
      <v-radio
        label="Option 2"
        value="radio-2"
      ></v-radio>
    </v-radio-group>
  </v-container>

        <v-card
            :loading="isUpdating"
        >
        <!-- 로딩 표시 -->
        <template v-slot:progress>
      <v-progress-linear
        absolute
        color="green-lighten-3"
        height="4"
        indeterminate
      ></v-progress-linear>
      </template>

      <!-- 입력창 -->
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
      <v-container>
        <v-row>
          <VueDatePicker v-model="date" :max-date="new Date()" show-now-button now-button-label="현재 날짜" ></VueDatePicker>
            <!-- 제품 선택 -->
            <v-col cols="12">
              
            <v-autocomplete
              v-model="product"
              :loading="loading"
              :disabled="isUpdating"
              :items="productList"
              :custom-filter="productFilter"
              variant="filled"
              color="blue-grey-lighten-2"
              label="*제품"
              item-title="name"
              item-value="name"
              
              
            >
            <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item?.raw?.name"
                  :subtitle="item?.raw?.note"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <!-- 날짜선택 -->    <!--@click="showDate()"  -->
          <v-col cols="12" md="6">
            <DatePicker v-model="date" @click="showDate()" :update-on-input="false" :max-date="new Date()" :data="masks">
              <template v-slot="{ inputValue, inputEvents }">
                <input
                  class="bg-white border px-2 py-1 rounded"
                  :value="inputValue"
                  v-on="inputEvents"
                />
              </template>
            </DatePicker>

            <p v-if="selectDate!='1970-01-01'">{{selectDate}}</p>
            <p v-if="selectDate=='1970-01-01'">날짜를 선택해주세요!</p>

            <VueDatePicker v-model="date" :max-date="new Date()" show-now-button now-button-label="현재 날짜" ></VueDatePicker>
            <p>{{date}}</p>
            <p>{{selectDate}}</p>
          </v-col>

          <!-- 거래처 입력 -->
          <v-col cols="12" md="6">
              
            
            
            <v-autocomplete
              v-model="client"
              :loading="loading"
              :disabled="isUpdating"
              :items="clientList"
              
              variant="filled"
              color="blue-grey-lighten-2"
              label="거래처"
              item-title="name"
              item-value="name"
              
            >
            <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item?.raw?.name"
                  :subtitle="item?.raw?.type"
                ></v-list-item>
              </template>
            </v-autocomplete>

             <!-- 개수 입력 -->
            <v-text-field
              v-model="count"
              type="number"
              :disabled="isUpdating"
              color="blue-grey-lighten-2"
              label="개수"
              
            ></v-text-field>
            <!-- 단가 입력 -->
            <v-text-field
              v-model="price"
              type="number"
              :disabled="isUpdating"
              color="blue-grey-lighten-2"
              label="단가"
              :rules="price_rule"
            ></v-text-field>

          </v-col>
          
          
        </v-row>

      </v-container>
    

    <v-divider />

    <!-- 버튼 -->
    <v-card-actions>
    <v-row class=" justify-space-between mx-8">
        <!-- <v-col cols="12" md="6"> -->
        <v-btn
            variant="flat"
            color="error"
            @click="reset"
        >
            초기화
        </v-btn>
       
        <!-- </v-col>
          
        <v-col cols="12" md="6"> -->
        <v-btn
            variant="flat"
            color="success"
            @click="dialog=true"
        >
            입력
            </v-btn>
            
        <!-- </v-col> -->
        </v-row>
    </v-card-actions>

    </v-form>
    </v-card>
    
    <!-- 전송 전 확인창 -->
    <v-dialog 
      v-model="dialog"
      persistent
      absolute
    >
      <v-card>
        <v-row justify="center">
          
        <v-card-text class="text-h6" >
          입력한 값을 확인해주세요 
          <br>
          <p class="text-xs-center">
          {{selectDate}} | {{select}} | {{client}} | {{product}} | {{count}} | {{price}}
        </p>


          </v-card-text>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="6">
          
          <!-- 입력값 전송 -->
          <v-card-actions>
            <v-btn color="success" block @click="dialog = false">네</v-btn>
          </v-card-actions>
        </v-col>
        <v-col cols="12" md="6">
          <v-card-actions>
            <v-btn color="error" block @click="dialog = false">아니오</v-btn>
          </v-card-actions>

            </v-col>
          </v-row>
        </v-card>
      </v-dialog>

    </div>
</template>
<script>
import { DatePicker } from 'v-calendar';


///import { ref } from 'vue';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import 'v-calendar/dist/style.css';
import axios from "axios";
import { ip } from '../router/ip';

//const test_date = ref(new Date());

export default {
  components: {
    DatePicker,
    VueDatePicker
  },
  data() {
    return {
      inline: null,
      //date: null,

      //선택한 날짜 데이터 포맷
      date: new Date(),
      selectDate: new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
      masks: {
        input: 'YYYY-MM-DD'
      },

      //입력 후 마지막 확인창 on/off
      dialog: false,

      //현재 선택한 메뉴
      select: '출고',
      menu: [
        '출고',
        '매입',
        '판매',
        '입고',
        '사무실사용'
      ],

      //상품명
      product: '',
      productList: [

      ],

      //거래처
      client: null,
      client_rule: [
        v => !!v || '거래처는 필수 입력사항입니다.',

      ],
      clientList: [],

      //개수, 단가
      count: 1,
      price: null,
      price_rule: [
        v => !(v == 0) || '단가를 확인해 주세요.'

      ],


    }
  },

  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    },

    date() {
      this.selectDate = this.dateFormat(this.date)
    }
  },


  methods: {

    dateFormat(date) {

      return new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
    },

    remove(item) {
      const index = this.friends.indexOf(item.name)
      if (index >= 0) this.friends.splice(index, 1)
    },
    async validate() {
      const { valid } = await this.$refs.form.validate()

      if (valid) alert('Form is valid')
    },
    //입력폼 모두 초기화
    reset() {
      this.$refs.form.reset()
      this.selectDate = new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    },
    //달력 선택한 날짜 표기
    showDate() {
      var new_date = new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(this.date);
      this.selectDate = new_date;
      console.log(new_date)
    },
    //productList 필터
    productFilter(item, queryText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1
    },

    //제품 선택 시 단가 자동입력
    setPrice() {

    },

    //입력한 내용 제출
    sendData() {
      axios.post(ip + "/input",
        {
          params: {
            date: this.selectDate,
            type: this.select,
            product: this.product,
            client: this.client,
            count: this.count,
            price: this.price,
          }
        }).then((res) => {
          console.log(res);
          alert("success!")
        }).catch((err) => {
          console.log(err);
          alert(err);
        }).finally(() => {
          //console.log("항상 마지막에 실행");
        })
    },

    //상품리스트, 거래처 리스트 가져오기
    getList() {
      axios.get(ip + "/list", {
        params: {
          type: this.type,

        }
      }).then((res) => {

        //  //DB에서 가져온 행들에서 이름만 분리
        // let list = [];
        // for(var idx in res.data){
        //   console.log(res.data[idx]);

        //   //예외처리 
        //   if(res.data[idx].type=="급지롤러"){
        //     console.log(res.data[idx].type);
        //     list.push(res.data[idx].name + '(' + res.data[idx].note + ')');
        //   } else{
        //     list.push(res.data[idx].name);
        //   }
        // }
        // this.productList = list;
        console.log(res.data)

        this.productList = [...res.data.productList];

        this.clientList = [...res.data.clientList];


      })
    },


  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="">
    
</style>