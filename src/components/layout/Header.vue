<!-- header -->
<template>
  <div class="header">
    <div class="logo">
      <router-link to="/">
        <img src="../../pages/img/logo-white.png" alt="">
      </router-link>
    </div>
    <div class="title" :class="end.length > 0 ? 'dropdown' : ''">
      <el-dropdown v-if="end.length > 0"
                   class="switch"
                   trigger="click"
                   placement="bottom-start">
        <h2 class="el-icon el-icon-arrow-down">{{ title }}</h2>
        <el-dropdown-menu class="switch-dropdown-list" slot="dropdown">
          <a v-for="item in end"
             :href="item.path"
             :key="item.name">
            <el-dropdown-item>{{ item.name }}</el-dropdown-item>
          </a>
        </el-dropdown-menu>
      </el-dropdown>
      <h2 v-else>{{ title }}</h2>
    </div>
    <div class="toolbar">
      <download></download>
      <el-dropdown class="user"
                   trigger="click"
                   placement="bottom">
        <div class="user-info">
          <div class="avatar">
            <img :src="user.avatar" alt="">
          </div>
          <div class="info">
            <p class="username">{{ user.realName }}<span class="phone">({{ user.phone }})</span></p>
            <p class="company">{{ user.companyName }}</p>
          </div>
          <i class="dropdown-arrow el-icon el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu class="user-dropdown-list" slot="dropdown">
          <div @click="handleReset">
            <el-dropdown-item><i class="fa fa-edit"></i> 重置密码</el-dropdown-item>
          </div>
          <div @click="handleExit">
            <el-dropdown-item><i class="fa fa-power-off"></i> 退出登录</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="showResetDialog"
               title="重置密码"
               width="480px"
               @close="handleResetDialogClose">
      <reset ref="reset"
             @done="handleResetDone"
             @cancel="handleResetCancel"></reset>
    </el-dialog>
  </div>
</template>

<script>
  import Download from '../download/Download.vue';
  import Reset from '../../modules/user/Reset.vue';
  import {getLoginUser, logout} from '../../api/account';
  const BUSINESS_END_LIST = [
    {
      path: '/funds.html',
      name: '资金端'
    },
    {
      path: '/assets.html',
      name: '资产端'
    },
    {
      path: '/center.html',
      name: '资产中心'
    },
    {
      path: '/chain-funds.html',
      name: '链上资金端'
    },
    {
      path: '/chain-assets.html',
      name: '链上资产端'
    }
  ];

  export default {
    props: {
      title: String
    },
    data() {
      return {
        user: {},
        endPaths: [],
        showResetDialog: false
      }
    },
    computed: {
      end() {
        return this.endPaths.filter(_ => _.name !== this.title)
      }
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      handleExit() {
        this.$confirm('您确定要退出账号?', '退出提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$logout(() => {
            location.href = '/account';
          })
        }).catch(() => {});
      },
      handleReset() {
        this.showResetDialog = true;
      },
      handleResetDone() {
        this.showResetDialog = false;
      },
      handleResetCancel() {
        this.showResetDialog = false;
      },
      handleResetDialogClose() {
        this.$refs.reset.resetFields();
      },
      getUserInfo() {
        getLoginUser().then(({data}) => {
          if (data.code === 200) {
            const user = data.body;
            if (user) {
              this.user = user;
              this.$setLocalStorage('user', user);
              this.endPaths = this.$binaryToArray(user.orgMgrPartyType || 0).map(_ => BUSINESS_END_LIST[_])
            }
          }
        }).catch((response) => {
          if (!response || response.status !== 401) {
            this.$logout(() => {
              location.href = '/account'
            })
          }
        });
      }
    },
    components: {
      Download,
      Reset
    }
  };
</script>

<style lang="scss">
  .header {
    width: 100%;
    height: 60px;
    color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    background: #ffffff;

    .logo {
      display: inline-block;
      width: 200px;
      height: 100%;
      text-align: center;
      background: #0068ff;

      a {
        vertical-align: middle;
        display: block;
        height: 100%;

        &:after {
          content: '';
          vertical-align: middle;
          display: inline;
          line-height: 60px;
        }

        img {
          vertical-align: middle;
        }
      }
    }

    .title {
      display: inline-block;
      margin-left: 20px;

      h2 {
        margin: 0;
        padding-left: 20px;
        width: 180px;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        font-weight: normal;
        border-radius: 4px;
        background: #f2f6fa;
        color: #868d9a;
      }

      &.dropdown {
        h2 {
          position: relative;
          cursor: pointer;

          &:before {
            position: absolute;
            right: 15px;
          }
        }
      }
    }

    .toolbar {
      float: right;
      margin-right: 40px;
      height: 60px;

      .download {
        float: left;
        width: 70px;
        height: 100%;
        border-left: 1px solid #e3e7ee;
        border-right: 1px solid #e3e7ee;

        & > i {
          line-height: 60px;
        }
      }

      .user {
        float: left;
        height: 100%;
        border-right: 1px solid #e3e7ee;

        .user-info {
          position: relative;
          text-align: left;
          padding: 10px;
          width: 180px;
          height: 100%;
          cursor: pointer;

          /*.avatar {*/
            /*position: absolute;*/
            /*overflow: hidden;*/
            /*left: 10px;*/
            /*top: 10px;*/
            /*width: 40px;*/
            /*height: 40px;*/
            /*border-radius: 50%;*/

            /*img {*/
              /*display: block;*/
              /*width: 100%;*/
              /*height: 100%;*/
              /*background: #e5e5e5;*/
            /*}*/
          /*}*/

          .avatar {
            display: none;
          }

          .info {
            margin-right: 25px;
            line-height: 1.5;

            p {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              margin: 0;
            }

            .username {
              font-size: 14px;
              color: #333333;
            }

            .company, .phone {
              font-size: 12px;
              color: #868d9a;
            }
          }

          .dropdown-arrow {
            position: absolute;
            display: block;
            top: 0;
            right: 10px;
            height: 100%;
            line-height: 60px;
          }
        }
      }
    }
  }

  .switch-dropdown-list, .user-dropdown-list {
    width: 180px;
    padding: 5px 0;
  }
</style>
