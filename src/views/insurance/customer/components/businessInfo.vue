<template>
  <div class="business-info wrapper">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>经营资料</span>
          <span class="desc"
          >请填写商家的经营业务信息、售卖商品/提供服务场景信息</span
          >
        </div>
      </template>
      <el-form :model="businessInfo" :rules="rules" ref="formRef">
        <el-form-item prop="merchantShortname">
          <template #label>
            <labelExplain label="商户简称">
              <template #explain>
                <div class="content-div">
                  1、请输入2-30个字符，支持中文/字母/数字/特殊符号 <br/>
                  2、在支付完成页向买家展示，需与微信经营类目相关 <br/>
                  3、简称要求 <br/>
                  （1）不支持单纯以人名来命名，若为个体户经营，可用“个体户+经营者名称”或“经营者名称+业务”命名,如“个体户张三”或“张三餐饮店”；
                  <br/>
                  （2）不支持无实际意义的文案，如“XX特约商户”、“800”、“XX客服电话XXX”；
                  <br/>
                </div>
              </template>
            </labelExplain>
          </template>
          <el-input
              label="商户简称"
              placeholder="请输入商户简称"
              maxlength="30"
              minlength="2"
              style="width: 250px"
              v-model="businessInfo.merchantShortname"
          ></el-input>
        </el-form-item>
        <el-form-item label="客服电话" prop="servicePhone">
          <template #label>
            <labelExplain label="客服电话">
              <template #explain>
                <div class="content-div">
                  将在交易记录中向买家展示，请确保电话畅通以便平台回拨确认
                </div>
              </template>
            </labelExplain>
          </template>
          <el-input
              label="客服电话"
              placeholder="请输入客服电话"
              style="width: 250px"
              v-model="businessInfo.servicePhone"
          ></el-input>
        </el-form-item>
        <el-form-item label="经营场景" prop="salesInfo.salesScenesType">
          <template #label>
            <labelExplain label="经营场景">
              <template #explain>
                <div class="content-div">
                  1、请勾选实际售卖商品/提供服务场景（至少一项），以便为你开通需要的支付权限。<br/>
                  2、建议只勾选目前必须的场景，以便尽快通过入驻审核，其他支付权限可在入驻后再根据实际需要发起申请。
                </div>
              </template>
            </labelExplain>
          </template>
          <el-select
              multiple
              v-model="businessInfo.salesInfo.salesScenesType"
              style="width: 250px"
              placeholder="请选择经营场景 (可多选) "
          >
            <el-option
                v-for="item in salesInfos"
                :value="item.value"
                :key="item.label"
                :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-collapse
            v-model="selectArr"
        >
          <!--线下-->
          <el-collapse-item
              :name="0"
              title="线下场景"
          >
            <el-form-item prop="bizStoreInfo.bizStoreName">
              <template #label>
                <labelExplain label="门店名称">
                  <template #explain>
                    <div class="content-div">
                      请输入真实的线下场所名称
                      <br/>
                    </div>
                  </template>
                </labelExplain>
              </template>

              <el-input
                  placeholder=" 请输入门店名称 "
                  style="width: 250px"
                  v-model="businessInfo.bizStoreInfo.bizStoreName"
              ></el-input>
            </el-form-item>
           
          </el-collapse-item>

          <!-- 公众号-->
          <el-collapse-item
              :name="1"
              title="公众号"
              v-show="
              businessInfo.salesInfo.salesScenesType.includes('SALES_SCENES_MP')
            "
          >
            <el-radio-group v-model="MP" class="ml-4">
              <el-radio :label="true" size="large">服务商公众号AppID</el-radio>
              <el-radio :label="false" size="large">商家公众号AppID</el-radio>
            </el-radio-group>
            <el-form-item label=" 公众号AppID ">
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    :label="MP == true ? '服务商公众号AppID' : '商家公众号AppID'"
                >
                  <template #explain>
                    <div class="content-div">
                      1、服务商公众号APPID与商家公众号APPID，二选一必填。<br/>
                      2、可填写当前服务商商户号已绑定的公众号APPID。 <br/>
                      3、可填写与商家主体一致且已认证的公众号APPID，需是已认证的服务号、政府或媒体类型的订阅号。
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  v-show="MP"
                  :placeholder="'请输入服务商公众号AppID'"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.mpInfo.mpAppid"
              ></el-input>
              <el-input
                  v-show="!MP"
                  :placeholder="'请输入商家公众号AppID'"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.mpInfo.mpSubAppid"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="
                    公众号页面截图
                    "
                >
                  <template #explain>
                    <div class="content-div">
                      1、请提供展示商品/服务的页面截图/设计稿（最多5张），若公众号未建设完善或未上线请务必提供。
                    </div>
                  </template>
                </labelExplain>
              </template>
              <shp-upload-file
                  limit="5"
                  multiple
                  @success="upLoadSuccess"
                  v-model="businessInfo.salesInfo.mpInfo.mpPics"
              />
            </el-form-item>
          </el-collapse-item>

          <!--小程序-->
          <el-collapse-item
              v-show="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_MINI_PROGRAM'
              )
            "
              :name=2
              title="小程序"
          >
            <el-radio-group v-model="Program" class="ml-4">
              <el-radio :label="true" size="large">服务商小程序AppID</el-radio>
              <el-radio :label="false" size="large">商家小程序AppID</el-radio>
            </el-radio-group>
            <el-form-item>
              <template #label>
                <labelExplain
                    :label="Program == true ? '服务商小程序AppID' : '商家小程序AppID'"
                    style="font-weight: bold"
                >
                  <template #explain>
                    <div class="content-div">
                      1、服务商小程序APPID与商家小程序APPID，二选一必填。
                      2、可填写当前服务商商户号已绑定的小程序APPID
                      3、请填写已认证的小程序APPID；
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  v-show="Program"
                  :placeholder="'请输入服务商小程序AppID'"
                  style="width: 250px"
                  v-model="
                  businessInfo.salesInfo.miniProgramInfo.miniProgramAppid
                "
              ></el-input>
              <el-input
                  v-show="!Program"
                  :placeholder="'请输入商家小程序AppID'"
                  style="width: 250px"
                  v-model="
                  businessInfo.salesInfo.miniProgramInfo.miniProgramSubAppid
                "
              ></el-input>
            </el-form-item>
            <el-form-item>
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="
                    小程序页面截图
                    "
                >
                  <template #explain>
                    <div class="content-div">
                      1、请提供展示商品/服务的页面截图/设计稿（最多5张），若公众号未建设完善或未上线请务必提供。
                    </div>
                  </template>
                </labelExplain>
              </template>

              <shp-upload-file
                  limit="5"
                  multiple
                  @success="upLoadSuccess"
                  v-model="businessInfo.salesInfo.miniProgramInfo.miniProgramPics"
              />
            </el-form-item>
          </el-collapse-item>

          <!--互联网网站-->
          <el-collapse-item

              :name=4
              title="互联网网站"
              v-show="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_WEB'
              )
            "
          >

            <el-form-item label="互联网网站域名 " prop="domain">
              <template #label>
                <labelExplain label="互联网网站域名 ">
                  <template #explain>
                    <div class="content-div">
                      1、如为PC端商城、智能终端等场景，可上传官网链接 <br/>
                      2、网站域名需ICP备案，若备案主体与申请主体不同，请上传加盖公章的网站授权函
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  label="互联网网站域名"
                  placeholder="请输入互联网网站域名"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.webInfo.domain"
              ></el-input>
            </el-form-item>

            <el-form-item label="网站对应的商家APPID" prop="webAppId">
              <template #label>
                <labelExplain label="网站对应的商家APPID">
                  <template #explain>
                    <div class="content-div">
                      可填写已认证的公众号、小程序、应用的APPID，其中公众号APPID需是已认证的服务
                      号、政府或媒体类型的订阅号
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  label="商家APPID"
                  placeholder="请输入网站对应的商家APPID"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.webInfo.webAppid"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="
                    网站授权函
                    "
                >
                  <template #explain>
                    <div class="content-div">
                        <span
                        >1、若备案主体与申请主体不同，请务必上传加盖公章的
                          <el-link
                              href="https://wx.gtimg.com/mch/img/icp.doc"
                              type="primary"
                          >网站授权函
                          </el-link></span
                        >
                    </div>
                  </template>
                </labelExplain>
              </template>

              <shp-upload-file
                  limit="1"
                  @success="upLoadSuccess"
                  v-model="businessInfo.salesInfo.webInfo.webAuthorisation"
              />
            </el-form-item>
          </el-collapse-item>

          <!--App-->
          <el-collapse-item
              :name="3"
              title="App"
              v-show="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_APP'
              )
            "
          >
            <el-radio-group v-model="App" class="ml-4">
              <el-radio :label="true" size="large">服务商应用AppID</el-radio>
              <el-radio :label="false" size="large">商家应用AppID</el-radio>
            </el-radio-group>

            <el-form-item>
              <template #label>
                <labelExplain
                    :label="App == true ? '服务商应用AppID' : '商家应用AppID'"
                >
                  <template #explain>
                    <div class="content-div">
                      1、服务商小程序APPID与商家小程序APPID，二选一必填。
                      2、可填写当前服务商商户号已绑定的小程序APPID
                      3、请填写已认证的小程序APPID；
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  v-show="App"
                  :placeholder="'请输入服务商应用AppID'"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.appInfo.appAppid"
              ></el-input>
              <el-input
                  v-show="!App"
                  :placeholder="'请输入商家应用AppID'"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.appInfo.appSubAppid"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="
                    APP截图
                    "
                >
                  <template #explain>
                    <div class="content-div">
                      1、请提供APP首页截图、尾页截图、应用内截图、支付页截图各1张。
                    </div>
                  </template>
                </labelExplain>
              </template>

              <shp-upload-file
                  limit="4"
                  multiple
                  @success="upLoadSuccess"
                  v-model="businessInfo.salesInfo.appInfo.appPics"
              />
            </el-form-item>
          </el-collapse-item>

          <!-- 企业微信-->
          <el-collapse-item
              :name="5"
              title="企业微信"
              v-show="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_WEWORK'
              )
            "
          >
            <el-form-item label="商家企业微信CorpID  " prop="corpId">
              <template #label>
                <labelExplain label="商家企业微信CorpID  ">
                  <template #explain>
                    <div class="content-div">
                      1、可填写与商家主体一致且已认证的企业微信CorpID。
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  label="商家企业微信CorpID"
                  placeholder="请输入商家企业微信CorpID"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.weworkInfo.subCorpId"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="
                    企业微信页面截图
                    "
                >
                  <template #explain>
                    <div class="content-div">1、最多可上传5张照片</div>
                  </template>
                </labelExplain>
              </template>

              <shp-upload-file
                  limit="4"
                  multiple
                  @success="upLoadSuccess"
                  v-model="businessInfo.salesInfo.weworkInfo.weworkPics"
              />
            </el-form-item>
          </el-collapse-item>

        </el-collapse>
      </el-form>
    </el-card>
    <el-button @click="showValue">show Value</el-button>
  </div>
</template>

<script setup>
import {computed, nextTick, reactive, ref, watch} from "vue";
import {getToken} from "@/utils/auth";
import Modal from "@/plugins/modal";
import ShpUploadFile from "./ShpUploadFile.vue";

// el-form
const businessInfo = ref({
  merchantShortname: "",
  servicePhone: "",
  bizStoreInfo: {
    bizStoreName: "",
  },
  salesInfo: {
    salesScenesType: [],
    bizStoreInfo: {
      bizStoreName: "",
      bizAddressCode: "",
      bizStoreAddress: "",
      storeEntrancePic: [],
      indoorPic: [],
      bizSubAppid: "",
    },
    mpInfo: {
      mpPics: [],
      mpAppid: "",
      mpSubAppid: "",
    },
    miniProgramInfo: {
      miniProgramAppid: "",
      miniProgramSubAppid: "",
      miniProgramPics: [],
    },
    appInfo: {
      appPics: [],
    },
    webInfo: {
      webAuthorisation: "",
    },
    weworkInfo: {
      weworkPics: [],
    },
  },
});

//经营场景类型
const salesInfos = [
  {
    label: "线下场所",
    value: "SALES_SCENES_STORE",
  },
  {
    label: "公众号",
    value: "SALES_SCENES_MP",
  },

  {
    label: "小程序",
    value: "SALES_SCENES_MINI_PROGRAM",
  },

  {
    label: "互联网网站",
    value: "SALES_SCENES_WEB",
  },

  {
    label: "APP",
    value: "SALES_SCENES_APP",
  },

  {
    label: "企业微信",
    value: "SALES_SCENES_WEWORK",
  },
];
const formRef = ref();
const t = ref({});
const MP = ref(true);
const Program = ref(true);
const App = ref(true);
const selectArr = ref([0, 1, 2, 3, 4, 5]);


watch(MP, (val, oldValue) => {
  if (oldValue) {
    businessInfo.value.salesInfo.mpInfo.mpAppid = "";
  } else {
    businessInfo.value.salesInfo.mpInfo.mpSubAppid = "";
  }
});

watch(Program, (val, oldValue) => {
  if (oldValue) {
    businessInfo.value.salesInfo.miniProgramInfo.miniProgramAppid = "";
  } else {
    businessInfo.value.salesInfo.miniProgramInfo.miniProgramSubAppid = "";
  }
});

watch(App, (val, oldValue) => {
  if (oldValue) {
    businessInfo.value.salesInfo.appInfo.appAppid = "";
  } else {
    businessInfo.value.salesInfo.appInfo.appSubAppid = "";
  }
});

const upLoadSuccess = (urls) => {
};

const validators = {
  selected: (rule, val, cb) => {
    if (val.length == 0) {
      cb(new Error("至少选择一种场景"));
    }
  },
  input: (rule, val, cb) => {
    if (val == "" || val.length == 0) {
      cb(new Error("输入不能为空"));
    }
  },
};

//校验规则
const rules = ref({
  merchantShortname: [
    {required: true, trigger: "blur", message: "值不能为空"},
    {max: 30, min: 2, message: "长度需为2至30个字符", trigger: "change"},
  ],
  servicePhone: [{required: true, trigger: "blur", message: "值不能为空"}],
  "salesInfo.salesScenesType": [
    {
      trigger: "change",
      validator: validators.selected,
      required: true,
    },
  ],
  "bizStoreInfo.bizStoreName": [
    {
      required: true,
      message: "值不能为空",
      trigger: "blur",
    },
  ],
  bizAddressCode: [
    {
      trigger: "blur",
      required: true,
      message: "值不能为空",
    },
  ],
  bizStoreAddress: [
    {
      trigger: "blur",
      required: true,
      message: "值不能为空",
    },
  ],
  indoorPic: [
    {
      trigger: "change",

      message: "必须上传图片",
      validator: (rule, val, cb) => {
        // console.log(val.length);
        if (val && val.length == 0) cb(new Error("必须上传图片"));
      },
    },
  ],
  storeEntrancePic: [
    {
      trigger: "change",
      required: true,
      message: "必须上传图片",
    },
  ]
});


const showValue = () => {
  // console.log(businessInfo.value)
  console.log(456)
  formRef.value.validate((valid, fields) => {
    console.log(123,valid, fields)
    if (valid) {
    } else {
    }
  })
  // form.value.validate(val=>{
  //   console.log(val)
  // })
  // form.value.validateField("bizStoreInfo.bizStoreName")
};
</script>

<style lang="scss" scoped>
.business-info {
  .box-card {
    width: 650px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      font-weight: bold;

      .desc {
        font-weight: normal;
        font-size: 12px;
        width: 350px;
        margin-left: 40px;
      }
    }
  }
}
</style>
