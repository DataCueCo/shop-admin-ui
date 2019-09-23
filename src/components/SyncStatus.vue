<template>
  <div id="tab-sync-status" v-loading="loading">
    <el-table
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="type"
        label="Data Type"
        width="180">
      </el-table-column>
      <el-table-column
        prop="total"
        label="Total"
        width="180">
      </el-table-column>
      <el-table-column
        label="Number of pending"
        width="280">
        <template slot-scope="scope">{{ scope.row.total - scope.row.completed - scope.row.failed }}</template>
      </el-table-column>
      <el-table-column
        prop="completed"
        label="Number of successes"
        width="280">
      </el-table-column>
      <el-table-column
        prop="failed"
        label="Number of failures"
        width="280">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from '@/utils/request';

export default {
  data() {
    return {
      data: [],
      timer: null,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      currentStoreId: state => state.currentStoreId,
    }),
  },
  methods: {
    fetchData() {
      if (!window.datacueURLs) {
        return;
      }
      this.loading = true;
      request({
        url: window.datacueURLs.getSyncStatus,
        method: 'post',
        data: {
          website_id: this.currentStoreId,
        },
      }).then((res) => {
        this.data = Object.keys(res.data).map(key => ({
          ...res.data[key],
          type: key,
        }));
      }).finally(() => {
        this.loading = false;
      });
    },
  },
  mounted() {
    this.fetchData();
    this.timer = setInterval(() => {
      this.fetchData();
    }, 30000);
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
