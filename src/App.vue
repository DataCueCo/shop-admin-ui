<template>
  <div id="main-container" v-loading="!pageReady">
    <el-select
      v-if="storeList && storeList.length > 1"
      :value="currentStoreId"
      placeholder="Please choose a store"
      @input="setCurrentStoreId"
    >
      <el-option
        v-for="item in storeList"
        :key="item.website_id"
        :label="item.name"
        :value="item.website_id">
      </el-option>
    </el-select>
    <el-tabs v-model="activeTab" type="border-card" style="margin-top: 20px;" @tab-click="handleClick">
      <el-tab-pane label="Settings" name="settings">
        <settings :key="currentStoreId" />
      </el-tab-pane>
      <el-tab-pane v-if="currentStoreId" label="Recommendation" name="recommendations">
        <recommendations :key="currentStoreId" />
      </el-tab-pane>
      <el-tab-pane v-if="currentStoreId" label="Custom CSS" name="custom_css">
        <custom-css :key="currentStoreId" />
      </el-tab-pane>
      <el-tab-pane v-if="currentStoreId" label="Sync Status" name="sync_status">
        <sync-status :key="currentStoreId" />
      </el-tab-pane>
      <el-tab-pane label="Logs" name="logs">
        <log />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Settings from '@/components/Settings.vue';
import Recommendations from '@/components/Recommendations.vue';
import CustomCss from '@/components/CustomCss.vue';
import SyncStatus from '@/components/SyncStatus.vue';
import Log from '@/components/Log.vue';

export default {
  name: 'app',
  components: {
    Settings,
    Recommendations,
    CustomCss,
    SyncStatus,
    Log,
  },
  data() {
    return {
      activeTab: 'settings',
    };
  },
  computed: {
    ...mapState({
      storeList: state => state.storeList,
      currentStoreId: state => state.currentStoreId,
    }),
    ...mapGetters({
      pageReady: 'pageReady',
    }),
  },
  methods: {
    ...mapActions([
      'fetchStoreList',
      'setCurrentStoreId',
    ]),
    handleClick() {},
  },
  mounted() {
    this.fetchStoreList();
  },
};
</script>

<style lang="scss" scoped>
#main-container {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
