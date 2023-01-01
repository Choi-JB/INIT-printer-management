<template lang="">

    <v-radio-group
  v-model="inline"
  inline
>
  <v-radio
    label="매입"
    value="매입"
  ></v-radio>
  <v-radio
    label="입고"
    value="입고"
  ></v-radio>
</v-radio-group>

<v-autocomplete
label="검색"
:items=stock
></v-autocomplete>

<v-text-field
  label="개수"
  hide-details="auto"
></v-text-field>
<v-text-field label="매입/고객처"></v-text-field>
<v-text-field label="단가"></v-text-field>

<v-form v-model="valid">
<v-container>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        v-model="year"
        :rules="yearRules"
        :counter="4"
        label="년도"
        required
      ></v-text-field>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        v-model="month"
        :rules="monthRules"
        :counter="2"
        label="월"
        required
      ></v-text-field>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        v-model="day"
        :rules="dayRules"
        label="일"
        :counter="2"
        required
      ></v-text-field>
    </v-col>
  </v-row>
</v-container>

<v-btn
  color="success"
  class="mr-4"
  @click="validate"
>
  입력
</v-btn>

<v-btn
  color="error"
  class="mr-4"
  @click="reset"
>
  초기화
</v-btn>
</v-form>



</template>
<script>
export default {
data: () => ({
    // radio-button
    column: null,
    inline: null,

    state: "출고",
    menu: ["출고", "임대"],
    text: ["1", "2"],

 

    client: ['삼보', '한국OSG'],
    stock: ['M5526', 'FS-2100', 'P3145dn','TK-5244KK'],

    item: {
        name: '',
        count: 0,
        memo: '',
        client: '',
    },

    valid: false,
  
    year:'',
    yearRules:[
        v => !!v || '년도를 입력해주세요',
        v => (v && v.length == 4)
    ],
    month:'',
    monthRules:[
        v => !!v || '몇월인지 입력해주세요',
        v => (v && v.length <= 2)
    ],
    day:'',
    dayRules:[
        v => !!v || '며칠인지 입력해주세요',
        v => (v && v.length <= 2) || (v<=31)
    ],

}),

computed: {
    fields() {
        if (!this.model) return []

        return Object.keys(this.model).map(key => {
            console.log(this.model)
            return {
                key,
                value: this.model[0].value
            }
        })
    }
},


};
</script>
<style lang="">

</style>