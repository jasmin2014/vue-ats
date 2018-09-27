<!-- 修改密码 -->
<template>
  <div class="boxContainer">
    <div class="box">
      <div class="title">修改密码</div>
      <div class="input">
        <label for="oldPwd">输入旧密码</label>
        <input type="password" name="oldPwd" id="oldPwd" @focus="onInputFocus" @blur="onInputBlur">
        <span class="spin"></span>
      </div>
      <div class="input">
        <label for="pwd">输入新密码</label>
        <input type="password" name="pwd" id="pwd" @focus="onInputFocus" @blur="onInputBlur">
        <span class="spin"></span>
      </div>
      <div class="input">
        <label for="rePwd">重新输入密码</label>
        <input type="password" name="rePwd" id="rePwd" @focus="onInputFocus" @blur="onInputBlur">
        <span class="spin"></span>
      </div>
      <div class="button login active">
        <button @click="onClick">
          <span v-if="!loading">确定</span>
          <span v-if="loading" class="loading">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <rect x="0" y="13" width="4" height="5" fill="#333">
                <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite" />
              </rect>
              <rect x="10" y="13" width="4" height="5" fill="#333">
                <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              </rect>
              <rect x="20" y="13" width="4" height="5" fill="#333">
                <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              </rect>
            </svg>
          </span>
        </button>
      </div>
      <div class="overbox">
        <div class="material-button" @click="login">
          <span> 登录 </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false
      }
    },
    methods: {
      onInputFocus(el) {
        el.target.parentElement.className = 'input active';
      },
      onInputBlur(el) {
        if (!el.target.value) {
          el.target.parentElement.className = 'input';
        }
      },
      onClick(el) {
        const className = el.target.parentElement.className;
        el.target.parentElement.className += ' active';
        this.loading = true;
        setTimeout(() => {
          el.target.parentElement.className = className;
        }, 150);
        this.$router.push('/login');
      },
      login() {
        this.$router.push('/');
      }
    }
  }
</script>
