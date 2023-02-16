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
      <el-form :model="businessInfo" :rules="rules" ref="form">
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
            v-show="businessInfo.salesInfo.salesScenesType.length > 0"
            v-model="selectArr"
        >
          <!--线下-->
          <el-collapse-item
              :name="0"
              title="线下场景"
              v-if="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_STORE'
              )
            "
          >
            <el-form-item prop="salesInfo.bizStoreInfo.bizStoreName">
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
                  v-model="businessInfo.salesInfo.bizStoreInfo.bizStoreName"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <template #label>
                <label-explain label="线下场所省市区">
                  <template #explain>
                    <div>选择开户银行省市区</div>
                  </template>
                </label-explain>
              </template>
              <el-select v-model="state.province" @change="provincChange" placeholder="请选择省份"
                         style="width: 32%;margin-right: 2%;">
                <el-option v-for="item in provinceList" :value="item.id" :label="item.name" :key="item.id"/>
              </el-select>
              <el-select v-model="state.city" @change="cityChange" placeholder="请选择城市"
                         style="width: 32%;margin-right: 2%;">
                <el-option v-for="item in cityList" :value="item.id" :label="item.name" :key="item.id"/>
              </el-select>
              <el-select v-model="state.area" @change="areaChange" placeholder="请选择地区" style="width: 32%;">
                <el-option v-for="item in areaList" :value="item.id" :label="item.name" :key="item.id"/>
              </el-select>
            </el-form-item>


            <el-form-item prop="salesInfo.bizStoreInfo.bizAddressCode">
              <template #label>
                <labelExplain label="线下场所省市编码生成">
                  <template #explain>
                    <div class="content-div">
                      1、只能由数字组成 <br/>
                      2、可根据上一行省市区选择自动生成 <br/>
                      3、详细参见 (
                      <el-link
                          href="https://pay.weixin.qq.com/wiki/doc/apiv3/download/%E7%9C%81%E5%B8%82%E5%8C%BA%E7%BC%96%E5%8F%B7%E5%AF%B9%E7%85%A7%E8%A1%A8.xlsx"
                          type="primary"
                      >省市区编号对照表
                      </el-link>
                      )
                      <br/>
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  placeholder=" 请输入线下场所省市编码 "
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.bizStoreInfo.bizAddressCode"
              ></el-input>
            </el-form-item>
            <el-form-item prop="salesInfo.bizStoreInfo.bizStoreAddress">
              <template #label>
                <labelExplain label="线下场所地址">
                  <template #explain>
                    <div class="content-div">
                      请填写详细的经营场所信息，如有多个场所，选择一个主要场所填写即可。
                      <br/>
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  placeholder=" 请输入线下场所地址 "
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.bizStoreInfo.bizStoreAddress"
              ></el-input>
            </el-form-item>
            <el-form-item prop="bizSubAppid">
              <template #label>
                <labelExplain label="对应的商家AppID">
                  <template #explain>
                    <div class="content-div">
                      1、可填写与商家主体一致且已认证的公众号、小程序、APP的AppID，其中公众号AppID需是已认证的服务号、政府或媒体类型的订阅号；<br/>
                      2、审核通过后，系统将额外为商家开通付款码支付、JSAPI支付的自有交易权限，并完成商家商户号与该AppID的绑定；
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input
                  placeholder="(选填)"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.bizStoreInfo.bizSubAppid"
              ></el-input>
            </el-form-item>
            <el-form-item prop="salesInfo.bizStoreInfo.storeEntrancePic">
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="
                      线下场所门头照片
                    "
                >
                  <template #explain>
                    <div class="content-div">
                      1、请上传门店照片（要求门店招牌清晰可见）。若为停车场、售卖机等无固定门头照片
                      的经营场所，请提供真实的经营现场照片即可；
                    </div>
                  </template>
                </labelExplain>
              </template>
              <shp-upload-file
                  limit="2"
                  multiple
                  @success="upLoadSuccess"
                  v-model="businessInfo.salesInfo.bizStoreInfo.storeEntrancePic"
              />
            </el-form-item>
            <el-form-item prop="salesInfo.bizStoreInfo.indoorPic">
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="
                      线下场所内部照片
                    "
                >
                  <template #explain>
                    <div class="content-div">
                      1、请上传门店内部环境照片。若为停车场、售卖机等无固定门头照片的经营场所，请提
                      供真实的经营现场照片即可
                    </div>
                  </template>
                </labelExplain>
              </template>

              <shp-upload-file
                  limit="2"
                  multiple
                  @success="upLoadSuccess"
                  v-model="businessInfo.salesInfo.bizStoreInfo.indoorPic"
              />
            </el-form-item>
          </el-collapse-item>

          <!-- 公众号-->
          <el-collapse-item
              :name="1"
              title="公众号"
              v-if="
              businessInfo.salesInfo.salesScenesType.includes('SALES_SCENES_MP')
            "
          >
            <el-radio-group v-model="MP" class="ml-4">
              <el-radio :label="true" size="large">服务商公众号AppID</el-radio>
              <el-radio :label="false" size="large">商家公众号AppID</el-radio>
            </el-radio-group>

            <el-form-item v-if="MP" prop="salesInfo.mpInfo.mpAppid">
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="服务商公众号AppID"
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
            </el-form-item>
            <el-form-item v-if="!MP" prop="salesInfo.mpInfo.mpSubAppid">
              <template #label>
                <labelExplain
                    style="font-weight: bold"
                    label="商家公众号AppID"
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
                  v-show="!MP"
                  :placeholder="'请输入商家公众号AppID'"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.mpInfo.mpSubAppid"
              ></el-input>
            </el-form-item>


            <el-form-item prop="salesInfo.mpInfo.mpPics">
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
              v-if="
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
            <el-form-item
                :prop="Program?'salesInfo.miniProgramInfo.miniProgramAppid':'salesInfo.miniProgramInfo.miniProgramSubAppid'">
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
                  v-if="Program"
                  :placeholder="'请输入服务商小程序AppID'"
                  style="width: 250px"
                  v-model="
                  businessInfo.salesInfo.miniProgramInfo.miniProgramAppid
                "
              ></el-input>
              <el-input
                  v-if="!Program"
                  :placeholder="'请输入商家小程序AppID'"
                  style="width: 250px"
                  v-model="
                  businessInfo.salesInfo.miniProgramInfo.miniProgramSubAppid
                "
              ></el-input>
            </el-form-item>
            <el-form-item prop="salesInfo.miniProgramInfo.miniProgramPics">
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
              v-if="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_WEB'
              )
            "
          >

            <el-form-item label="互联网网站域名 " prop="salesInfo.webInfo.domain">
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

            <el-form-item label="网站对应的商家APPID" prop="salesInfo.webInfo.webAppId">
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

            <el-form-item prop="salesInfo.webInfo.webAuthorisation">
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
              v-if="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_APP'
              )
            "
          >
            <el-radio-group v-model="App" class="ml-4">
              <el-radio :label="true" size="large">服务商应用AppID</el-radio>
              <el-radio :label="false" size="large">商家应用AppID</el-radio>
            </el-radio-group>

            <el-form-item :prop="App?'salesInfo.appInfo.appAppid':'salesInfo.appInfo.appSubAppid'">
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
                  v-if="App"
                  :placeholder="'请输入服务商应用AppID'"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.appInfo.appAppid"
              ></el-input>
              <el-input
                  v-if="!App"
                  :placeholder="'请输入商家应用AppID'"
                  style="width: 250px"
                  v-model="businessInfo.salesInfo.appInfo.appSubAppid"
              ></el-input>
            </el-form-item>
            <el-form-item prop="salesInfo.appInfo.appPics">
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
              v-if="
              businessInfo.salesInfo.salesScenesType.includes(
                'SALES_SCENES_WEWORK'
              )
            "
          >
            <el-form-item label="商家企业微信CorpID  " prop="salesInfo.weworkInfo.subCorpId">
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
            <el-form-item prop="salesInfo.weworkInfo.weworkPics">
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
    <!--    <el-button @click="showValue">show Value</el-button>-->
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import {getToken} from "@/utils/auth";
import Modal from "@/plugins/modal";
import ShpUploadFile from "./ShpUploadFile.vue";
import {bankType, listArea, listCity, listProvince} from "@/api/insurance/wechatIncoming";

const emit = defineEmits(['result'])

// el-form
const businessInfo = ref({
  merchantShortname: "",
  servicePhone: "",
  salesInfo: {
    salesScenesType: ref([]),
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
      appAppid: '',
      appSubAppid: '',
    },
    webInfo: {
      webAuthorisation: null,
      domain: '',
      webAppid: ''
    },
    weworkInfo: {
      subCorpId: '',
      weworkPics: [],
    },
  },
});
let wechartData = sessionStorage.getItem('wechartFormData')
let wechartDatas = wechartData?JSON.parse(wechartData).businessInfo:null
wechartDatas && (businessInfo.value = wechartDatas)

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
const form = ref({});
const MP = ref(true);
const Program = ref(true);
const App = ref(true);
const selectArr = ref([0, 1, 2, 3, 4, 5]);
const state = ref({
  province: '',
  city: '',
  area: ''
})
const provinceList = ref([])
const cityList = ref([])
const areaList = ref([])


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


//校验规则
const rules = ref({
  'merchantShortname': [
    {required: true, trigger: "blur", message: "值不能为空"},
    {max: 30, min: 2, message: "长度需为2至30个字符", trigger: "change"},
  ],
  'servicePhone': [{required: true, trigger: "blur", message: "值不能为空"}],
  "salesInfo.salesScenesType": [
    {
      trigger: "change",
      message: '至少选择一种',
      required: true,
    },
  ],
  'salesInfo.bizStoreInfo.bizStoreName': [
    {
      trigger: "blur",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.bizStoreInfo.bizAddressCode': [
    {
      trigger: "blur",
      required: true,
      message: "值不能为空",
    },
  ],

  'salesInfo.bizStoreInfo.bizStoreAddress': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.bizStoreInfo.indoorPic': [
    {
      trigger: "blur",
      required: true,
      message: "必须上传图片",
    },
  ],
  'salesInfo.bizStoreInfo.storeEntrancePic': [
    {
      trigger: "change",
      required: true,
      message: "必须上传图片",
    },
  ],

  'salesInfo.mpInfo.mpPics': [
    {
      trigger: "change",
      required: true,
      message: "必须上传图片",
    },
  ],
  'salesInfo.mpInfo.mpAppid': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.mpInfo.mpSubAppid': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.miniProgramInfo.miniProgramAppid': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.miniProgramInfo.miniProgramSubAppid': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],

  'salesInfo.miniProgramInfo.miniProgramPics': [
    {
      trigger: "change",
      required: true,
      message: "必须上传图片",
    },
  ],
  'salesInfo.appInfo.appSubAppid': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.appInfo.appAppid': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.appInfo.appPics': [
    {
      trigger: "change",
      required: true,
      message: "必须上传图片",
    },
  ],
  'salesInfo.webInfo.webAuthorisation': [
    {
      trigger: "change",
      required: true,
      message: "必须上传图片",
    },
  ],
  'salesInfo.webInfo.webAppid': [
    {
      trigger: "change",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.webInfo.domain': [
    {
      trigger: "blur",
      required: true,
      message: "值不能为空",
    },
  ],
  'salesInfo.weworkInfo.weworkPics': [
    {
      trigger: "change",
      required: true,
      message: "必须上传图片",
    },
  ],
  'salesInfo.weworkInfo.subCorpId': [
    {
      trigger: "blur",
      required: true,
      message: "值不能为空",
    },
  ],


});

const provincChange = (val) => {
  listCity({pid: val}).then(res => {
    if (res.code === 200) {
      cityList.value = res.data
      state.value.city = ''
      state.value.area = ''
      form.value.bankAddressCode = ''
    }
  })
}
const cityChange = (val) => {
  listArea({pid: val}).then(res => {
    if (res.code === 200) {
      areaList.value = res.data
      state.value.area = ''
      form.value.bankAddressCode = ''
      if (res.data.length === 0 || res.data == null) {
        form.value.bankAddressCode = val
      }
    }
  })
}
const areaChange = (val) => {
  businessInfo.value.salesInfo.bizStoreInfo.bizAddressCode
      = val
}

const getBankType = () => {
  bankType('pay_bank_info').then(res => {
    if (res.code === 200) {
      accountBankList.value = res.data
    }
  })
  listProvince().then(res => {
    if (res.code == 200) {
      provinceList.value = res.data
    }
  })
};
getBankType()

const showValue = () => {
  console.log(businessInfo.value)
}


const submit = () => {
  form.value.validate(val => {
    if (val) {
      emit('result', {businessInfo: businessInfo.value})
    } else {
      emit('result', false)
    }
  })
};

defineExpose({
  submit,
})


</script>

<style lang="scss" scoped>
.business-info {
  .box-card {
    // width: 650px;

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
