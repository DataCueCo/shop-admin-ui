<template>
  <div id="recommendations" v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="250px">
      <el-form-item label="Add products to product page" prop="products_status_for_product_page">
        <el-select v-model="form.products_status_for_product_page">
          <el-option label="Disabled" value="0"></el-option>
          <el-option label="Enabled" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Recommendation type" prop="products_type_for_product_page">
        <el-select v-model="form.products_type_for_product_page">
          <el-option label="All" value="all"></el-option>
          <el-option label="Recently Viewed" value="recent"></el-option>
          <el-option label="Similar to current product" value="similar"></el-option>
          <el-option label="Related Products" value="related"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="handleSave">Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from '@/utils/request';

export default {
  data() {
    return {
      form: {
        products_status_for_product_page: '0',
        products_type_for_product_page: 'all'
      },
      loading: false
    };
  },
  computed: {
    ...mapState({
      currentStoreId: state => state.currentStoreId
    }),
    rules() {
      if (this.form.products_status_for_product_page === '1') {
        return {
          products_status_for_product_page: [
            { required: true, message: 'this is required', trigger: 'blur' }
          ],
          products_type_for_product_page: [
            { required: true, message: 'this is required', trigger: 'blur' }
          ]
        };
      }
      return {
        products_status_for_product_page: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ]
      };
    }
  },
  methods: {
    fetchData() {
      if (!window.datacueURLs) {
        return;
      }
      this.loading = true;
      request({
        url: window.datacueURLs.getRecommendations,
        method: 'post',
        data: {
          website_id: this.currentStoreId
        }
      })
        .then(res => {
          const form = { ...this.form };
          if (res.data.products_status_for_product_page) {
            form.products_status_for_product_page = res.data.products_status_for_product_page;
          }
          if (res.data.products_type_for_product_page) {
            form.products_type_for_product_page = res.data.products_type_for_product_page;
          }
          this.form = form;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          request({
            url: window.datacueURLs.setRecommendations,
            method: 'post',
            data: {
              website_id: this.currentStoreId,
              ...this.form
            }
          })
            .then(res => {
              if (res.status === 'ok') {
                this.$notify({
                  title: 'Success',
                  message: 'Recommendation settings saved.',
                  type: 'success'
                });
              } else {
                this.$notify.error({
                  title: 'Error!',
                  message: res.msg
                });
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
