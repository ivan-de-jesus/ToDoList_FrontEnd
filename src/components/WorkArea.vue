<template>
  <div>
    <v-row cols="12">
      <div class="pa-6">
        <v-btn
          class="ma-2"
          :loading="loadingPending"
          :disabled="loadingPending"
          color="primary"
          @click="loaderPending = 'loadingPending'"
        >
          Pending tasks
        </v-btn>
      </div>

      <div class="pa-6">
        <v-btn
          class="ma-2"
          :loading="loadingCompleted"
          :disabled="loadingCompleted"
          color="success"
          @click="loaderCompleted = 'loadingCompleted'"
        >
          Completed tasks  
        </v-btn>
      </div>
    </v-row>

    <v-row class="ms-5">
      <v-col  cols="8">
        <TableCrud />
      </v-col>
      <v-col cols="4">
        <TimeLine :dataTask="newItem" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
//import { mapGetters, mapActions } from "vuex";

// @ is an alias to /src
import TableCrud from "@/components/TableCrud.vue";
import TimeLine from "@/components/TimeLine.vue";

export default {
  name: "WorkArea",
  components: {
    TableCrud,
    TimeLine,
  },
  data: () => ({
 
    loaderPending: null,
    loaderCompleted: null,

    loadingCompleted: false,
    loadingPending: false,
   

    newItem: [],
  }),

  watch: {
  
    loaderPending() {
      const l = this.loaderPending;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 1000);

      this.loaderPending = null;
    },
    loaderCompleted() {
      const l = this.loaderCompleted;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 1000);
      this.loaderCompleted = null;
    },
   
  },

  created() {},

  methods: {
    setItems(data) {
      this.records = data;
      this.records.creationDate = data.creation_date;
    },

    dateFormatUTC() {
      const f = new Date();
      let day = f.getDate();
      let month = ("0" + (f.getMonth() + 1)).toString().slice(-2);
      let year = f.getFullYear();
      let hours = ("0" + f.getUTCHours()).toString().slice(-2);
      let min = ("0" + (f.getMinutes() + 1)).toString().slice(-2);
      let dateReportNewFormat =
        day + "-" + month + "-" + year + " " + hours + ":" + min;
      return dateReportNewFormat;
    },
  },
  computed: {},
};
</script>
