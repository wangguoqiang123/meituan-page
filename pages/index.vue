<template>
  <div class="page-index">
    <el-row>
      <el-col :span="9">
        <emenu />
      </el-col>
      <el-col :span="15">
        <life />
      </el-col>
    </el-row>
    <el-row>
      <artistic />
    </el-row>
  </div>
</template>

<script>
import Emenu from '@/components/index/emenu.vue'
import Life from '@/components/index/life.vue'
import Artistic from '@/components/index/artistic.vue'

export default {
  components: {
    Emenu,
    Life,
    Artistic
  },
  layout: 'blank'
}
</script>

<style lang="scss">
@import '@/assets/css/index/index.scss';
</style>
