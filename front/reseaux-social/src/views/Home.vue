<template>
  <h1>Bienvenue</h1>
  <div class="messages">
    <h5 class="card-header">GET Request with Async/Await</h5>
    <div class="card-body" v-for="Message in data" :key="Message">
      Total vue packages: {{ this.totalVuePackages }}
    </div>
  </div>
</template>
<script>
import { mapState, store } from "vuex";

export default {
  name: "get-request-async-await",
  data() {
    return {
      Message: [],
    };
  },
  async created() {
    // Simple GET request using fetch
    const response = await fetch("http://localhost:8080/api/messages");
    const data = await response.json();
    this.totalVuePackages = data;

    console.log(this.totalVuePackages);
    console.log(data);
  },
};
</script>
<style></style>
