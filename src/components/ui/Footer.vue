<template>
    <div class="w-100 mt-15 pb-15 border-t-sm bg-white">
        <v-col>
            <img src="../../../public/quickbites-logo.png" height="40px" />
            <v-list>
                <v-list-item to="/about">About Quick Bites</v-list-item>
                <v-list-item to="/contact">Contact us</v-list-item>
                <v-list-item to="/wallet">How to top-up</v-list-item>
            </v-list>

            <v-divider class="my-5"></v-divider>

            <v-btn icon="mdi-facebook" variant="text"
                onclick="window.open('https://www.facebook.com/profile.php?id=61558232378668', '_blank')" />
            <v-btn icon="mdi-gmail" variant="text" to="/contact" />

            <v-list>
                <v-list-item to="/terms">Terms</v-list-item>
                <v-list-item disabled><v-icon>mdi-copyright</v-icon> 2024 Quick bites</v-list-item>
            </v-list>
        </v-col>
    </div>
</template>

<script setup>
//
</script>
