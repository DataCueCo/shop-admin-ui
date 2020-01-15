<template>
  <div id="tab-settings" v-loading="loading">
    <template v-if="currentStoreId">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="API key" prop="api_key">
          <el-input v-model="form.api_key" :disabled="existing" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="API secret" prop="api_secret">
          <el-input
            v-model="form.api_secret"
            :disabled="existing"
            type="password"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!existing" type="primary" round @click="handleSave">Save</el-button>
          <el-button v-else type="danger" round @click="handleDisconnect"
            >DISCONNECT FROM DATACUE</el-button
          >
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
    </template>
    <h4>Here are some resources you might find helpful</h4>
    <ul class="list" style="margin-left: 20px;">
      <li>
        <a
          href="https://help.datacue.co/install/magento.html#add-recommendations"
          target="_blank"
          style="color: #8c5c85; font-weight: 600;"
          >Add banners and products to your site</a
        >
      </li>
    </ul>
    <el-divider></el-divider>
    <el-button type="success" style="margin-bottom: 20px;" round @click="loginToDataCue"
      >LOGIN TO MY DATACUE DASHBOARD</el-button
    >
    <p>
      No account yet? Sign up
      <a
        href="https://app.datacue.co/en/sign-up"
        target="_blank"
        style="color: #8c5c85; font-weight: 600;"
        >here</a
      >
    </p>
    <el-divider></el-divider>
    <h4>Support Center</h4>
    <p>
      Questions? Need help? Email us at
      <a href="mailto:support@datacue.co" target="_blank" style="color: #8c5c85; font-weight: 600;"
        >support@datacue.co</a
      >
      to speak to a real person
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from '@/utils/request';

export default {
  data() {
    return {
      loading: false,
      form: {
        api_key: '',
        api_secret: ''
      },
      existing: false,
      rules: {
        api_key: [{ required: true, message: 'API key is required', trigger: 'blur' }],
        api_secret: [{ required: true, message: 'API secret is required', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapState({
      currentStoreId: state => state.currentStoreId
    })
  },
  methods: {
    fetchApiKeyAndApiSecret() {
      if (!window.datacueURLs) {
        return;
      }
      this.loading = true;
      this.form = {
        api_key: '',
        api_secret: ''
      };
      request({
        url: window.datacueURLs.getApiKeyAndApiSecret,
        method: 'post',
        data: {
          website_id: this.currentStoreId
        }
      })
        .then(res => {
          if (!res.data) {
            this.existing = false;
          } else {
            this.existing = true;
            this.form = { ...res.data };
          }
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
            url: window.datacueURLs.setApiKeyAndApiSecret,
            method: 'post',
            data: {
              website_id: this.currentStoreId,
              api_key: this.form.api_key,
              api_secret: this.form.api_secret
            }
          })
            .then(res => {
              if (res.status === 'ok') {
                this.$notify({
                  title: 'Success',
                  message: 'The API key and API secret are saved.',
                  type: 'success'
                });
                this.existing = true;
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
    },
    handleDisconnect() {
      this.$confirm('Are you sure to disconnect?', 'Disconnect', {
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          request({
            url: window.datacueURLs.disconnect,
            method: 'post',
            data: {
              website_id: this.currentStoreId
            }
          })
            .then(res => {
              if (res.status === 'ok') {
                this.$notify({
                  title: 'Success',
                  message: 'The current website has already been disconnected.',
                  type: 'success'
                });
                this.form = {
                  api_key: '',
                  api_secret: ''
                };
                this.existing = false;
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled!'
          });
        });
    },
    loginToDataCue() {
      window.open('https://app.datacue.co', '_blank');
    }
  },
  mounted() {
    if (this.currentStoreId > 0) {
      this.fetchApiKeyAndApiSecret();
    }
  }
};
</script>
