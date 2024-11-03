<template>
   <v-container fluid>
      <v-row>
         <h3 class="section-title">The Team Behind Quick Bites</h3>
         <v-col>
            <div class="carousel-container">
               <div class="carousel" :style="carouselStyle">
                  <div class="card-wrapper" v-for="member in memberDetails" :key="member.name">
                     <v-card class="custom-radius card" height="200px" width="150px">
                        <v-img :src="member.image" height="100%" width="100%" cover />
                        <v-card-title class="card-title text-white text-wrap">{{ member.name }}</v-card-title>
                     </v-card>
                  </div>
               </div>
            </div>

            <div class="carousel-controls">
               <v-btn @click="prev" variant="text">
                  <v-icon>mdi-chevron-left</v-icon>Prev
               </v-btn>
               <v-btn @click="next" variant="text">
                  Next<v-icon>mdi-chevron-right</v-icon>
               </v-btn>
            </div>
         </v-col>
      </v-row>

      <v-row class="mt-5">
         <h3 class="quote text-primary-darken-1">Together, We’re <span class="text-primary">Revolutionizing</span> the
            Canteen
            Experience.
         </h3>
      </v-row>


      <v-row>
         <v-divider class="mt-5 mb-10"></v-divider>
      </v-row>

      <v-row class="mb-5">
         <p class="mb-2 text-primary"><strong>Our Mission</strong></p>
         <p>With Quick Bites, students, teachers, parents, and staff can skip the lines, customize meals, and enjoy
            fresh food with minimal hassle.</p>
      </v-row>

      <v-row>
         <p class="mb-2 text-secondary"><strong>Our Vision</strong></p>
         <p>To bring a modern, user-friendly dining experience to campus, transforming how you order, eat, and enjoy
            meals.</p>
      </v-row>
   </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

const memberDetails = ([
   { "name": "Joshua Paulo", "image": "https://i.pinimg.com/736x/72/9e/75/729e75e6eff8759a79bf0860066b8d60.jpg" },
   { "name": "Charles", "image": "https://i.pinimg.com/564x/ba/0e/8f/ba0e8fca261197d524790ce1d30fecd9.jpg" },
   { "name": "Jan Paul", "image": "https://i.pinimg.com/474x/ea/7b/eb/ea7bebb4b53131c072b4664b0ddaff27.jpg" },
   { "name": "Christian Rey", "image": "https://i.pinimg.com/736x/03/2e/8b/032e8bc72db192e45a35bb1fa4b63e3b.jpg" },
   { "name": "Memphis Iverson", "image": "https://i.pinimg.com/1200x/4a/21/df/4a21df13ac9137d0127384d78c2fd2e6.jpg" },
   { "name": "Joreme", "image": "https://i.pinimg.com/736x/14/fe/34/14fe346b296c2475df1918f048ecffc0.jpg" },
]);

const currentIndex = ref(0);

const next = () => {
   currentIndex.value = (currentIndex.value + 1) % memberDetails.length;
};

const prev = () => {
   currentIndex.value = (currentIndex.value - 1 + memberDetails.length) % memberDetails.length;
};

const carouselStyle = computed(() => {
   const offset = -currentIndex.value * 130;
   return {
      transform: `translateX(${offset}px)`
   };
});
</script>

<style scoped>
.page-title {
   translate: -15px;
}

.carousel-container {
   overflow: hidden;
   position: relative;
}

.carousel {
   display: flex;
   transition: transform 0.5s ease;
}

.card-wrapper {
   min-width: 160px;
}

.carousel-controls {
   display: flex;
   justify-content: space-between;
   margin-top: 16px;
}

.card {
   position: relative;
}

.card-title {
   position: absolute !important;
   bottom: 0;
   background-image: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
   width: 100%;
   font-size: 14px;
   padding-bottom: 10px;
}
</style>
