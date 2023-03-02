<template lang="">
  <v-container>

    <!-- 매입/입고 선택 -->
    <v-btn-toggle
      v-model="select"
      color="deep-purple-accent-3"
      variant="outlined"
      group
      class="my-3"
    >
      <v-btn value="매입" class="font-weight-black">
        매입
      </v-btn>
      <v-btn value="입고" class="font-weight-black">
        입고
      </v-btn>
    </v-btn-toggle>


    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-row>

        <!-- 현재 재고 목록 -->
        <v-col cols="12" md="5">
          
          <v-card variant="tonal" color="teal" max-height="450px">
            
            <p class="mx-5 my-5 text-center font-weight-black">사무실 {{this.category}} 재고</p>
            <v-table fixed-header height="350px">
              <thead>
                <th class="text-center">
                  품목
                </th>
                <th class="text-center">
                  수량
                </th>
              </thead>
              
              <tbody >
                <v-scroll-y-transition group="true">
                <tr
                  v-for="list in inventory2"
                  :key="list"
                >
                  <td class="text-center">{{list.product}}</td>
                  <td class="text-center">{{list.count}}</td>
                </tr>
                
                 
                </v-scroll-y-transition>
              </tbody>
              
            </v-table>
            
          </v-card> 
          
        </v-col>



<!------------- 입력창 -------------------------->
        <v-col cols="12" md="7">
          <v-card  variant="outlined" color="teal" max-width="500px" max-height="700px">
            <v-form ref="form">

            <!-- 날짜 선택 -->
            <v-row class="mx-5 mt-3">
              <v-col cols="12" md="3">
              <p class="font-weight-black FontSize">입력창</p>  
              </v-col>
              <v-col cols="12" md="9" class="text-right">
                  <DatePicker v-model="date" @click="showDate()" :update-on-input="false" :max-date="new Date()" :data="masks">
                    <template v-slot="{ inputValue, inputEvents }">
                      <input
                        class="bg-white border px-2 py-1 rounded"
                        :value="inputValue"
                        v-on="inputEvents"
                      />
                    </template>
                  </DatePicker>
              </v-col>
            </v-row>  

            <!-- 카테고리 선택창 -->
            <v-row class="mx-5 mb-n10">
                
                 <v-btn-toggle
                    v-model="category"
                    color="blue"
                    group
                    class="mb-8"
                    variant="outlined"
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
            </v-row>


                <v-row class="mx-2 mb-n6">

                    <v-col cols="12" md="9">
                        <!-- 제품 선택 -->        
                        <v-autocomplete
                        v-model="product"
                        :items="filterList"

                        color="blue-grey-lighten-2"
                        label="제품*"
                        
                        item-title="name"
                        item-value="item"

                        return-object  
                        style = "max-width:400px;"
                        :menu-props="{ maxHeight: 300 }"
                      >
                      <template v-slot:item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :title="item?.raw?.name"
                            :subtitle="item?.raw?.note + ' / '+ item?.raw?.price+'원'"
                          ></v-list-item>
                      </template>

                    </v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="3">
                      <!-- 수량 입력 -->
                      <v-text-field
                        v-model="count"
                        type="number"
                        :rules="price_rule"
                        :disabled="isUpdating"
                        color="blue-grey-lighten-2"
                        label="*수량"
                        @wheel.up.passive="()=>{this.count = this.count*1 + 1}"
                        @wheel.down.passive="()=>{this.count = this.count*1 - 1}"
                        
                      ></v-text-field>
                    </v-col>
                </v-row>

                 <v-row class="mx-5">
                    <!-- 거래처 입력 -->
                    <v-autocomplete
                      v-model="client"
                      :loading="loading"
                      :disabled="isUpdating"
                      :items="clientList"

                      variant="filled"
                      color="blue-grey-lighten-2"
                      label="*거래처"
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
                  </v-row>

                <v-row class="mx-5">
                  <!-- 단가 입력 -->
                  <v-text-field
                    v-model="price"
                    type="number"
                    :rules="price_rule"
                    :disabled="isUpdating"
                    color="blue-grey-lighten-2"
                    label="단가 (단위 : 원￦)"
                  ></v-text-field>
                </v-row>

                  <!-- 버튼 -->
                  <v-card-actions>

                    <v-row class=" justify-space-between mx-3">
                      <v-btn
                          variant="flat"
                          color="error"
                          @click="[reset(), resetList()]"
                      >
                          초기화
                      </v-btn>

                      <v-btn
                          variant="flat"
                          color="success"
                          @click="addList()"
                      >
                          추가
                          </v-btn>
                          
                    </v-row>
                  </v-card-actions>
            </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-form>


 <!------------- 입력 완료 재확인 창 ----------------------->
<v-dialog 
    v-model="dialog"
    persistent
    absolute
    max-width="700px"
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
        <v-btn color="error" block @click="dialog = false">취소</v-btn>
      </v-card-actions>
    </v-col>
      </v-row>
    </v-card>
  </v-dialog>


<!--------------------------  -->
  <v-divider class="my-5" />
<!--------------------------  -->


  <!-- 매입/입고 목록 -->
  <v-card variant="outlined" color="blue" max-width="1000px">
   <v-table>
    <thead >
      
      <tr class="table-head">
        <th  class="text-center">
          번호
        </th>
        <th  class="text-center">
          일자
        </th>
        <th class="text-center">
          거래처
        </th>
        <th class="text-center">
          품명
        </th>
        <th class="text-center">
          단가
        </th>
        <th class="text-center">
          수량
        </th>
        <th class="text-center">
          금액
        </th>
        <th>
           
        </th>
      </tr>
    
    </thead>

    <tbody>
      <v-slide-x-transition group="true">
      <tr
        v-for="list in purchaseList"
        :key="list" 
      >
        <td class="text-center">{{purchaseList.indexOf(list)+1}}</td>
        <td class="text-center">{{list.date}}</td>
        <td class="text-center">{{list.client}}</td>
        <td class="text-center">{{list.product}}</td>
        
        <!-- 문자로 인식해서 x1 해서 숫자처리 -->
        <td class="text-center">{{(list.price * 1).toLocaleString('ko-KR')}} 원</td>
        
        <td class="text-center">
          <v-scroll-y-transiton>
          {{list.count}}
          </v-scroll-y-transiton>  
        </td>
        
        <td class="text-center">{{(list.price * list.count).toLocaleString('ko-KR')}} 원</td>
        <td class="text-left">
          <v-tooltip text="삭제">
            <template v-slot:activator="{ props }">
              <v-icon 
                v-bind="props"
                icon="mdi-delete"
                @click="deleteList(list)"
              ></v-icon>
            </template>
          </v-tooltip>
        </td>
      </tr>
   
      <v-devider></v-devider>

      <tr class="text-xs-center">
        <td class="text-center" colspan="4">합계 금액</td>
        <td colspan="3">  {{purchasePrice.toLocaleString('ko-KR')}} 원</td>
      </tr>
    </v-slide-x-transition>
    </tbody>

  </v-table>

  <v-card-actions>
        <v-btn block size="large" v-if="purchaseList.length != 0"
          color="success" @click="dialog = true">{{this.select}} 완료</v-btn>
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
    DatePicker,
  },
  data() {
    return {
      valid: true,

      category: '토너',

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
      clientList: [],

      //입력창 규칙
      text_rule: [
        v => !!v || '필수 입력 값 입니다!',
        v => (v && v.length <= 20) || '20자를 초과할 수 없습니다',
      ],


      //수량, 단가
      count: 1,

      price: null,
      price_rule: [
        v => !!v || '필수 입력 값 입니다!',
        v => (v && v * 1 > 0) || '양수만 입력 가능!',
      ],

      //매입한 물품 리스트
      purchaseList: [],
      purchasePrice: 0,


      //사무실 재고
      inventory: [],
      inventory2: [],
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
      this.changeInventoryList()
      this.product = null;
    },

    //product값 변경 시 제품 정보 세팅
    product: {
      handler() {
        if (this.product) {
          this.price = this.product.price
        }
      }
    },

    select() {
      console.log(this.select)
      this.resetList();
      this.reset();
      this.count = 1;
    },

    //수량 0, 음수 사용 못하게
    count() {
      if (this.count <= 0) {
        this.count = 1
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
    // async validate() {
    //   const { valid } = await this.$refs.form.validate()

    //   if (valid) alert('Form is valid')
    // },
    //입력폼 모두 초기화
    reset() {
      //this.$refs.form.reset()
      this.client = null
      this.product = null
      this.count = 1
      this.price = null
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
          //console.log('이거 실행됨?')
          this.getList()
          this.getInventory()
          this.reset()
          this.resetList()
        })
    },

    //상품리스트, 거래처 리스트 가져오기
    getList() {
      axios.get(ip + '/list', { params: { type: '매입' } }).then((res) => {

        this.productList = [...res.data.productList];
        this.clientList = [...res.data.clientList];

        //목록 가져 온 후 카테고리별로 목록 수정하게
        //this.category = '토너';
        this.changeProductList()

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
      //console.log(list)

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

        let exist = -1;

        //만약 목록에 있는 품목이면 목록에 있는 품목의 수량만 증가
        this.purchaseList.forEach(object => {

          if (object.date == this.selectDate && object.product == this.product.name && object.client == this.client && object.price == this.price) {

            object.count = this.count * 1 + object.count * 1;
            exist = 1;

          }
        })

        if (exist != 1) {
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
        }
        this.purchasePrice += this.count * this.price
        console.log(this.purchasePrice)
      }

    },
    //매입목록 초기화
    resetList() {
      this.purchaseList = [];
      this.purchasePrice = 0;
    },
    //매입목록 중 선택한 리스트 제거
    deleteList(list) {
      this.purchaseList.splice(this.purchaseList.indexOf(list), 1)
      this.purchasePrice -= (list.price * list.count)
    },

    //사무실 재고 목록 불러오기
    getInventory() {
      axios.get(ip + "/inventory").then((res) => {
        console.log(res.data)
        this.inventory = res.data;
        //this.category = '토너';
        this.changeInventoryList()
      })
    },

    //카테고리별로 사무실 재고 목록 변경
    changeInventoryList() {
      var list = [];

      //현재 선택 중인 카테고리 목록만 분류
      for (var index in this.inventory) {
        if (this.category == this.inventory[index].category) {
          list.push(this.inventory[index])
        }
      }
      console.log(list)
      this.inventory2 = [...list]
    },
  },

  //최초 한번 실행
  mounted() {
    this.getList();
    this.getInventory();
  }

}
</script>
<style>
.scroll {
  transition: 0.1s;
}

.v-autocomplete__content .v-list__tile {
  height: auto;
}

.FontSize {
  font-size: 18px;
}
</style>