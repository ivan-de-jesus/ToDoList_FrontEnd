<template>
  <v-data-table
    :headers="eventsHeaders"
    :items="records"
    sort-by="task"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Task
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.title"
                      label="Title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.description"
                      label="Description"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCompeted" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you have finished this task?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeCompleted"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="completedConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="primary" small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon color="error" small class="mr-2" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
      <v-icon color="success" small @click="completedTask(item)">
        mdi-check
      </v-icon>
    </template>
    <!--<template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>-->
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
  name: "TableCrud",

  data: () => ({
    eventsHeaders: [
      {
        text: "Title",
        align: "left",
        sortable: false,
        value: "title",
        width: "5%",
      },
      {
        text: "Description",
        value: "description",
        width: "8%",
        visible: false,
      },
      {
        text: "Creation date",
        value: "creation_date",
        width: "4%",
        visible: false,
      },
      {
        text: "Completed date",
        value: "completedDate",
        width: "4%",
        visible: false,
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: "5%",
        visible: false,
      },
    ],
    records: [],
    dialog: false,
    dialogDelete: false,
    dialogCompeted: false,
    creationDate: "",
    //records: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      title: "",
      description: "",
      creation_date: null,
      end_date: null,    
      task_status: false,
    },
    selectedItem: {},
    defaultItem: {
      title: "",            
      description: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Task" : "Edit Task";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogCompeted(val) {
      val || this.closeCompleted();
    },
  },

  created() {
    this.getItems();
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.records.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.selectedItem.id = item.id;
      this.editedIndex = this.records.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    completedTask(item) {
      this.editedIndex = this.records.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogCompeted = true;
    },

    deleteItemConfirm() {
      this.records.splice(this.editedIndex, 1);
      this.closeDelete();
      this.deleteItemServices();
    },
    completedConfirm() {
      this.records.splice(this.editedIndex, 1);
      this.editedItem.completedDate = this.dateFormatUTC();
      this.editedItem.taskStatus = true;
      this.records.push(this.editedItem);
      this.closeCompleted();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeCompleted() {
      this.dialogCompeted = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.addItem(this.editedItem);
      this.close();
    },

    getItems() {
      axios
        .get("http://localhost:3000/api/todolist")
        .then((response) => {
          this.records = response.data.body;
        })
        .catch((error) => {
          console.log("There was an error: " + error);
        });
    },

    addItem(data) {
      axios.post("http://localhost:3000/api/todolist", data).then((result) => {
        let resultData = JSON.parse(result.config.data);
        this.getItems();
      });
    },

    deleteItemServices() {
      axios
        .delete("http://localhost:3000/api/todolist", {
          data: { id: this.selectedItem.id },
        })
        .then((response) => {
          this.getItems();
        })
        .catch((error) => {
          console.log("There was an error: " + error);
        });
    },

    dateFormatUTC() {
      let f = new Date();
      let day = f.getDate();
      let month = ("0" + (f.getMonth() + 1)).toString().slice(-2);
      let year = f.getFullYear();
      let hours = ("0" + f.getUTCHours()).toString().slice(-2);
      let min = ("0" + (f.getMinutes() + 1)).toString().slice(-2);
      this.creationDate =
        day + "-" + month + "-" + year + " " + hours + ":" + min;

      return this.creationDate;
    },
  },
};
</script>
