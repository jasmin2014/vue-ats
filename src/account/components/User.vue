<!-- 个人中心 -->
<template>
  <div class="boxContainer wrapper">
    <div class="box">
      <div class="title">个人中心</div>
      <div class="flex">
        <div class="item">
          <span class="label">姓名：</span>
          <b>白子画</b>
        </div>
        <div class="item">
          <span class="label">邮箱：</span>
          <b>baizihua@tairanchina.com</b>
        </div>
        <div class="item">
          <span class="label">手机号：</span>
          <b>13812341234</b>
        </div>
        <div class="item">
          <span class="label">职位：</span>
          <b>掌门</b>
        </div>
        <div class="item">
          <span class="label">部门：</span>
          <b>长老会</b>
        </div>
        <div class="item">
          <span class="label">公司：</span>
          <b>长留派</b>
        </div>
      </div>
      <div class="button">
        <button @click="onClick">
          <span>返回</span>
        </button>
      </div>
    </div>
    <div class="overbox">
      <div class="material-button" @click="reset">
        <span> 修改密码 </span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      reset() {
        console.log('a');
        this.$router.push('/modify');
      },
      onClick() {
        window.history.back(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    max-width: 800px;
  }

  .flex {
    margin-top: 30px;
    float: left;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    .item {
      width: 50%;
      height: 60px;
      flex-grow: 1;
      text-align: left;
      font-size: 20px;
      .label {
        text-align: right;
        display: inline-block;
        width: 25%;
      }
    }
  }

  .button {
    float: left;
    width: 20%;
    height: 30px;
    left: 40%;
    position: relative;
    margin-top: 10px;
    button {
      position: relative;
      width: 100%;
      line-height: 50px;
      cursor: pointer;
      left: 0%;
      background-color: #ED2553;
      border-radius: 30px;
      border: 0;
      font-weight: 900;
      font-size: 18px;
      color: #fff;
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
    }
  }

  .button.active {
    button {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
    }
  }
</style>
