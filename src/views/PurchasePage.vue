<template lang="">
  <v-container>
    <v-card>

    <!-- 유저 입력 영역 -->
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >

      <v-row>

        <!-- 날짜선택 -->
        <v-col cols="12" md="4">
          <DatePicker v-model="date" @click="showDate()"  :max-date="new Date()" :data="masks"/>
          <p v-if="selectDate!='1970-01-01'">{{selectDate}}</p>
          <p v-if="selectDate=='1970-01-01'">날짜를 선택해주세요!</p>
        </v-col>

        
        <v-col cols="12" md="6">

           <!-- 매입처 입력 -->
          <v-autocomplete
            v-model="client"
            :loading="loading"
            :disabled="isUpdating"
            :items="clientList"
            
            variant="filled"
            color="blue-grey-lighten-2"
            label="*매입처"
            item-title="name"
            item-value="name"
            
          >
          <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item?.raw?.name"
              ></v-list-item>
            </template>
          </v-autocomplete>

     <!-- 카테고리 선택창 -->
    <v-radio-group
      v-model="category"
      inline
    >
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

            <!-- 제품 선택 -->         <!-- 리스트에 스크롤 추가 필요 -->
            <v-autocomplete
            v-model="product"
            :items="filterList"
            
            variant="filled"
            color="blue-grey-lighten-2"
            label="*제품"
            
            item-title="name"
            item-value="item"

            return-object
          >
          
          <template v-slot:item="{ props, item }">
            <v-slide-x-reverse-transition mode="out-in">
              <v-list-item
                v-bind="props"
                :title="item?.raw?.name"
                :subtitle="item?.raw?.note + ' / '+ item?.raw?.price+'원'"
              ></v-list-item>
            </v-slide-x-reverse-transition>
          </template>
        </v-autocomplete>

           <!-- 개수 입력 -->
          <v-text-field
            v-model="count"
            type="number"
            :disabled="isUpdating"
            color="blue-grey-lighten-2"
            label="*개수"
            
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

  <v-divider />

  <!-- 버튼 -->
  <v-card-actions>
  <v-row>
      <v-col cols="12" md="6">
      <v-btn
          variant="flat"
          color="error"
          @click="[reset(), resetList()]"
      >
          초기화
      </v-btn>
      </v-col>

      <v-col cols="12" md="6">
      <v-btn
          variant="flat"
          color="success"
          @click="addList()"
      >
          추가
          </v-btn>
          
      </v-col>
      </v-row>
  </v-card-actions>

  </v-form>
  </v-card>

 <!-- 매입 완료 재확인 창 -->
<v-dialog 
    v-model="dialog"
    persistent
    absolute
  >
    <v-card>
      <v-row justify="center">
      <v-card-text class="text-h6 text-center" >
        입력한 값이 맞습니까? 
      </v-card-text>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="6">
      <v-card-actions>
        <v-btn color="success" block @click="[dialog = false, sendData()]">완료</v-btn>
      </v-card-actions>
    </v-col>
    <v-col cols="12" md="6">
      <v-card-actions>
        <v-btn color="error" block @click="dialog = false">재입력</v-btn>
      </v-card-actions>
    </v-col>
      </v-row>
    </v-card>
  </v-dialog>


  <!-- 매입 목록 -->
  <v-card
    v-if="purchaseList.length != 0"
  >
   <v-table
    fixed-header
  >
    <thead>
      <tr>
        <th>
          번호
        </th>
        <th>
          매입처
        </th>
        <th>
          품명
        </th>
        <th>
          단가
        </th>
        <th>
          개수
        </th>
        <th>
          금액
        </th>
        <th>
           
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="list in purchaseList"
        :key="list"
      >
        <td>{{purchaseList.indexOf(list)+1}}</td>
        <td>{{list.client}}</td>
        <td>{{list.product}}</td>
        
        <!-- 문자로 인식해서 x1 해서 숫자처리 -->
        <td>{{(list.price * 1).toLocaleString('ko-KR')}} 원</td>  
        <td>{{list.count}}</td>
        <td>{{(list.price * list.count).toLocaleString('ko-KR')}} 원</td>
        <td><v-icon icon="mdi-delete"
              
              @click="deleteList(list)"
          ></v-icon></td>
      </tr>
      <v-devider></v-devider>
      <tr class="text-xs-center">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="text-xs-right">합계 금액</td>
        <td>{{purchasePrice.toLocaleString('ko-KR')}} 원</td>
      </tr>
    </tbody>
  </v-table>
  <v-card-actions>
        <v-btn block size="large"
          color="secondary" @click="dialog = true">매입 완료</v-btn>
  </v-card-actions>

  </v-card>


</v-container>
</template>
<script>
import { DatePicker } from 'v-calendar';

import 'v-calendar/dist/style.css';
import axios from "axios";
import { ip } from '../router/ip';


export default {
  components: {
    DatePicker
  },
  data() {
    return {
      category: '복합기',

      //선택한 날짜 데이터 포맷
      date: new Date(),
      selectDate: new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
      masks: {
        input: 'YYYY-MM-DD'
      },

      //입력 후 마지막 확인창 on/off
      dialog: false,

      //현재 선택한 메뉴
      select: '매입',

      //상품명
      product: '',
      productList: [],
      filterList: [],

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

      //매입한 물품 리스트
      purchaseList: [],
      purchasePrice: 0,

    }
  },

  //특정 요소가 변경될때
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    },

    category() {
      // console.log("현재 카테고리 : " + this.category)
      this.changeProductList()
    },

    //product값 변경 시 제품 정보 세팅
    product: {
      handler() {
        this.price = this.product.price
      }
    }
  },


  methods: {

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
      // console.log(new_date)
    },


    //productList 필터
    productFilter(item, queryText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1
    },


    //입력한 내용 제출
    sendData() {
      axios.post(ip + "/input",
        {
          params: this.purchaseList
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
      axios.get(ip + `/list?data=${encodeURIComponent('매입')}`).then((res) => {

        this.productList = [...res.data.productList];
        this.clientList = [...res.data.clientList];

        //목록 가져 온 후 카테고리별로 목록 수정하게
        this.category = '토너';
      })
    },

    //카테고리별로 제품 목록 분류
    changeProductList() {
      var list = [];

      //현재 선택 중인 카테고리 목록만 분류
      for (var index in this.productList) {
        //console.log(this.category + ' / ' + this.productList[index].category)

        if (this.category == this.productList[index].category) {
          //console.log('match!')
          list.push(this.productList[index])
        }
      }
      console.log(list)

      this.filterList = [...list]
    },


    //매입목록에 추가
    addList() {
      if (this.product == null || this.client == null || this.count == null || this.price == null) {
        alert('입력값을 채워주세요!')
      } else if (this.purchaseList.length >= 5) {
        alert('한번에 5개까지만 입력가능합니다!')
      }
      else {
        this.purchaseList.push({
          type: this.select,
          category: this.category,
          date: this.selectDate,
          client: this.client,
          product: this.product.name,
          count: this.count,
          price: this.price,
          total: this.count * this.price
        })

        this.purchasePrice += this.count * this.price
      }

    },
    //매입목록 초기화
    resetList() {
      this.purchaseList = [];
    },
    //매입목록 중 선택한 리스트 제거
    deleteList(list) {
      this.purchaseList.splice(this.purchaseList.indexOf(list), 1)
      this.purchasePrice -= (list.price * list.count)
    }

  },

  //최초 한번 실행
  mounted() {
    this.getList();

  }

}
</script>
<style lang="">

</style>