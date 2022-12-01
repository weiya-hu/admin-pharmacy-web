<template>
  <div class="login">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/images/login_left.png" />
      </div>

      <div class="login-right">
        <el-tabs v-model="activeName" class="demo-tabs" stretch>
          <el-tab-pane label="微信扫码登录" name="first">
            <wxlogin
              :redirect_uri="redirectUri"
              :scope="'snsapi_login'"
              :theme="'black'"
              appid="wxb5823246252c172d"
              href="data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDI0MHB4O2JvcmRlcjogMDt9Ci5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9Ci5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjQwcHg7fQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9Ci5pbXBvd2VyQm94IC5zdGF0dXMge3RleHQtYWxpZ246IGNlbnRlcjt9IA=="
              state="wechat"
            >
            </wxlogin>
          </el-tab-pane>
          <el-tab-pane label="企业微信扫码登陆" name="second">
            <iframe
              :src="authUrl"
              frameborder="0"
              height="400px"
              width="100%"
            ></iframe>
          </el-tab-pane>
          <el-tab-pane label="账号密码登录" name="third">
            <el-form
              ref="loginRef"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
            >
              <div class="title-container">
                <img class="login_logo" src="@/assets/images/logo.png" />
                <h3 class="title">山海平</h3>
              </div>

              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  auto-complete="off"
                  placeholder="请输入账号"
                  size="large"
                  type="text"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="请输入密码"
                  show-password
                  size="large"
                  type="password"
                  @keyup.enter="handleLogin"
                >
                </el-input>
              </el-form-item>
              <div class="tips">
                <el-checkbox v-model="loginForm.rememberMe"
                  >记住密码
                </el-checkbox>
                <router-link
                  :to="'/register'"
                  :underline="false"
                  class="tips-pw"
                  >忘记密码？
                </router-link>
              </div>
              <el-form-item style="width: 100%">
                <el-button
                  :loading="loading"
                  size="large"
                  style="width: 100%"
                  type="primary"
                  @click.prevent="handleLogin"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { decrypt, encrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";
import { getCurrentInstance, ref } from "vue";
import { oauthLogin, wechatLogin } from "@/api/login";
import { GetQueryString } from "@/utils/validate";
import { removeToken, setToken } from "@/utils/auth";

const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const activeName = ref("first");
const loading = ref(false);
const redirect = ref(undefined);

const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
  platformProductId: "admin",
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
const register = ref(false);

//微信扫码登录回调地址
const redirectUri = encodeURIComponent("http://admin.shanhaiping.com/login");
const authUrl = `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=ww15d16db33f11c8a2&redirect_uri=${redirectUri}&state=wecom&usertype=member&href=data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIyMHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMjBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZSAgIWltcG9ydGFudH0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30g`;

//methods

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
    platformProductId: "admin",
  };
}

//账号密码登录入口
function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在cookie中设置记住用户名
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          router.push({ path: redirect.value || "home" });
        })
        .catch((val) => {
          router.push({ path: redirect.value || "home" });
          loading.value = false;
        });
    }
  });
}

// 微信登录
const getWechatLogin = () => {
  let params = {
    appId: "wxb5823246252c172d",
    authCode: GetQueryString("code"),
    corpId: "",
  };
  if (params.authCode !== "") {
    loading.value = true;
    wechatLogin(params)
      .then((res) => {
        if (res.code === 200) {
          setToken(res.data.access_token);
          router.push({ path: "/home" });
        } else {
          loading.value = false;
          window.history.pushState(null, null, "/");
          dialogVisible.value = true;
        }
      })
      .catch((e) => {
        window.history.pushState(null, null, "/");
        dialogVisible.value = true;
        loading.value = false;
      });
  } else {
    router.push({ path: "/login" });
  }
};

// 企业微信登录
function getOauthLogin() {
  let params = {
    authCode: GetQueryString("auth_code") ? GetQueryString("auth_code") : "",
    state: "qrLoginsplit",
  };
  if (params.authCode !== "") {
    loading.value = true;
    oauthLogin(params)
      .then((res) => {
        if (res.code === 200) {
          setToken(res.data.access_token);
          router.push({ path: "/home" });
        } else {
          loading.value = false;
          window.history.pushState(null, null, "/");
          // dialogUrlVisible.value = true;
        }
      })
      .catch((err) => {
        // dialogUrlVisible.value = true
        window.history.pushState(null, null, "/");
        // dialogUrlVisible.value = true;
        loading.value = false;
      });
  } else {
    router.push({ path: "/login" });
  }
}

const wecomControlLogin = () => {
  let params = {
    authCode: GetQueryString("auth_code") ? GetQueryString("auth_code") : "",
    state: "oauthLoginsplit",
  };
  if (params.authCode !== "") {
    loading.value = true;
    oauthLogin(params).then((res) => {
      if (res.code === 200) {
        setToken(res.data.access_token);
        router.push({ path: "/index" });
      } else {
        loading.value = false;
        router.push({ path: "/login" });
      }
    });
  } else {
    loading.value = false;
    router.push({ path: "/login" });
  }
};

//扫码登录入口
const login = async () => {
  if (import.meta.env == "development") {
    setToken(
      "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxNTcyNDc0NzU5NDQxNjIwOTkyLCJ1c2VyX2tleSI6IjQyNWJkOTRlOGQyNzRiM2RiZGQxMzZmNmJhZWIyYTFhIiwidXNlcm5hbWUiOiLnjovnvo7ojJwifQ.lBZ8Rx26pfxISTUycvj3Imf9NcDZYowI0dshwXBW-NLjU6HYBCXgk7F5kw3KwMfTSTmfXKu7WSzAykbPo-EiwA"
    );
    //开发环境
  } else if (import.meta.env == "production") {
    //生产环境
    removeToken();
  }

  if (GetQueryString("state") === "wecom") {
    await getOauthLogin();
  } else if (GetQueryString("state") === "wechat") {
    await getWechatLogin();
  } else if (GetQueryString("state") === "oauthLoginsplit") {
    wecomControlLogin();
  }
};

getCookie();
login();
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;

  .login-box {
    max-width: 1200px;
    height: 640px;
    background: #fff;
    padding: 50px 80px 70px 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -webkit-box-shadow: 0 1px 15px #eee;
    box-shadow: 0 1px 15px #eee;
    border-radius: 10px;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    .login-left {
      width: 550px;
      height: 429px;
      margin-right: 40px;

      img {
        width: 100%;
      }
    }

    .login-form {
      position: relative;
      //width: 400px;
      padding: 48px;
      max-width: 100%;
      margin: 0 auto;
      overflow: hidden;

      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #333;
        height: 47px;
        font-size: 17px;

        input {
          height: 40px;
        }
      }

      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 0px;
      }

      .title-container {
        position: relative;

        .login_logo {
          width: 168px;
          height: 78px;
          display: block;
          margin: 0 auto;
          margin-bottom: 30px;
        }

        .title {
          font-size: 34px;
          color: #333;
          margin-bottom: 45px;
          text-align: center;
          font-weight: bold;
        }
      }

      .tips {
        font-size: 14px;
        margin-bottom: 21px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .tips-pw {
          color: rgb(64, 158, 255);
        }
      }

      .el-form-item {
        margin-bottom: 30px;
      }
    }

    //.login-right {
    //  width: 700px;
    //  margin: 0 auto;
    //  //overflow: hidden;
    //  //padding: 0 20px 0 40px;
    //  padding: 35px 40px 0 0;
    //
    //  :deep(.el-tabs__nav) {
    //    transform: translateX(52px) !important;
    //  }
    //
    //  #pane-first {
    //    text-align: center;
    //  }
    //}
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.wecom-url {
  width: 240px;
  margin: 0 auto;
}

.wechat-url {
  width: 200px;
  margin: 0 auto;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

@media screen and (max-width: 1200px) {
  .login {
    .login-box {
      width: 500px;
      padding: 25px !important;

      .login-left {
        display: none;
      }
    }
  }
}
</style>
