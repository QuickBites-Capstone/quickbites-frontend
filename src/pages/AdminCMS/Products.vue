<template>
    <div>
        <v-card>
            <v-layout>
                <v-main>
                    <v-app class="px-5 py-5">
                        <v-col>
                            <v-col>
                                <h1 class="page-title">Products</h1>
                            </v-col>

                            <v-col>
                                <v-row>
                                    <v-card class="custom-radius d-flex align-center justify-center">
                                        <v-tabs v-model="tab" color="primary">
                                            <v-tab class="custom-radius my-auto" value="meals">Meals</v-tab>
                                            <v-tab class="custom-radius my-auto" value="snacks">Snacks</v-tab>
                                            <v-tab class="custom-radius my-auto" value="chips">Chips</v-tab>
                                            <v-tab class="custom-radius my-auto" value="candies">Candies</v-tab>
                                            <v-tab class="custom-radius my-auto" value="drinks">Drinks</v-tab>
                                            <v-tab class="custom-radius my-auto" value="supplies">Supplies</v-tab>
                                        </v-tabs>
                                    </v-card>
                                    <v-spacer class="custom-spacer"></v-spacer>
                                    <v-row class="align-center">
                                    <SearchBar :height="5" class="custom-height mr-10" />

                                    <AddNewProduct />
                                    </v-row>
                                </v-row>
                            </v-col>

                            <v-card-text>
                                <v-tabs-items v-model="tab">
                                    <v-tab-item value="meals">
                                        <ProductCategory v-if="tab === 'meals'" category="meals" />
                                    </v-tab-item>

                                    <v-tab-item value="snacks">
                                        <ProductCategory v-if="tab === 'snacks'" category="snacks" />
                                    </v-tab-item>
                                    <v-tab-item value="chips">
                                        <ProductCategory v-if="tab === 'chips'" category="chips" />
                                    </v-tab-item>
                                    <v-tab-item value="candies">
                                        <ProductCategory v-if="tab === 'candies'" category="candies" />
                                    </v-tab-item>
                                    <v-tab-item value="drinks">
                                        <ProductCategory v-if="tab === 'drinks'" category="drinks" />
                                    </v-tab-item>
                                    <v-tab-item value="supplies">
                                        <ProductCategory v-if="tab === 'supplies'" category="supplies" />
                                    </v-tab-item>

                                </v-tabs-items>
                            </v-card-text>
                        </v-col>
                    </v-app>
                </v-main>
            </v-layout>
        </v-card>
    </div>
</template>

<script setup>
import ProductCategory from '@/components/admin/ProductsComponents/ProductCategory.vue';
import { ref } from 'vue';

const tab = ref('meals');
const loading = ref(false);
</script>

<style scoped>
.custom-spacer{
    width: 0!important;
}
.custom-height{
    height: 20px!important;
}
</style>
