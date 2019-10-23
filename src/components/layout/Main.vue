<template>
  <div class="wrap">
    <app-header :title="title"></app-header>
    <div class="main">
      <app-sidebar :active="activeMenu"></app-sidebar>
      <div class="layout-wrap">
        <app-breadcrumb :breadcrumb='breadcrumb'></app-breadcrumb>
        <div class="layout">
          <div class="box">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppHeader from './Header';
  import AppSidebar from './SideBar';
  import AppBreadcrumb from './Breadcrumb';
  import {getAllSysEnum} from '../../api/enum';
  import {getQiniuToken} from '../../api/common';

  export default {
    name: 'app-main',
    components: {
      'app-header': AppHeader,
      'app-sidebar': AppSidebar,
      'app-breadcrumb': AppBreadcrumb
    },
    data() {
      return {
        breadcrumb: this.$route.matched,
        activeMenu: this.$route.matched[2] ? this.$route.matched[2].path : this.$route.path,
        title: this.$route.matched[0].meta.title
      };
    },
    created() {
      this.getQiniuToken();
      this.getSysEnums();
      this.$saveRouterInstance(this.$router);
      this.$saveStoreInstance(this.$store);
    },
    methods: {
      getQiniuToken() {
        getQiniuToken().then(({data}) => {
          if (data.code === 200) {
            this.$store.commit('saveQiniuToken', data.body);
          }
        }, () => {})
      },
      getSysEnums() {
        getAllSysEnum().then(response => {
          const res = response.data;
          if (res.code === 200) {
            const enums = res.body.reduce((accumulator, item) => {
              const key = `${item.kind}.${item.group}`;
              accumulator[key] = accumulator[key] || [];
              accumulator[key].push({
                text: item.displayName,
                value: item.enumKey,
                visible: item.visible
              });
              return accumulator
            }, {});
            this.$store.commit('saveSysEnums', enums);
          }
        }, () => {})
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.breadcrumb = to.matched;
      this.breadcrumb[0].path = '/';
      this.activeMenu = to.matched[2] ? to.matched[2].path : to.fullPath;
      this.title = to.matched[0].meta.title;
      next();
    },
    beforeRouteLeave(to, from, next) {
      this.breadcrumb = to.matched;
      this.breadcrumb[0].path = '/';
      this.activeMenu = to.matched[2] ? to.matched[2].path : to.fullPath;
      this.title = to.matched[0].meta.title;
      next();
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .wrap {
    overflow-x: auto;
    width: 100vw;
    height: 100vh;
    background: #f2f6fa;

    .header, .main {
      min-width: 960px;
    }

    & > .main {
      width: 100%;
      height: calc(100vh - 60px);
      flex-wrap: nowrap;
      text-align: left;
      position: relative;

      .side-bar {
        width: 200px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .layout-wrap {
        position: absolute;
        left: 200px;
        top: 0;
        padding: 0 40px 60px;
        width: calc(100% - 200px);
        height: 100%;

        .breadcrumb {
          box-sizing: border-box;
          padding: 20px 0;
          height: 60px;
        }

        .layout {
          overflow: auto;
          width: 100%;
          height: calc(100% - 60px);
          background: #ffffff;
          border-radius: 3px;
          border: 1px solid #d7dce6;

          .box {
            padding: 20px;
            min-width: 1040px;
          }
        }
      }
    }
  }
</style>
