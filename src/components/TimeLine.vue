<template>
  <v-container style="max-width: 600px">
    <v-timeline dense clipped>
      <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
        <template v-slot:icon>
          <span>LT</span>
        </template>
       
      </v-timeline-item>
      
      <v-slide-x-transition group>
        <v-timeline-item
          v-for="event in timeline"
          :key="event.id"
          class="mb-4"
          color="pink"
          small
        >
          <v-row justify="space-between">
            <v-col cols="7" v-text="event.text"></v-col>
            <v-col class="text-right" cols="5" v-text="event.time"></v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>

      
    </v-timeline>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: [],
  data: () => ({
    events: [],
    input: null,
    nonce: 0,
  }),

  computed: {
    timeline() {
      return this.events.slice().reverse();
    },
  },

  watch:{
    dataTask: function(newVal, oldVal){
      if(newVal){
        this.setDataTask()
      }
    }
  },
  created() {
    this.getItems();
  },

  methods: {
    comment() {
      const time = new Date().toTimeString();
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time: time.replace(
          /:\d{2}\sGMT-\d{4}\s\((.*)\)/,
          (match, contents, offset) => {
            return ` ${contents   
              .split(" ")
              .map((v) => v.charAt(0))
              .join("")}`;
          }
        ),
      });

      this.input = null;
    },

     getItems() {
      axios
        .get("http://localhost:3000/api/todolist")
        .then((response) => {
          //this.setItems(response.data.body);
          let records = response.data.body;
          this.setDataTask(records)
        })
        .catch((error) => {
          console.log("There was an error: " + error);
        });
    },

    setDataTask(data){
      for (var i=0; i< data.length; i++) { 
       
        this.events.push({
          id: this.nonce++,
          text: data[i].title,
          time: data[i].creation_date
        });
      }
      
    }
  },
};
</script>
