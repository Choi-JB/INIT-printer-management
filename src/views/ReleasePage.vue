<template lang="">
  <v-container>
    <!-- 출고/부품교체/판매 선택 -->
    <v-btn-toggle
      v-model="select"
      color="deep-purple-accent-3"
      variant="outlined"
      group
      class="my-3"
    >
      <v-btn value="출고" class="font-weight-black">
        출고
      </v-btn>
      <v-btn value="판매" class="font-weight-black">
        판매
      </v-btn>
      <v-btn value="직접사용" class="font-weight-black">
        직접사용
      </v-btn>
    </v-btn-toggle>


    <!-- 유저 입력 영역 -->
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      :disalbed="isUpdating"
    >

      <v-row>

        <!-- 현재 재고 목록 -->
        <v-col cols="12" md="5">
          <v-card variant="tonal" color="teal" height="450px">
            
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
              
              <tbody>
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

        
        <!-- 입력창 -->
        <v-col cols="12" md="7">
          <v-card variant="outlined" color="teal" max-width="500px" height="450px">

             <!-- 날짜 선택 -->
            <v-row class="mx-5 my-2">
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
                        label="*제품"
                        
                        item-title="product"
                        item-value="item"

                        return-object  
                        style = "max-width:400px;"
                        :menu-props="{ maxHeight: 300 }"
                      >
                      <template v-slot:item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :title="item?.raw?.product"
                            :subtitle="item?.raw?.price + '원 / 남은 재고 : '+ item?.raw?.count"
                          ></v-list-item>
                      </template>

                    </v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="3">
                      <!-- 수량 입력 -->
                      <v-text-field
                        v-model="count"
                        type="number"
                        :disabled="isUpdating"
                        color="blue-grey-lighten-2"
                        label="*수량"
                      ></v-text-field>
                    </v-col>
                </v-row>

                <v-row class="mx-5">
                  <!-- 거래처 입력 -->
                  <v-autocomplete
                    v-model="client"
                    :loading="loading"
                    :disabled="isEditing"
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
                    :disabled="isUpdating"
                    color="blue-grey-lighten-2"
                    label="단가 (단위 : 원￦)"
                    :rules="price_rule"
                  ></v-text-field>
                </v-row>

                  <!-- 버튼 -->
                  <v-card-actions>
                    <v-row class="justify-space-between mx-3">    <!-- justify-space-between 양옆으로 정렬 / mx-8 마진 양옆으로 8 -->
                      <!-- <v-col cols="12" md="6"> -->
                      <v-btn
                          variant="flat"
                          color="error"
                          @click="resetButton()"
                      >
                          초기화
                      </v-btn>
                      <!-- </v-col>

                      <v-col cols="12" md="6"> -->
                      <v-btn
                          variant="flat"
                          color="success"
                          @click="addList()"
                      >
                          추가
                          </v-btn>
                          
                      <!-- </v-col> -->
                    </v-row>
                  </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  </v-form>

 <!--------- 입력 완료 재확인 창 ------------->
<v-dialog 
    v-model="dialog"
    persistent
    absolute
    transition="dialog-bottom-transition"
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
        <v-btn color="error" block @click="dialog = false">재입력</v-btn>
      </v-card-actions>
    </v-col>
      </v-row>
    </v-card>
  </v-dialog>

  
<!--------------------------  -->
  <v-divider class="my-5" />
<!--------------------------  -->


  <!-- 출고/수리/판매 목록 -->
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
      <v-slide-x-transition group="true"> <!-- 애니메이션 효과 -->
      <tr
        v-for="list in releaseList"
        :key="list" 
      >
        <td class="text-center">{{releaseList.indexOf(list)+1}}</td>
        <td class="text-center">{{list.date}}</td>
        <td class="text-center">{{list.client}}</td>
        <td class="text-center">{{list.product}}</td>
        
        <!-- 문자로 인식해서 x1 해서 숫자처리 -->
        <td class="text-center">{{(list.price * 1).toLocaleString('ko-KR')}} 원</td>  
        <td class="text-center">{{list.count}}</td>
        <td lass="text-center">{{(list.price * list.count).toLocaleString('ko-KR')}} 원</td>
        <td lass="text-left"><v-icon icon="mdi-delete"
              
              @click="deleteList(list)"
          ></v-icon></td>
      </tr>

      <v-devider></v-devider>

      <tr class="text-xs-center">
        <td class="text-center" colspan="4">합계 금액</td>
        <td colspan="3">{{releasePrice.toLocaleString('ko-KR')}} 원</td>
      </tr>
    </v-slide-x-transition>
    </tbody>

  </v-table>
  <v-card-actions>
        <v-btn block size="large" v-if="releaseList.length != 0"
          color="secondary" @click="dialog = true">{{this.select}} 완료</v-btn>
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
      isUpdating: null,   //update 중에 사용 못하게
      isEditing: null,

      //현재 선택한 메뉴
      select: '출고',

      //토너/부품/프린터/복합기
      category: '토너',

      //선택한 날짜 데이터 포맷
      date: new Date(),
      selectDate: new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
      masks: {
        input: 'YYYY-MM-DD'
      },

      //입력 후 마지막 확인창 on/off
      dialog: false,

      //상품명
      product: '',
      productList: [],
      //카테고리별 상품 리스트 분류
      filterList: [],

      //거래처
      client: null,
      client_rule: [
        v => !!v || '거래처는 필수 입력사항입니다.',

      ],
      clientList: [],

      //개수, 단가
      count: 1,
      countValid: null,
      count_rule: [
        v => {

          if (v <= this.product.count)
            return true

          return '남은 재고보다 많은 수량입니다!'
        }

      ],

      price: null,
      price_rule: [
        v => !!v || '필수 입력 값 입니다!',
        v => (v && v * 1 > 0) || '양수만 입력 가능!',
      ],

      // 출고/판매 예정 물품 리스트
      releaseList: [],
      releasePrice: 0,

      //사무실재고
      inventory2: []
    }
  },

  //특정 요소가 변경될때
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 1500)
      }
    },

    //토너, 부품 등 카테고리 변경시 제품목록 변경
    category() {
      // console.log("현재 카테고리 : " + this.category)
      this.changeProductList()
      this.changeInventoryList()
      //this.resetForm()    제품쪽만 초기화
      this.product = null;
    },

    //product값 변경 시 제품 정보 세팅
    product: {
      handler() {
        if (this.product) {     //물품 선택 후에 개수 변경 가능하게
          this.price = this.product.price
          this.countValid = true
        }
      }
    },
    //사무실 재고만큼 개수 제한
    count() {
      if (this.product) {
        if (this.count > this.product.count) {
          this.count = this.product.count
          //alert('사무실 재고보다 많은 수량을 입력할 수 없습니다!')
        }
        //수량 0이나 음수 사용 못하게
        if (this.count <= 0) {
          this.count = 1
        }
      }
    },

    //출고, 판매 항목 변경 시 제품목록 변경
    select() {
      //순서 중요!
      this.resetButton()

      //직접 사용시 거래처 항목 선택 불가능하게
      if (this.select == '직접사용') {
        this.isEditing = !this.isEditing
        this.client = '직접사용'
        //console.log(this.client)
      } else {
        this.isEditing = null;
        //console.log(this.client)
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

    //밑에 두 함수는 필요한가??
    remove(item) {
      const index = this.friends.indexOf(item.name)
      if (index >= 0) this.friends.splice(index, 1)
    },
    async validate() {
      const { valid } = await this.$refs.form.validate()

      if (valid) alert('Form is valid')
    },

    //입력폼 모두 초기화
    resetForm() {
      //this.$refs.form.reset()
      if (this.select != '직접사용') {
        this.client = null
      }
      this.product = null
      this.count = 1
      this.price = null
      this.date = new Date()
      this.selectDate = new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    },


    //달력 선택한 날짜 표기
    showDate() {
      var new_date = new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(this.date);
      this.selectDate = new_date;
      // console.log(new_date)
    },


    //productList 필터 (안씀)
    productFilter(item, queryText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1
    },


    //입력한 내용 제출
    sendData() {
      axios.post(ip + "/out",
        {
          params: this.releaseList
        }).then((res) => {
          console.log(res);
          alert("success!")
        }).catch((err) => {
          console.log(err);
          alert(err);
        }).finally(() => {    //제출 후 항목들 초기화
          //console.log("항상 마지막에 실행");
          this.resetButton()
        })
    },

    //상품리스트, 거래처 리스트 가져오기
    getList() {
      //this.filterList = []

      //고객 거래처만 불러오기
      axios.get(ip + '/list', { params: { type: '고객' } }).then((res) => {

        this.clientList = [...res.data.clientList];
      })

      //사무실 재고 불러오기
      axios.get(ip + "/inventory").then((res) => {
        //console.log(res.data)
        //this.inventory = res.data;
        //this.category = '전체'
        this.productList = [...res.data];
        //console.log(this.productList)

        //목록 가져 온 후 카테고리별로 목록 수정하게
        //this.category = '';
        //this.category = '토너';
        this.changeProductList();
        this.changeInventoryList();
      })
    },

    //카테고리별로 제품 목록 분류
    changeProductList() {
      //this.filterList = [];
      var list = [];

      //현재 선택 중인 카테고리 목록만 분류
      for (var index in this.productList) {

        //수량이 0이면 표시x  //&& this.productList[index].count != 0 //DB단계 에서 수량 0이면 가져오지 않게 바꿈
        if (this.category == this.productList[index].category) {
          //console.log('match!')
          list.push(this.productList[index])
        }
      }
      //console.log(list)

      this.filterList = list.slice();
    },

    //카테고리별로 사무실 재고 목록 변경
    changeInventoryList() {
      var list = [];

      //현재 선택 중인 카테고리 목록만 분류
      for (var index in this.productList) {
        if (this.category == this.productList[index].category) {
          list.push(this.productList[index])
        }
      }
      console.log(list)
      this.inventory2 = [...list]
    },


    //목록에 추가
    addList() {
      if (this.product == null || this.client == null || this.count == null || this.price == null) {
        alert('입력값을 맞게 입력했는지 확인해주세요!')
      } else if (this.releaseList.length >= 5) {
        alert('한번에 5개까지만 입력가능합니다!')
      } else if (this.count > this.product.count) {
        alert('재고가 부족합니다!')
      }
      else {
        let exist = -1;

        //만약 목록에 있는 품목이면 개수만 있는 목록의 개수만 증가
        this.releaseList.forEach(object => {

          if (object.date == this.selectDate && object.product == this.product.product && object.client == this.client && object.price == this.price) {

            object.count = this.count * 1 + object.count * 1;
            exist = 1;

          }
        })

        //없는 품목이면 새로 추가
        if (exist != 1) {
          this.releaseList.push({
            id: this.product.id,
            type: this.select,
            category: this.product.category,
            date: this.selectDate,
            client: this.client,
            product: this.product.product,
            count: this.count,
            price: this.price,
            total: this.count * this.price
          })
        }
        this.releasePrice += this.count * this.price
        //console.log(this.client)

        //사무실재고 보다 더 많이 나갈 수 없게 하기?
        //filterlist는 productlist를 참조한 상태여서 filterlist값을 변경해도 같이 변경됨
        //this.product.count = this.product.count - this.count
        this.filterList.forEach(object => {
          //console.log(object.count + ' / ' + this.count)
          if (object.id == this.product.id) {
            object.count = object.count * 1 - this.count * 1
          }
        })
      }


    },
    //목록 초기화
    resetList() {
      this.releaseList = [];
      this.releasePrice = 0;
    },

    //초기화 버튼
    resetButton() {
      this.resetForm()
      this.resetList()
      this.getList()
      //this.changeProductList()
      //this.isUpdating = true;
    },

    //목록 중 선택한 행만 제거
    deleteList(list) {

      this.releaseList.splice(this.releaseList.indexOf(list), 1)
      this.releasePrice -= (list.price * list.count)


      //삭제한 만큼 원래 재고 수량에 다시 추가
      this.filterList.forEach(object => {
        //console.log(object.count + ' / ' + this.count)
        if (object.id == list.id) {
          object.count = object.count * 1 + list.count * 1
        }
      })
    }

  },

  //최초 한번 실행
  mounted() {
    this.getList();

  }

}
</script>
<style></style>