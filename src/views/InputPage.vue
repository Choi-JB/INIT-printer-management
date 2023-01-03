<template lang="">
    <div>
        <!-- 입력 항목 선택창 -->
        <v-select
            v-model="select"
            clearable
            label="선택"
            :items="menu"
        ></v-select>

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
            <!-- 제품 선택 -->
            <v-col cols="12">
            <v-autocomplete
              v-model="product"
              :disabled="isUpdating"
              :items="productList"
              variant="filled"
              color="blue-grey-lighten-2"
              label="제품"
              item-title="product"
              item-value="product"
            >
            <template v-slot:item="{ props, item }">
                <v-list-item v-if="typeof item.raw !== 'object'" v-bind="props"></v-list-item>
                <v-list-item
                  v-else
                  v-bind="props"
                  :title="item.raw.product"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <!-- 날짜선택 -->
          <v-col cols="12" md="6">
            날짜 선택 창
          </v-col>

          <!-- 거래처 / 개수 입력 -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="client"
              :disabled="isUpdating"
              variant="filled"
              color="blue-grey-lighten-2"
              label="거래처"
            ></v-text-field>
            <v-text-field
              v-model="count"
              type="number"
              :disabled="isUpdating"
              color="blue-grey-lighten-2"
              label="개수"
              
            ></v-text-field>

            <v-text-field
              v-model="price"
              type="number"
              :disabled="isUpdating"
              color="blue-grey-lighten-2"
              label="단가"
              
            ></v-text-field>

          </v-col>
          
          
        </v-row>
      </v-container>
    

    <v-divider></v-divider>

    <!-- 버튼 -->
    <v-card-actions>
    <v-row>
        <v-col cols="12" md="6">
        <v-btn
            variant="flat"
            color="error"
            @click="reset"
        >
            초기화
        </v-btn>
        </v-col>

        <v-col cols="12" md="6">
        <v-btn
            variant="flat"
            color="success"
            @click="validate"
        >
            입력
            </v-btn>
            
        </v-col>
        </v-row>
    </v-card-actions>

    </v-form>
    </v-card>

    </div>
</template>
<script>
export default {
    data(){
        return{
            select: '출고',
            menu:[
                '출고',
                '매입',
                '판매',
                '입고',
            ],

            product:'',
            productList:[
                {
                    type:'복합기',
                    mfr:'kyocera',
                    product:'M5526',
                    price:'300000'
                },
                {
                    type:'토너',
                    mfr:'kyocera',
                    product:'TK-5244K',
                    price:'18000',
                    comp:''
                },
           
            ],

            client:'',

            count:null,
            price:null,


        }
    },

    watch: {
            isUpdating (val) {
                if (val) {
                setTimeout(() => (this.isUpdating = false), 3000)
                }
            },

       },

    methods: {
      remove (item) {
        const index = this.friends.indexOf(item.name)
        if (index >= 0) this.friends.splice(index, 1)
      },
      async validate () {
        const { valid } = await this.$refs.form.validate()

        if (valid) alert('Form is valid')
      },
      reset () {
        this.$refs.form.reset()
      },

    },
        
}
</script>
<style lang="">
    
</style>