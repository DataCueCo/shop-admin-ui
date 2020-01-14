<template>
  <div id="tab-log" v-loading="loading" style="min-height: 200px;">
    <template v-if="dateList && dateList.length > 0">
      <el-select v-model="currentDate" placeholder="Please choose a store">
        <el-option v-for="date in dateList" :key="date" :label="date" :value="date"> </el-option>
      </el-select>
      <iframe
        v-if="currentDate"
        :src="logViewSrc"
        style="width: 100%; height: 500px; border: 0.5px solid #eee; margin-top: 10px;"
      ></iframe>
    </template>
    <div v-if="dateList && dateList.length === 0">There are no logs yet.</div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      loading: false,
      dateList: null,
      currentDate: null
    };
  },
  computed: {
    logViewSrc() {
      if (this.currentDate) {
        return `${window.datacueURLs.getLogView}?date=${this.currentDate}`;
      }

      return '';
    }
  },
  methods: {
    fetchDateList() {
      if (!window.datacueURLs) {
        return;
      }
      this.loading = true;
      request({
        url: window.datacueURLs.getLogDateList,
        method: 'get'
      })
        .then(res => {
          this.dateList = res.data;
          if (this.dateList.length > 0) {
            this.currentDate = this.dateList[0];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.fetchDateList();
  }
};
</script>
