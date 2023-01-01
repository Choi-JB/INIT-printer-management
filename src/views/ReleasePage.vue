<template lang="">
    <v-card>
    
    
    
        <v-tabs v-model="tab" bg-color="primary">
    
    
    
            <v-tab v-for="i in menu" :key="i" :value="i" @click="state = i"> {{ i }}</v-tab>
    
    
    
        </v-tabs>
    
    
    
    
    
    
    
        <v-card-text>
    
    
    
            <v-card>
    
                <v-autocomplete 
                    v-model="model"
                    v-model:search="search"
                    clearable label="출고 제품을 선택해주세요" 
                    :items=stock
                    :loading="isLoading"
                    hide-no-data
                    hide-selected
                    item-title="Description"

                    prepend-icon="mdi-database-search"

                    variant="underlined"

                >
    
                </v-autocomplete>
    
            </v-card>
            <v-divider></v-divider>
    
    
            <v-window v-model="tab">
    
    
    
                <v-window-item v-for="(a,i) in menu" :key="i" :value="a">
    
                    현재 {{ state}}화면
    
                    <v-expand-transition>
    
                        <div v-if="model">
    
                            <v-list color="red-lighten-3">
                               
                                {{ fields }}
                                <!-- <v-list-item v-for="field in fields" :key="field">
    
                                    <v-list-item-header>
    
                                        <v-list-item-title>{{ field }}</v-list-item-title>
    
                                        <v-list-item-subtitle>{{ field }}</v-list-item-subtitle>
    
                                    </v-list-item-header>
    
                                </v-list-item> -->
    
                            </v-list>
    
                        </div>
    
                    </v-expand-transition>
    
    
    
    
    
    
    
                </v-window-item>
    
    
    
    
    
    
    
            </v-window>
    
    
    
        </v-card-text>
    
    
    
    </v-card>
</template>
<script>
export default {
    data: () => ({
        tab: null,
        state: "출고",
        menu: ["출고", "임대"],
        text: ["1", "2"],

        descriptionLimit: 60,
        entries: [],
        isLoading: false,
        model: null,
        search: null,

        client: ['삼보', '한국OSG'],
        stock: ['M5526', 'FS-2100', 'P3145dn'],

        item: {
            name: '',
            count: 0,
            memo: '',
            client: '',
        }
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
    }
};
</script>
<style lang="">

</style>