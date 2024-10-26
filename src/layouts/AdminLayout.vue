<template>
    <v-layout>
        <AdminSidebar />
        <v-main>
            <slot />
        </v-main>

        <Receiver />
    </v-layout>
</template>

<script setup>
// Any specific admin-related logic can go here
</script>
