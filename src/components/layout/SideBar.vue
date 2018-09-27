<!-- 侧边导航 -->
<template>
  <div class="side-bar">
    <el-menu router
             unique-opened
             :default-active="active">
      <!-- <el-menu-item index="/main/menu">返回首页</el-menu-item> -->
      <template v-for="(sub,key) in routes">
        <!-- <el-menu-item index="routes.path + '/' + sub.path" :key="sub.path"> {{ sub.name }} </el-menu-item> -->
        <el-submenu :index="sub.path" v-if="sub.meta.show" :key="sub.path">
          <template slot="title">{{ sub.meta.title || sub.name }}</template>
          <el-menu-item v-for="sec in sub.children" v-if="sec.meta.show" :key="sec.path"
                        :index="'/'  + sub.path + '/'+sec.path">
            {{ sec.meta.title || sec.name }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    props: ['active'],
    data() {
      return {
        routes: []
      }
    },
    methods: {
      // 获取当前二级路由
      getRoutes() {
        this.routes = this.$store.state.routes;
      }
    },
    created() {
      this.getRoutes();
    }
  }
</script>

<style lang='scss'>
  .side-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: calc(100vh - 40px);
    /*border: 1px solid rgb(209, 219, 229);*/
    /*box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);*/
    box-shadow: 0 4px 8px rgba(192, 206, 221, 0.2);
    background: #1e262f;
    overflow-y: auto;

    .el-menu {
      border: none;
      background: #222a34;
      color: #868d9a;

      .el-submenu__title, .el-menu-item {
        color: #868d9a;

        &:hover {
          background: #222a34;
          color: #ffffff;
        }
      }

      .el-submenu.is-active .el-submenu__title {
        color: #ffffff;
      }

      .el-submenu .el-menu {
        background: #1e262f;

        .el-menu-item {
          &.is-active {
            background: #0068ff;
            color: #ffffff;
          }
        }
      }
    }
  }
</style>
