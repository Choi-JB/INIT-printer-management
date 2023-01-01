<template lang="">
     <v-table
    fixed-header
    height="500px"
  >
    <thead>
      <tr>
        <th class="text-left">
          날짜
        </th>
        <th class="text-left">
          구분
        </th>
        <th class="text-left">
          어디에
        </th>
        <th class="text-left">
          품명
        </th>
        <th class="text-left">
          개수
        </th>
        <th class="text-left">
          단가
        </th>
        <th class="text-left">
          총액
        </th>
        <th class="text-left">
          
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in history"
        :key="item"
      >
        <td>{{ item.date }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.where }}</td>
        <td>{{ item.what }}</td>
        <td>{{ item.count }}</td>
        <td>{{ item.unit_price }}</td>
        <td>{{ item.total }}</td>
        <td>  <v-icon
      size="large"
      color="red"
    >
      mdi-close
    </v-icon> </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
export default {
    data () {
        return {
            history:[
                {
                    date:'2022-08-23',
                    type:'매입',
                    where:'한별시스템',
                    what:'TK-5244Y',
                    count: 5,
                    unit_price: 18000,
                    total: 90000
                },
                {
                    date:'2022-08-23',
                    type:'출고',
                    where:'삼보',
                    what:'TK-164K',
                    count: 3,
                    unit_price: 20000,
                    total: 60000
                }
            ],
        }
    }
}
</script>
<style lang="">
    
</style>