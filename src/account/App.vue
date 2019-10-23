<template>
  <div id="app">
    <div class="header">
      <div class="container">
        <div class="logo">
          <a href="#">
            <img v-if="logoType === 'tfabric'" src="../pages/img/logo.png" alt="">
            <img v-else-if="logoType === 'trc'" src="../pages/img/logo_trc.png" alt="">
            <img v-else-if="logoType === 'lawcert'" src="../pages/img/logo_lawcert.png" alt="">
            <img v-else src="../pages/img/logo.png" alt="">
          </a>
        </div>
        <div class="btn-group">
          <router-link :to="{ name: 'Login' }"
                       class="home-btn">登录</router-link>
        </div>
      </div>
    </div>
    <router-view class="main"></router-view>
  </div>
</template>

<script>
  let logoType;
  switch (location.hostname) {
    case 'ats.tfabric.com':
      logoType = 'tfabric';
      break;
    case 'ats.trc.com':
      logoType = 'trc';
      break;
    case 'ats.lawcert.com':
      logoType = 'lawcert';
      break;
    default:
      logoType = 'tfabric';
      break;
  }

  export default {
    name: 'app',
    data() {
      return {
        logoType
      }
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f3f6fb url("../pages/img/bg.jpg") center no-repeat;
    background-size: cover;
    color: #333333;

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 14px;
      background: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      box-shadow: 0 4px 8px rgba(192, 206, 221, 0.2);

      .logo, .btn-group {
        padding: 0 10px;
        height: 60px;

        &:after {
          content: '';
          display: inline-block;
          vertical-align: middle;
          height: 100%;
        }
      }

      .logo {
        float: left;
        width: 265px;

        img {
          vertical-align: middle;
        }
      }

      .btn-group {
        float: right;

        & > * {
          vertical-align: middle;
          height: 35px;
          cursor: pointer;
        }

        .plain-btn {
          padding: 0 15px;
          background: transparent;
          border: none;
        }

        .home-btn {
          display: inline-block;
          margin-left: 15px;
          padding: 0 20px;
          line-height: 35px;
          border-radius: 3px;
          border: 1px solid #e5e5e5;
          background: transparent;
          color: #333333;
        }
      }
    }

    .main {
      padding-top: 26vh;
      min-height: 100vh;

      .wrapper {
        margin: 0 auto;
        padding: 48px 60px;
        width: 430px;
        border-radius: 5px;
        background: #ffffff;
        box-shadow: 0 0 18px rgba(187, 193, 205, 0.5);
      }

      h2 {
        text-align: center;
        letter-spacing: 5px;
        margin-bottom: 25px;
        font-size: 30px;
        font-weight: normal;
        color: #111111;
      }

      section {
        position: relative;
        height: 44px;
        font-size: 16px;

        input {
          height: 44px;

          &.error {
            border-color: #ff5555;
          }
        }

        &.action {
          min-height: 0;

          button {
            display: block;
            width: 100%;
            height: 44px;
            font-size: 16px;
            letter-spacing: 2px;
            background: linear-gradient(90deg, #4552ff 0%, #0c95ff 100%);
            box-shadow: 0 3px 20px rgba(0, 80, 255, 0.3);
            transition: 0.3s;

            &, &:active, &:hover, &:focus, &:visited {
              border-radius: 3px;
              border: none;
            }

            &:active, &:hover, &:focus, &:visited {
              background-image: linear-gradient(90deg, #4552ff 0%, #0c95ff 100%);
              box-shadow: 0 3px 3px rgba(0, 80, 255, 0.3);
            }
          }
        }

        & + section {
          margin-top: 22px;
        }
      }
    }
  }
</style>
