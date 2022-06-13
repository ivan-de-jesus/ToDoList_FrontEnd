// import Vue from "vue"
// import Vuex from "vuex"
// import axios from "axios";

// Vue.use(Vuex)

// export default {
//     namespaced: true,

//     state:{
//         Items: [],
//     },

//     getters: {
//         Items(state){
//             return state.Items;
//         }
//     },

//     mutations: {
//         fillItems(state,data){
//             state.Items = data
//         }
//     },

//     actions: {
//    
//         getItems: async function ({commit}) {
//             axios
//               .get("http://localhost:3000/api/todolist")
//               .then((response) => {

//                 let newItem = response.data.body;
//                 commit('fillItems', newItem)
//               })
//               .catch((error) => {
//                 console.log("There was an error: " + error);
//               });
//           },

//     },
// }

