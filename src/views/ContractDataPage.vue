<template lang="">
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-checkbox v-model="editMode" label="계약 내용 수정하기" class="float-left" ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6">
                <v-btn
                    variant="flat"
                    color="success"
                    size="large"
                    class="float-right"
                    @click="openAddDialog()"
                >
                    추가
                </v-btn>
            </v-col>
        </v-row>

        <v-divider />
            <v-table
                fixed-header
                
            >
                <thead>
                    <tr>
                        <th class="text-center">
                            거래처
                        </th>
                        <th class="text-center">
                            임대 기간
                        </th>
                        <th class="text-center">
                            월 임대료
                        </th>
                        <th class="text-center">
                            상태
                        </th>
                    </tr>
                </thead>

                <tbody v-if="editMode"> <!-- 수정 모드 -->
                    <v-scroll-y-transition group="true">
                        
                        <tr
                            
                            v-for="item in contractList"
                            :key="item"
                            class="text-center edit-hover-event edit-mode"
                            @click="openEditDialog(item)"
                        >
                            <td>{{item.name}}</td>
                            <td>{{item.start}} ~ {{item.end}}</td>
                            <td>{{item.rental.toLocaleString('ko-KR')}}원</td>
                            
                            <td v-if="item.status == 1 "> 임대 중 </td>
                            <td v-else> 임대 종료 </td>
                        </tr>
                        
                    </v-scroll-y-transition>
                </tbody>

                <tbody v-else>      <!-- 읽기 모드 -->
                    <v-scroll-y-transition group="true">
                        
                        <tr
                            
                            v-for="item in contractList"
                            :key="item"
                            class="text-center hover-event"
                            @click="openInfoDialog(item)"
                        >
                            <td>{{item.name}}</td>
                            <td>{{item.start}} ~ {{item.end}}</td>
                            <td>{{item.rental.toLocaleString('ko-KR')}}원</td>
                            
                            <td v-if="item.status == true "> 임대 중 </td>
                            <td v-else> 임대 종료 </td>
                        </tr>
                        
                    </v-scroll-y-transition>
                </tbody>
            </v-table>

    </v-container>

    <v-divider />

    <!------ 계약 추가------------>
    <!-- persistent -->
    <v-dialog
      v-model="addDialog"
      persistent
   >
        <v-card
            height="600px"
        >
            <v-toolbar
                dark 
                color="primary"
            >
                <v-btn
                    icon
                    dark
                    @click="addDialog = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title> 신규 계약 추가 </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                        variant="text"
                        @click="addContract()"
                        >
                        저장
                        </v-btn>
                    </v-toolbar-items>
            </v-toolbar>
            <v-container>
                <v-row>
                     <!-- 거래처 입력 -->
                    <v-autocomplete
                      v-model="client"
                      
                      
                      :items="clientList"

                      return-object
                      variant="filled"
                      color="blue-grey-lighten-2"
                      label="*거래처"
                      item-title="name"
                      item-value="item"
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item
                            v-bind="props"
                            :title="item?.raw?.name"
                            ></v-list-item>
                        </template>
                    </v-autocomplete>
                </v-row>


                <v-row>
                    <v-table>
                        <thead>
                            <tr >
                                <th >
                                    시작일
                                </th>
                                <th>
                                    종료일
                                </th>
                                <th>
                                    월 임대료
                                </th>
                                <th>
                                    현재 계약 여부
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr>
                                <td>
                                    <!-- 시작일 -->
                                    <DatePicker v-model="addStart" :update-on-input="false" :data="masks">
                                        <template v-slot="{ inputValue, inputEvents }">
                                        <input
                                            class="bg-white border px-2 py-1 rounded"
                                            :value="inputValue"
                                            v-on="inputEvents"
                                        />
                                        </template>
                                    </DatePicker>
                                </td>
                                <td>
                                    <!-- 종료일 -->
                                    <DatePicker v-model="addEnd" :update-on-input="false" :data="masks">
                                        <template v-slot="{ inputValue, inputEvents }">
                                        <input
                                            class="bg-white border px-2 py-1 rounded"
                                            :value="inputValue"
                                            v-on="inputEvents"
                                        />
                                        </template>
                                    </DatePicker>
                                </td>
                                <td>
                                    <!-- 월 임대료 입력 -->
                                    <v-text-field
                                        v-model="addRental"
                                        type="number"
                                        :rules="numberRule"
                                        
                                        color="blue-grey-lighten-2"
                                        label="단가 (단위 : 원￦)"
                                    ></v-text-field>
                                </td>
                                <td>
                                    <!-- 현재 계약 여부 -->
                                    <v-checkbox v-model="addStatus" label="임대 중" ></v-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-row>


                <!-- 임대 중인 프린터/복합기 목록 --> 
                <!-- <v-row>
                    <v-col cols="12" md="8">
                        
                        <p class="text-h7 text-center">임대 중인 프린터/복합기 목록</p>
                            
                                    <v-table>
                                        <thead>
                                            <tr>
                                                <th class="text-center">
                                                    구분
                                                </th>
                                                <th class="text-center">
                                                    제품명
                                                </th>
                                                <th class="text-center">
                                                    수량
                                                </th>
                                                <th class="text-center">
                                                    메모
                                                </th>
                                                <th class="text-center">
                                                    
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                      
                                            <tr
                                                v-for="list in rentPrinterList"
                                                :key="list" 
                                            >
                                                <td class="text-center">{{list.category}}</td>
                                                <td class="text-center">{{list.product}}</td>
                                                <td class="text-center">{{list.count}}</td>
                                                <td class="text-center">
                                               
                                                    <v-text-field
                                                        v-model="list.note"
                                                        
                                                        :counter="20"
                                                        label="메모"
                                                        
                                                    ></v-text-field>
                                                </td>

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
                                            
                                        </tbody>
                                    </v-table>
                    </v-col>

                    <v-col cols="12" md="4"> -->
                        <!-- 목록 추가 입력창 -->
                            <!-- <v-card>
                                <v-autocomplete
                                    v-model="printer"
                                    :items="printerData"
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
                                            :subtitle="item?.raw?.category"
                                        ></v-list-item>
                                    </template>
                                </v-autocomplete>
                                
                                <v-text-field
                                    v-model="count"
                                    type="number"
                                    :rules="numberRule"
                                
                                    color="blue-grey-lighten-2"
                                    label="*수량"
                                    @wheel.up.passive="()=>{this.count = this.count*1 + 1}"
                                    @wheel.down.passive="()=>{this.count = this.count*1 - 1}"
                                    
                                ></v-text-field>

                                <v-text-field
                                    v-model="note"
                                    
                                    :counter="20"
                                    label="메모"
                                    
                                ></v-text-field>  

                                <v-btn
                                    variant="flat"
                                    color="success"
                                    @click="addRentalList()"
                                >
                                    추가
                                </v-btn>

                            </v-card>       
                        
                    </v-col>
                </v-row> -->

            </v-container>
        </v-card>
    </v-dialog>

    
    <!------------------ 계약 수정 ------------>
    <!-- persistent -->
    <v-dialog
      v-model="editDialog"
      persistent
      max-width="900"
    >
        <v-card>
            <v-toolbar
                dark 
                color="primary"
            >
                <v-btn
                    icon
                    dark
                    @click="editDialog = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{this.editClientName}} 계약 수정</v-toolbar-title>
                    <!-- <v-spacer></v-spacer> -->
                    <v-toolbar-items>
                         <v-checkbox v-model="isDelete" label="계약 삭제" ></v-checkbox>
                     </v-toolbar-items>    
                    <v-toolbar-items>
                        <v-btn
                        v-if="isDelete"
                        variant="text"
                       
                        >
                        삭제
                        </v-btn>

                        <v-btn
                        v-else
                        variant="text"
                        @click="editSave()"
                        >
                        저장
                        </v-btn>
                    </v-toolbar-items>
            </v-toolbar>
            <v-container>
                <v-row>
                    <v-table
                        max-height="200px"
                    >
                        <thead>
                            <tr >
                                <th >
                                    시작일
                                </th>
                                <th>
                                    종료일
                                </th>
                                <th>
                                    월 임대료
                                </th>
                                <th>
                                    현재 계약 여부
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr>
                                <td>
                                    <!-- 시작일 -->
                                    <DatePicker v-model="editStart" :update-on-input="false" :data="masks">
                                        <template v-slot="{ inputValue, inputEvents }">
                                        <input
                                            class="bg-white border px-2 py-1 rounded"
                                            :value="inputValue"
                                            v-on="inputEvents"
                                        />
                                        </template>
                                    </DatePicker>
                                </td>
                                <td>
                                    <!-- 종료일 -->
                                    <DatePicker v-model="editEnd" :update-on-input="false" :data="masks">
                                        <template v-slot="{ inputValue, inputEvents }">
                                        <input
                                            class="bg-white border px-2 py-1 rounded"
                                            :value="inputValue"
                                            v-on="inputEvents"
                                        />
                                        </template>
                                    </DatePicker>
                                </td>
                                <td>
                                    <!-- 월 임대료 입력 -->
                                    <v-text-field
                                        v-model="editRental"
                                        type="number"
                                        :rules="numberRule"
                                        
                                        color="blue-grey-lighten-2"
                                        label="단가 (단위 : 원￦)"
                                    ></v-text-field>
                                </td>
                                <td>
                                    <!-- 현재 계약 여부 -->
                                    <v-checkbox v-model="editStatus" label="임대 중" ></v-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-row>

                <v-row>
                    <v-col cols="12" md="8">
                        <!-- 임대 중인 프린터/복합기 목록 --> 
                        <p class="text-h7 text-center">임대 중인 프린터/복합기 목록</p>
                            
                                    <v-table>
                                        <thead>
                                            <tr>
                                                <th class="text-center">
                                                    구분
                                                </th>
                                                <th class="text-center">
                                                    제품명
                                                </th>
                                                <th class="text-center">
                                                    수량
                                                </th>
                                                <th class="text-center">
                                                    메모
                                                </th>
                                                <th class="text-center">
                                                    
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                      
                                            <tr
                                                v-for="list in rentPrinterList"
                                                :key="list" 
                                            >
                                                <td class="text-center">{{list.category}}</td>
                                                <td class="text-center">{{list.product}}</td>
                                                <td class="text-center">{{list.count}}</td>
                                                <td class="text-center">
                                                    <!-- {{list.note}} -->
                                                    <v-text-field
                                                        v-model="list.note"
                                                        
                                                        :counter="20"
                                                        label="메모"
                                                        
                                                    ></v-text-field>
                                                </td>

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
                                            
                                        </tbody>
                                    </v-table>
                    </v-col>

                    <v-col cols="12" md="4">
                        <!-- 목록 추가 입력창 -->
                            <v-card>
                                <v-autocomplete
                                    v-model="printer"
                                    :items="printerData"
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
                                            :subtitle="item?.raw?.category"
                                        ></v-list-item>
                                    </template>
                                </v-autocomplete>
                                
                                <v-text-field
                                    v-model="count"
                                    type="number"
                                    :rules="numberRule"
                                
                                    color="blue-grey-lighten-2"
                                    label="*수량"
                                    @wheel.up.passive="()=>{this.count = this.count*1 + 1}"
                                    @wheel.down.passive="()=>{this.count = this.count*1 - 1}"
                                    
                                ></v-text-field>

                                <v-text-field
                                    v-model="note"
                                    
                                    :counter="20"
                                    label="메모"
                                    
                                ></v-text-field>  

                                <v-btn
                                    variant="flat"
                                    color="success"
                                    @click="addRentalList()"
                                >
                                    추가
                                </v-btn>

                            </v-card>       
                        
                    </v-col>
                </v-row>

            </v-container>
        </v-card>
    </v-dialog>


    <!------ 계약 세부 정보 ------------>
    <!-- <v-scroll-y-transition group="true"> -->
    <v-dialog
      v-model="infoDialog"
      transition="dialog-bottom-transition"
    >
        <v-container>
            
            <v-row>
                <!-- <v-col cols="12" md="7"> -->
                <v-col>
                    <!-- 임대 중인 프린터/복합기 목록 --> 
                    <v-card>
                        <p class="text-h5 text-center mt-3 ">{{this.contract.name}}</p>
                        <p class="text-h7 text-center">임대 중인 프린터/복합기 목록</p>
                            <v-card-text>
                                    <v-table>
                                        <thead>
                                            <tr>
                                                <th class="text-center">
                                                    구분
                                                </th>
                                                <th class="text-center">
                                                    제품명
                                                </th>
                                                <th class="text-center">
                                                    수량
                                                </th>
                                                <th class="text-center">
                                                    메모
                                                </th>
                                                <!-- <th class="text-center">
                                                    
                                                </th> -->
                                            </tr>
                                        </thead>
                                        <tbody>
                                      
                                            <tr
                                                v-for="list in rentPrinterList"
                                                :key="list" 
                                            >
                                                <td class="text-center">{{list.category}}</td>
                                                <td class="text-center">{{list.product}}</td>
                                                <td class="text-center">{{list.count}}</td>
                                                <td class="text-center">{{list.note}}</td>

                                                <!-- <td class="text-left">
                                                    <v-tooltip text="삭제">
                                                        <template v-slot:activator="{ props }">
                                                        <v-icon 
                                                            v-bind="props"
                                                            icon="mdi-delete"
                                                            @click="deleteList(list)"
                                                        ></v-icon>
                                                        </template>
                                                    </v-tooltip>

                                                </td> -->
                                            </tr>
                                            
                                        </tbody>
                                    </v-table>
                            </v-card-text>
                        </v-card>
                    
                </v-col>

             
            </v-row>              
        </v-container>
    </v-dialog>
    
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
            //추가 창
            addDialog: false,
            //계약 상세 내용 창
            infoDialog: false,

            //수정 여부
            editMode: false,
            //수정 창
            editDialog: false,
            //삭제 모드 활성화
            isDelete: false,


            //계약 정보
            contract: [],
            contractList: [],

            //임대 중인 프린터 목록
            rentPrinterList: [],

            //프린터 DB 정보
            printerData: [],

            //임대하려는 프린터 정보 입력창
            printer: null,
            category: '',
            product: '',
            count: 1,
            note: ' ',

            client: [],
            clientList: [],

            addClientName: '',
            addStart: new Date(),
            addEnd: new Date(),
            addRental: 0,
            addStatus: true,

            editClientName: '',
            editStart: '',
            editEnd: '',
            editRental: 0,
            editStatus: true,


            start: new Date(),
            end: new Date(),

            masks: {
                input: 'YYYY-MM-DD'
            },

            date: '',

            //selectDate: new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
            numberRule: [
                v => !!v || '필수 입력 값 입니다!',
                v => (v && v * 1 > 0) || '양수만 입력 가능!',
            ]
        }
    },

    methods: {
        dateFormat(date) {
            return new Intl.DateTimeFormat('fr-ca', { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
        },

        //계약 정보 가져오기
        getContractData() {
            axios.get(ip + `/contract`).then((res) => {
                this.contractList = [...res.data.contractList]
                // id / client_id(Client.name) / start / end / rental / status

            }).finally(() => {

            })
        },

        //계약 상세 내용 창 열기
        openInfoDialog(item) {
            this.infoDialog = !this.infoDialog;
            this.contract = item;
            this.getRentPrinterList(item.id)
        },

        //계약 추가 창 열기
        openAddDialog() {
            this.addDialog = true;
            this.rentPrinterList = [];
            this.getClientList()
            this.getPrinterData()
        },

        //계약 상세 내용 수정 창 열기
        openEditDialog(item) {
            this.editDialog = !this.editDialog;
            this.contract = item;
            console.log(item.status)
            this.getRentPrinterList(item.id)
            this.getPrinterData()
        },

        //렌탈 중인 프린터 리스트
        getRentPrinterList(id) {
            axios.get(ip + `/contract/list?data=${id}`).then((res) => {
                this.rentPrinterList = [...res.data.contractPrinterList]


            }).finally(() => {
                //console.log(this.rentPrinterList)
            })
        },

        //프린터/복합기 정보 목록
        getPrinterData() {
            axios.get(ip + `/contract/product`).then((res) => {
                this.printerData = [...res.data]


            }).finally(() => {
                console.log(this.printerData)
            })
        },

        //거래처 리스트 가져오기
        getClientList() {
            axios.get(ip + '/list', { params: { type: '고객' } }).then((res) => {

                this.clientList = [...res.data.clientList];
            })
        },

        //임대 중인 목록에 추가
        addRentalList() {
            if (this.printer == null) {
                alert('입력값을 채워주세요!')
            }
            else {
                let exist = -1;

                //만약 목록에 있는 품목이면 목록에 있는 품목의 수량만 증가
                this.rentPrinterList.forEach(object => {
                    if (object.product === this.printer.name) {
                        object.count = this.count * 1 + object.count * 1;
                        exist = 1;
                    }
                })

                if (exist != 1) {
                    this.rentPrinterList.push({
                        category: this.printer.category,
                        product: this.printer.name,
                        count: this.count,
                        note: this.note
                    })
                }
            }
        },

        //임대 중인 목록에서 제거
        deleteList(list) {
            this.rentPrinterList.splice(this.rentPrinterList.indexOf(list), 1)
        },

        //신규 계약 추가
        addContract() {
            if (this.client.name == null) {
                alert('거래처를 선택해주세요!')
            } else {

                axios.post(ip + '/contract/add', {
                    addData: {
                        client_ID: this.client.id,

                        start: this.dateFormat(this.addStart),
                        end: this.dateFormat(this.addEnd),
                        rental: this.addRental,
                        status: this.addStatus
                    }
                }).then((res) => {
                    console.log(res);
                    alert("success!")
                }).catch((err) => {
                    console.log(err);
                    alert(err);
                }).finally(() => {
                    //console.log("항상 마지막에 실행");
                    this.addDialog = false;
                    this.client = null;
                    this.addStart = new Date()
                    this.addEnd = new Date()
                    this.addRental = 0;
                    this.getContractData()
                })
            }

        },

        //수정 저장
        editSave() {
            axios.post(ip + '/contract/edit', {
                editData: {
                    rentList: this.rentPrinterList,

                    id: this.contract.id,

                    start: this.dateFormat(this.editStart),
                    end: this.dateFormat(this.editEnd),
                    rental: this.editRental,
                    status: this.editStatus
                }
            }).then((res) => {
                console.log(res);
                alert("success!")
            }).catch((err) => {
                console.log(err);
                alert(err);
            }).finally(() => {
                //console.log("항상 마지막에 실행");
                this.editDialog = false;
                this.product = null;
                this.count = 1;
                this.getContractData()
            })
        },



    },

    watch: {

        //상세 내용창이 열렸을 경우
        infoDialog() {
            // this.editClientName = this.contract.name
            // this.editStart = this.contract.start
            // this.editEnd = this.contract.end
            // this.editRental = this.contract.rental
            // this.editStatus = this.contract.status
            //if (this.infoDialog) {
            //this.getRentPrinterList(this.contract.id)
            //}
        },

        //수정창이 열렸을 경우
        editDialog() {
            this.editClientName = this.contract.name

            this.editStart = new Date(this.contract.start)
            this.editEnd = new Date(this.contract.end)

            this.editRental = this.contract.rental

            if (this.contract.status) this.editStatus = true
            else this.editStatus = false

        },

        editMode() {
            //console.log(this.editMode)
        }
    },

    mounted() {
        this.getContractData()
    }

}
</script>
<style>
.edit-hover-event:hover {
    color: white;
    background-color: red;
    cursor: pointer;
}
</style>