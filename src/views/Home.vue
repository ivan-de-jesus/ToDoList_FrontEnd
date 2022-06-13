<template>
  <v-row>
    <WorkArea />
  </v-row>
</template>

<script>
// @ is an alias to /src
import TableCrud from "@/components/TableCrud.vue";
import TimeLine from "@/components/TimeLine.vue";

import WorkArea from "@/components/WorkArea.vue";

export default {
  name: "Home",
  components: {
    TableCrud,
    TimeLine,
    WorkArea,
  },
};
</script>
