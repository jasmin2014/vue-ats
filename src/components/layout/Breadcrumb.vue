<template>
  <el-row class="breadcrumb">
    <el-col :span="20">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item v-for="(route, index) in breadcrumb" :key="index" v-if="route.meta.title"
                            :to="index === breadcrumb.length - 1 ? undefined : route.path">{{ route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="4">
      <span class="back"
            @click="routerBack">
        <i class="el-icon el-icon-back right"
           title="返回"
           style="cursor: pointer;"></i>
        返回
      </span>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: ['breadcrumb'],
    methods: {
      routerBack() {
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="scss">
  .breadcrumb {
    .back {
      float: right;
      font-size: 14px;
      color: #868d9a;
      cursor: pointer;

      i {
        display: inline-block;
        transform: scale(0.8);
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #868d9a;
        font-size: 12px;
      }

      &:hover {
        color: #0068ff;

        i {
          border-color: #0068ff;
        }
      }
    }

    .el-breadcrumb__inner {
      font-weight: normal;
      color: #868d9a;
      font-size: 14px;

      &:hover {
        color: #0068ff;
      }
    }

    .el-breadcrumb__item {
      &:last-child {
        .el-breadcrumb__inner {
          font-weight: normal;
          color: #868d9a;
        }
      }
    }
  }
</style>

