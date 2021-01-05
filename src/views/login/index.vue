<template>
  <el-row class="login-container" :gutter="5">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form clearfix"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          autocomplete="off"
          placeholder="用户名"
        ></el-input>
        <svg-icon iconClass="username" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
          placeholder="密码"
        ></el-input>
        <svg-icon iconClass="password-1" />
      </el-form-item>
      <div class="clearfix">
        <el-col :sm="16" :xs="16" class="code-box">
          <el-form-item prop="code">
            <el-input
              v-model="loginForm.code"
              autocomplete="off"
              placeholder="验证码"
            >
            </el-input>
            <svg-icon iconClass="password-1" />
          </el-form-item>
        </el-col>
        <el-col :sm="8" :xs="8">
          <div class="code" @click="changeCode">{{ code }}</div>
        </el-col>
      </div>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleLogin('loginForm')"
          :loading="loading"
          >立即登录</el-button
        >
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import { testPwd } from "../../utils/reg";
export default {
  name: "Login",
  data() {
    return {
      code: "1234",
      loading: false,
      loginForm: {
        username: "",
        password: "",
        code: "",
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "请输入邮箱" }],
        password: [{ required: true, trigger: "blur", validator: testPwd }],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      },
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.code === this.loginForm.code) {
            this.loading = true;
            this.loginForm.client = "admin";
            this.$store
              .dispatch("user/login", this.loginForm)
              .then((res) => {
                if (res.status == 200) {
                  this.$router.push({ path: this.redirect || "/" });
                }
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.$message({
              message: "验证码不正确",
              onClose: () => {
                this.changeCode();
              },
            });
          }
        }
        return false;
      });
    },
    // 点击验证码刷新验证码
    changeCode() {
      var code = "",
        codeLength = 4, //验证码的长度
        random = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789"; //随机数
      for (var i = 0; i < codeLength; i++) {
        //循环操作
        var index = Math.floor(Math.random() * random.length); //取得随机数的索引（0~35）
        code += random.charAt(index); //根据索引取得随机数加到code上
      }
      this.code = code.toLowerCase(); //把code值赋给验证码
    },
    keyDown(e) {
      //如果是回车则执行登录方法
      if (e.keyCode == 13) {
        this.handleLogin();
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
    this.changeCode();
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    // color: $cursor;
    padding-left: 30px;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  background: url("~@/assets/img/login-background.jpg");
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  justify-content: center;
  display: flex;
  align-items: center;

  .login-form {
    background: white;
    border-radius: 5px;
    color: #707070;
    width: 400px;
    padding: 25px;
    .code {
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      color: #009688;
      font-family: LilyUPC;
      letter-spacing: 5px;
      cursor: pointer;
      user-select: none;
    }
    svg {
      position: absolute;
      left: 5px;
      top: 12px;
    }
    .el-button {
      width: 100%;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 18px;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .code-box.el-col {
    padding: 0 !important;
  }
}
</style>
