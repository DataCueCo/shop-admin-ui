<template>
  <div id="tab-custom-css" v-loading="loading">
    <el-input
      type="textarea"
      :autosize="{ minRows: 15, maxRows: 30}"
      placeholder="Please enter your custom CSS"
      v-model="css">
    </el-input>
    <el-button type="primary" round style="margin-top: 10px;" @click="handleSave">Save</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from '@/utils/request';

export default {
  data() {
    return {
      loading: false,
      css: '',
    };
  },
  computed: {
    ...mapState({
      currentStoreId: state => state.currentStoreId,
    }),
  },
  methods: {
    fetchCss() {
      if (!window.datacueURLs) {
        return;
      }
      this.loading = true;
      request({
        url: window.datacueURLs.getCustomCss,
        method: 'post',
        data: {
          website_id: this.currentStoreId,
        },
      }).then((res) => {
        this.css = res.data.content;
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSave() {
      this.loading = true;
      request({
        url: window.datacueURLs.setCustomCss,
        method: 'post',
        data: {
          website_id: this.currentStoreId,
          css: this.css,
        },
      }).then((res) => {
        if (res.status === 'ok') {
          this.$notify({
            title: 'Success',
            message: 'The custom CSS are saved.',
            type: 'success',
          });
        } else {
          this.$notify.error({
            title: 'Error!',
            message: res.msg,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
  },
  mounted() {
    if (this.currentStoreId > 0) {
      this.fetchCss();
    }
  },
};
</script>
