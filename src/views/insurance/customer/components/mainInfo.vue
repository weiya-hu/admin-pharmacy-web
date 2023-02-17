<template>
  <div class="mainInfo_outBox">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>主体信息</span>
          <span class="desc"
          >请填写商家的营业执照/登记证书、经营者/法人的证件等信息。</span
          >
        </div>
      </template>
      <el-form ref="instance_Form" :model="form_Info" :rules="form_Info_Rules">
        <el-form-item prop="subjectType">
          <template #label>
            <labelExplain label="主体类型">
              <template #explain>
                <div> 主体类型需与营业执照/登记证书上一致，可参考
                  <el-link type="primary" href="https://kf.qq.com/faq/180910IBZVnQ180910naQ77b.html" target="_blank">
                    选择主体指引。
                  </el-link>
                </div>
              </template>
            </labelExplain>
          </template>
          <el-select style="width: 100%;" clearable @change="chooseSubjectType" v-model="form_Info.subjectType">
            <el-option v-for="item in subjectTypeOption" :label="item.label" :value="item.value" :key="item.value">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <template #label>-->
        <!--            <labelExplain label="是否金融机构">-->
        <!--              <template #explain>-->
        <!--                <div> 选填，请根据申请主体的实际情况填写，可参考选择-->
        <!--                  <el-link type="primary" href="https://kf.qq.com/faq/220215IrMRZ3220215n6buiU.html" target="_blank">-->
        <!--                    金融机构指引-->
        <!--                  </el-link>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </labelExplain>-->
        <!--          </template>-->
        <!--          <el-radio-group @change="chooseFinanceInstitution" v-model="form_Info.financeInstitution">-->
        <!--            <el-radio disabled :label="true" size="large">是</el-radio>-->
        <!--            <el-radio disabled :label="false" size="large">否</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
        <el-form-item v-if="isShowCertificateLetterCopy" label="单位证明函照片"
                      style="align-items: center;font-weight: bold">
          <template #label>
            <labelExplain label="单位证明函照片">
              <template #explain>
                <div> 主体类型为政府机关、事业单位选传，主体为个体户、企业、其他组织等，不需要上传
                </div>
              </template>
            </labelExplain>
          </template>
          <ShpUploadFile
            v-model="form_Info.certificateLetterCopy"
            :limit="1"
            :multiple="false"
          ></ShpUploadFile>
        </el-form-item>
        <el-collapse @change="ChangeCollapse" v-model="activeNames">
          <el-collapse-item v-if="isShowBusiness" name="1">
            <template #title>
              <div class="collapseName">营业执照:</div>
            </template>
            <el-form-item prop="businessLicenseInfo.licenseCopy" style="align-items: center;font-weight: bold">
              <template #label>
                <labelExplain label="营业执照照片">
                  <template #explain>
                    <div>
                      可上传1张图片
                    </div>
                  </template>
                </labelExplain>
              </template>
              <ShpUploadFile
                ref="licenseCopy_Instance"
                @success="(data)=>{uploadImageSuccessCallback(data,true,'bizLicenseOcr','','licenseCopy')}"
                v-model="form_Info.businessLicenseInfo.licenseCopy" :limit="1" :multiple="false"
                flag="businessAdditionPics"></ShpUploadFile>
            </el-form-item>
            <el-form-item prop="businessLicenseInfo.licenseNumber">
              <template #label>
                <labelExplain label="注册号/统一社会信用代码">
                  <template #explain>
                    <div>
                      请填写营业执照上的营业执照注册号，注册号格式须为18位数字|大写字母。
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.businessLicenseInfo.licenseNumber"></el-input>
            </el-form-item>
            <el-form-item prop="businessLicenseInfo.merchantName">
              <template #label>
                <labelExplain label="商户名称">
                  <template #explain>
                    <div>
                      请填写营业执照上的商户名称,2~110个字符，支持括号,个体户，不能以“公司”结尾,个体户，若营业执照上商户名称为空或为“无”，请填写"个体户+经营者姓名"，如“个体户张三",示例值：腾讯科技有限公司
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.businessLicenseInfo.merchantName"></el-input>
            </el-form-item>
            <el-form-item prop="businessLicenseInfo.legalPerson">
              <template #label>
                <labelExplain label="个体户经营者/法人姓名">
                  <template #explain>
                    <div>
                      请填写营业执照的经营者/法定代表人姓名 示例值：张三
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.businessLicenseInfo.legalPerson"></el-input>
            </el-form-item>
            <el-form-item prop="businessLicenseInfo.licenseAddress">
              <template #label>
                <labelExplain label="注册地址">
                  <template #explain>
                    <div>
                      建议填写营业执照的注册地址，若该字段未填写，系统将会查询国家工商信息填入。需注意若工商信息查询不到，则会被审核驳回。
                      示例值：广东省深圳市南山区xx路xx号
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.businessLicenseInfo.licenseAddress"></el-input>
            </el-form-item>
            <el-form-item prop="businessLicenseInfo.periodBegin">
              <template #label>
                <labelExplain label="有效期限开始日期">
                  <template #explain>
                    <div>
                      建议填写营业执照的有效期限开始时间，若该字段未填写，系统将会查询国家工商信息填入。需注意若工商信息查询不到，则会被审核驳回。
                    </div>
                  </template>
                </labelExplain>
              </template>
              <div style="display: flex">
                <ShpTimeChoose
                  :default-time="form_Info.businessLicenseInfo.periodBegin"
                  :chooseTag="'begin'" v-model="form_Info.businessLicenseInfo.periodBegin"
                  :end-time="form_Info.businessLicenseInfo.periodEnd"></ShpTimeChoose>
              </div>
            </el-form-item>
            <el-form-item style="font-weight: bold" prop="businessLicenseInfo.periodEnd">
              <template #label>
                <labelExplain label="有效期限结束日期">
                  <template #explain>
                    <div>
                      建议填写营业执照的有效期限开始时间，若该字段未填写，系统将会查询国家工商信息填入。需注意若工商信息查询不到，则会被审核驳回。
                      若证件有效期为长期，请打开按钮
                    </div>
                  </template>
                </labelExplain>
              </template>
              <div class="content">
                <div>
                  <el-switch
                    active-text="长期有效"
                    inactive-text="长期有效"
                    inline-prompt

                    @change="()=>{deadlinebySwitch('businessLicenseInfoTime')}"
                    v-model="isPermanentlyValid_businessLicenseInfo">
                  </el-switch>
                </div>
                <div v-if="!isPermanentlyValid_businessLicenseInfo" class="chooseEndDate">
                  <ShpTimeChoose
                    :default-time="form_Info.businessLicenseInfo.periodEnd"
                    :chooseTag="'end'" v-model="form_Info.businessLicenseInfo.periodEnd"
                    :begin-time="form_Info.businessLicenseInfo.periodBegin"></ShpTimeChoose>

                </div>
              </div>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item v-if="isShowCertificate" name="2">
            <template #title>
              <div class="collapseName">登记证书:</div>
            </template>
            <el-form-item style="align-items: center;font-weight: bold" prop="certificateInfo.certCopy">
              <template #label>
                <labelExplain label="登记证书照片">
                  <template #explain>
                    <div>
                      可上传1张图片
                    </div>
                  </template>
                </labelExplain>
              </template>
              <ShpUploadFile
                ref="certificateInfoCertCopy_Instance"
                @success="(data)=>{uploadImageSuccessCallback(data,true,'enterpriseLicenseOCR','','certificateInfoCertCopy')}"
                v-model="form_Info.certificateInfo.certCopy" :limit="1" :multiple="false"
                flag="businessAdditionPics"></ShpUploadFile>
            </el-form-item>
            <el-form-item prop="certificateInfo.certType">
              <template #label>
                <labelExplain label="登记证书类型">
                  <template #explain>
                    <div>
                      主体为“政府机关/事业单位/社会组织”时，请上传登记证书类型，主体为“个体工商户/企业”时，不填
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-select style="width: 100%;" @change="changeCertificateInfoCertType"
                         v-model="form_Info.certificateInfo.certType">
                <el-option :disabled="item.disabled" :label="item.label" v-for="item in certTypeOption"
                           :value="item.value" :key="item.value">
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="certificateInfo.certNumber">
              <template #label>
                <labelExplain label="证书号">
                  <template #explain>
                    <div>
                      请填写登记证书上的证书编号
                      示例值：111111111111
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.certificateInfo.certNumber"></el-input>
            </el-form-item>
            <el-form-item label="商户名称" prop="certificateInfo.merchantName">
              <template #label>
                <labelExplain label="商户名称">
                  <template #explain>
                    <div>
                      请填写登记证书上的商户名称
                      示例值：xx公益团体
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.certificateInfo.merchantName"></el-input>
            </el-form-item>
            <el-form-item label="注册地址" prop="certificateInfo.companyAddress">
              <template #label>
                <labelExplain label="注册地址">
                  <template #explain>
                    <div>
                      请填写登记证书的注册地址
                      示例值：广东省深圳市南山区xx路xx号
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.certificateInfo.companyAddress"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人" prop="certificateInfo.legalPerson">
              <template #label>
                <labelExplain label="法定代表人">
                  <template #explain>
                    <div>
                      只能由中文字符、英文字符、可见符号组成，请填写登记证书上的法定代表人姓名
                      示例值：李四
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-input v-model="form_Info.certificateInfo.legalPerson"></el-input>
            </el-form-item>
            <el-form-item label="有效期限开始日期" prop="certificateInfo.periodBegin">
              <template #label>
                <labelExplain label="有效期限开始日期">
                  <template #explain>
                    <div>
                      必填，请参考示例值填写，结束日期大于开始日期，
                      示例值：2019-08-01
                    </div>
                  </template>
                </labelExplain>
              </template>
              <ShpTimeChoose :chooseTag="'begin'" v-model="form_Info.certificateInfo.periodBegin"
                             :end-time="form_Info.certificateInfo.periodEnd"></ShpTimeChoose>

            </el-form-item>
            <el-form-item style="font-weight: bold" label="有效期限结束日期" prop="certificateInfo.periodEnd">
              <template #label>
                <labelExplain label="有效期限结束日期">
                  <template #explain>
                    <div>
                      必填，请参考示例值填写，若证件有效期为长期，请打开开关，
                      结束日期大于开始日期，
                      示例值：2019-08-01
                    </div>
                  </template>
                </labelExplain>
              </template>
              <div>
                <div>
                  <el-switch active-text="长期有效"
                             inactive-text="长期有效"
                             inline-prompt @change="()=>{deadlinebySwitch('certificateInfo')}"
                             v-model="isPermanentlyValid_certificateInfo" />
                </div>
                <div v-if="!isPermanentlyValid_certificateInfo">
                  <ShpTimeChoose :chooseTag="'end'"
                                 v-model="form_Info.certificateInfo.periodEnd"
                                 :begin-time="form_Info.certificateInfo.periodBegin"></ShpTimeChoose>
                </div>
              </div>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item v-if="false" name="3">
            <template #title>
              <div class="collapseName">金融机构许可证信息:</div>
            </template>
            <el-form-item prop="financeInstitutionInfo.financeLicensePics" style="align-items: center;font-weight: bold"
                          label="金融机构许可证图片">
              <template #label>
                <labelExplain label="金融机构许可证图片">
                  <template #explain>
                    <div>
                      根据所属金融机构类型的许可证要求提供，详情查看
                      <el-link type="primary" href="https://kf.qq.com/faq/220215IrMRZ3220215n6buiU.html"
                               target="_blank">
                        金融机构指引
                      </el-link>
                      参考
                    </div>
                  </template>
                </labelExplain>
              </template>
              <ShpUploadFile @success="(data)=>{uploadImageSuccessCallback(data,false,'','','')}"
                             v-model="form_Info.financeInstitutionInfo.financeLicensePics" :limit="1" :multiple="false"
                             flag="businessAdditionPics"></ShpUploadFile>
            </el-form-item>
            <el-form-item prop="financeInstitutionInfo.financeType">
              <template #label>
                <labelExplain label="金融机构类型">
                  <template #explain>
                    <div>
                      金融机构类型需与营业执照/登记证书上一致，可参考选择
                      <el-link type="primary" href="https://kf.qq.com/faq/220215IrMRZ3220215n6buiU.html"
                               target="_blank">
                        金融机构指引
                      </el-link>
                      参考
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-select style="width: 100%;" clearable v-model="form_Info.financeInstitutionInfo.financeType">
                <el-option :label="item.label" v-for="item in financeTypeOption" :value="item.value" :key="item.value">
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template #title>
              <div class="collapseName">经营者/法人身份证件:</div>
            </template>
            <el-form-item prop="identityInfo.authorizeLetterCopy" style="align-items: center;font-weight: bold">
              <template #label>
                <labelExplain label="法定代表人说明函">
                  <template #explain>
                    <div>
                      当证件持有人类型为经办人时，必须上传。其他情况，无需上传，
                      若因特殊情况，无法提供法定代表人证件时，请参照
                      <el-link type="primary" href="https://kf.qq.com/faq/220127aUzAju220127UfiuQr.html"
                               target="_blank">
                        示例图
                      </el-link>
                      打印法定代表人说明函，全部信息需打印，不支持手写商户信息，并加盖公章
                      可上传1张图片
                    </div>
                  </template>
                </labelExplain>
              </template>
              <ShpUploadFile @success="(data)=>{uploadImageSuccessCallback(data,false,'','','')}"
                             v-model="form_Info.identityInfo.authorizeLetterCopy" :limit="1" :multiple="false"
                             flag="businessAdditionPics"></ShpUploadFile>
            </el-form-item>
            <el-form-item prop="identityInfo.idHolderType">
              <template #label>
                <labelExplain label="证件持有人类型">
                  <template #explain>
                    <div>
                      主体类型为政府机关、事业单位时选传
                      主体类型为企业、个体户、社会组织时，默认为经营者/法人，不需要上传该字段
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-radio-group @change="chooseIdHolderType" v-model="form_Info.identityInfo.idHolderType">
                <el-radio :disabled="controlIdHolderTypeDisabled" label="LEGAL" size="large">法人</el-radio>
                <el-radio :disabled="controlIdHolderTypeDisabled" label="SUPER" size="large">经办人</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="identityInfo.idDocInfo.owner">
              <template #label>
                <labelExplain label="经营者/法人是否为受益人">
                  <template #explain>
                    <div>
                      主体类型为企业时，需要填写
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-radio-group @change="changeOwner" v-model="form_Info.identityInfo.owner">
                <el-radio :label="true" size="large">是</el-radio>
                <el-radio :label="false" size="large">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="identityInfo.idDocType">
              <template #label>
                <labelExplain label="证件类型">
                  <template #explain>
                    <div>
                      当证件持有人类型为法人时，填写。其他情况，无需上传
                      个体户/企业/事业单位/社会组织：可选择任一证件类型，政府机关仅支持中国大陆居民-身份证类型
                    </div>
                  </template>
                </labelExplain>
              </template>
              <el-select style="width: 100%;" v-model="form_Info.identityInfo.idDocType">
                <el-option :label="item.label" :disabled="item.disabled" v-for="item in idDocTypeOption"
                           :value="item.value"
                           :key="item.value">{{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-collapse v-model="innerActiveNames">
              <el-collapse-item name="1" v-if="isIdCard">
                <template #title>
                  <div class="collapseName">身份证信息:</div>
                </template>
                <el-form-item prop="identityInfo.idCardInfo.idCardCopy" style="align-items: center;font-weight: bold"
                              label="身份证人像面照片">
                  <template #label>
                    <labelExplain label="身份证人像面照片">
                      <template #explain>
                        <div>
                          请上传个体户经营者/法人的身份证人像面照片
                          请上传彩色照片or彩色扫描件or复印件（需加盖公章鲜章），可添加“微信支付”相关水印（如微信支付认证）
                          可上传1张图片
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <ShpUploadFile
                    ref="idCardInfoIdCardCopy_Instance"
                    @success="(data)=>{uploadImageSuccessCallback(data,true,'idCardOcr','positive','idCardInfoIdCardCopy')}"
                    v-model="form_Info.identityInfo.idCardInfo.idCardCopy" :limit="1" :multiple="false"
                    flag="businessAdditionPics"></ShpUploadFile>
                </el-form-item>
                <el-form-item prop="identityInfo.idCardInfo.idCardNational"
                              style="align-items: center;font-weight: bold" label="身份证国徽面照片">
                  <template #label>
                    <labelExplain label="身份证国徽面照片">
                      <template #explain>
                        <div>
                          请上传个体户经营者/法定代表人的身份证国徽面照片,可上传1张图片
                          请上传彩色照片or彩色扫描件or复印件（需加盖公章鲜章），可添加“微信支付”相关水印（如微信支付认证）
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <ShpUploadFile
                    @success="(data)=>{uploadImageSuccessCallback(data,true,'idCardOcr','opposite','idCardInfoIdCardNational')}"
                    v-model="form_Info.identityInfo.idCardInfo.idCardNational" :limit="1" :multiple="false"
                    flag="businessAdditionPics"></ShpUploadFile>
                </el-form-item>
                <el-form-item prop="identityInfo.idCardInfo.idCardName" style="align-items: center;font-weight: bold"
                              label="身份证姓名">
                  <template #label>
                    <labelExplain label="身份证姓名">
                      <template #explain>
                        <div>
                          请填写个体户经营者/法定代表人对应身份证的姓名，2~30个中文字符、英文字符、符号
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <el-input v-model="form_Info.identityInfo.idCardInfo.idCardName"></el-input>
                </el-form-item>
                <el-form-item prop="identityInfo.idCardInfo.idCardNumber" style="align-items: center;font-weight: bold"
                              label="身份证号码">
                  <template #label>
                    <labelExplain label="身份证号码">
                      <template #explain>
                        <div>
                          请填写个体户经营者/法定代表人对应身份证的号码,
                          15位数字或17位数字+1位数字|X
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <el-input v-model="form_Info.identityInfo.idCardInfo.idCardNumber"></el-input>
                </el-form-item>
                <el-form-item prop="identityInfo.idCardInfo.idCardAddress" style="align-items: center;font-weight: bold"
                              label="身份证居住地址">
                  <template #label>
                    <labelExplain label="身份证居住地址">
                      <template #explain>
                        <div>
                          体类型为企业时，需要填写。其他主体类型，无需上传
                          按照身份证住址填写，如广东省深圳市南山区xx路xx号xx室
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <el-input v-model="form_Info.identityInfo.idCardInfo.idCardAddress"></el-input>
                </el-form-item>
                <el-form-item prop="identityInfo.idCardInfo.cardPeriodBegin"
                              style="align-items: center;font-weight: bold" label="身份证有效期开始时间">
                  <template #label>
                    <labelExplain label="身份证有效期开始时间">
                      <template #explain>
                        <div>
                          结束时间大于开始时间,
                          示例值：2026-06-06
                        </div>
                      </template>
                    </labelExplain>
                  </template>

                  <ShpTimeChoose :default-time="form_Info.identityInfo.idCardInfo.cardPeriodBegin" :chooseTag="'begin'"
                                 v-model="form_Info.identityInfo.idCardInfo.cardPeriodBegin"
                                 :end-time="form_Info.identityInfo.idCardInfo.cardPeriodEnd"></ShpTimeChoose>
                </el-form-item>
                <el-form-item prop="identityInfo.idCardInfo.cardPeriodEnd" style="align-items: center;font-weight: bold"
                              label="身份证有效期结束时间">
                  <template #label>
                    <labelExplain label="身份证有效期结束时间">
                      <template #explain>
                        <div>
                          结束时间大于开始时间,
                          示例值：2026-06-06
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <div class="content">
                    <div>
                      <el-switch active-text="长期有效"
                                 inactive-text="长期有效"
                                 inline-prompt @change="()=>{deadlinebySwitch('identityInfoIdCardInfo')}"
                                 v-model="isPermanentlyValid_identityInfo_idCardInfo" />
                    </div>
                    <div v-if="!isPermanentlyValid_identityInfo_idCardInfo" class="chooseEndDate">
                      <ShpTimeChoose :default-time="form_Info.identityInfo.idCardInfo.cardPeriodEnd" :chooseTag="'end'"
                                     v-model="form_Info.identityInfo.idCardInfo.cardPeriodEnd"
                                     :begin-time="form_Info.identityInfo.idCardInfo.cardPeriodBegin"></ShpTimeChoose>
                    </div>
                  </div>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="2" v-if="idDoc">
                <template #title>
                  <div class="collapseName">其他证件信息:</div>
                </template>
                <el-form-item prop="identityInfo.idDocInfo.idDocCopy" label="证件正面照片"
                              style="align-items: center;font-weight: bold">
                  <template #label>
                    <labelExplain label="证件正面照片">
                      <template #explain>
                        <div>
                          证件类型不为“身份证”"时，上传证件正面照片。
                          请上传彩色照片or彩色扫描件or复印件（需加盖公章鲜章），可添加“微信支付”相关水印（如微信支付认证）
                          可上传1张图片
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <ShpUploadFile @success="(data)=>{uploadImageSuccessCallback(data,false,'','','')}"
                                 v-model="form_Info.identityInfo.idDocInfo.idDocCopy" :limit="1" :multiple="false"
                                 flag="businessAdditionPics"></ShpUploadFile>
                </el-form-item>
                <el-form-item prop="identityInfo.idDocInfo.idDocCopyBack" style="align-items: center;font-weight: bold"
                              label="证件反面照片">
                  <template #label>
                    <labelExplain label="证件反面照片">
                      <template #explain>
                        <div>
                          若证件类型为往来通行证、外国人居留证、港澳居住证、台湾居住证时，上传证件反面照片
                          若证件类型为护照，无需上传反面照片
                          可上传1张图片
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <ShpUploadFile @success="(data)=>{uploadImageSuccessCallback(data,false,'','','')}"
                                 v-model="form_Info.identityInfo.idDocInfo.idDocCopyBack" :limit="1" :multiple="false"
                                 flag="businessAdditionPics"></ShpUploadFile>
                </el-form-item>
                <el-form-item prop="identityInfo.idDocInfo.idDocName" style="align-items: center;font-weight: bold"
                              label="证件姓名">
                  <template #label>
                    <labelExplain label="证件姓名">
                      <template #explain>
                        <div>
                          请填写经营者/法定代表人的证件姓名，2~30个中文字符、英文字符、符号
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <el-input v-model="form_Info.identityInfo.idDocInfo.idDocName"></el-input>
                </el-form-item>
                <el-form-item prop="identityInfo.idDocInfo.idDocNumber" style="align-items: center;font-weight: bold"
                              label="证件号码">
                  <template #label>
                    <labelExplain label="证件号码">
                      <template #explain>
                        <div>
                          请填写经营者/法定代表人的证件号码
                          8-30位数字|字母|连字符
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <el-input v-model="form_Info.identityInfo.idDocInfo.idDocNumber"></el-input>
                </el-form-item>
                <el-form-item prop="identityInfo.idDocInfo.idDocAddress" style="align-items: center;font-weight: bold"
                              label="证件居住地址">
                  <template #label>
                    <labelExplain label="证件居住地址">
                      <template #explain>
                        <div>
                          主体类型为企业时，需要填写。其他主体类型，无需上传
                          请按照证件上住址填写，若证件上无住址则按照实际住址填写，如广东省深圳市南山区xx路xx号xx室。
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <el-input v-model="form_Info.identityInfo.idDocInfo.idDocAddress"></el-input>
                </el-form-item>
                <el-form-item prop="identityInfo.idDocInfo.docPeriodBegin" style="align-items: center;font-weight: bold"
                              label="证件有效期开始时间">
                  <template #label>
                    <labelExplain label="证件有效期开始时间">
                      <template #explain>
                        <div>
                          结束时间大于开始时间,
                          示例值：2026-06-06
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <ShpTimeChoose :chooseTag="'begin'" v-model="form_Info.identityInfo.idDocInfo.docPeriodBegin"
                                 :end-time="form_Info.identityInfo.idDocInfo.docPeriodEnd"></ShpTimeChoose>
                </el-form-item>
                <el-form-item prop="identityInfo.idDocInfo.docPeriodEnd" style="align-items: center;font-weight: bold"
                              label="证件有效期结束时间">
                  <template #label>
                    <labelExplain label="证件有效期结束时间">
                      <template #explain>
                        <div>
                          结束时间大于开始时间,
                          示例值：2026-06-06
                        </div>
                      </template>
                    </labelExplain>
                  </template>
                  <div class="content">
                    <div>
                      <el-switch active-text="长期有效"
                                 inactive-text="长期有效"
                                 inline-prompt @change="()=>{deadlinebySwitch('identityInfoIdDocInfo')}"
                                 v-model="isPermanentlyValid_identityInfo_idDocInfo" />
                    </div>
                    <div v-if="!isPermanentlyValid_identityInfo_idDocInfo" class="chooseEndDate">
                      <ShpTimeChoose :chooseTag="'end'" v-model="form_Info.identityInfo.idDocInfo.docPeriodEnd"
                                     :begin-time="form_Info.identityInfo.idDocInfo.docPeriodBegin"></ShpTimeChoose>
                    </div>
                  </div>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
          <el-collapse-item name="5" v-if="uboInfo">
            <template #title>
              <div class="collapseName">最终受益人信息列表(UBO):</div>
            </template>
            <!--     循环遍历生成       -->
            <div class="templateUboinfo" v-for="(item,index)  in form_Info.uboInfoList" :key="index">
              <div style="margin-bottom: 10px;display: flex;justify-content: flex-end"
                   @click="()=>deleteUboInfoPersion(index)">
                <el-icon size="20px" style="color: #a8a8a8">
                  <Close />
                </el-icon>
              </div>
              <el-form-item :prop="`uboInfoList.${index}.uboIdDocType`"
                            :rules="form_Info_Rules['uboInfoList.uboIdDocType']">
                <template #label>
                  <labelExplain label="证件类型">
                    <template #explain>
                      <div>
                        请填写受益人的证件类型
                      </div>
                    </template>
                  </labelExplain>
                </template>
                <el-select @change="(value)=>{changeUboIdDocType(value,index)}" style="width: 100%;"
                           v-model="item.uboIdDocType">
                  <el-option :label="item.label" v-for="item in uboIdDocTypeOption" :value="item.value"
                             :key="item.value">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :prop="`uboInfoList.${index}.uboIdDocCopy`"
                            :rules="form_Info_Rules['uboInfoList.uboIdDocCopy']"
                            style="align-items: center;font-weight: bold">
                <template #label>
                  <labelExplain label="证件正面照片">
                    <template #explain>
                      <div>
                        请上传受益人证件的正面照片，若证件类型为身份证，请上传人像面照片
                        请上传彩色照片or彩色扫描件or复印件（需加盖公章鲜章），可添加“微信支付”相关水印（如微信支付认证）
                      </div>
                    </template>
                  </labelExplain>
                </template>
                <ShpUploadFile
                  :ref="'positiveRef_'+index"
                  @success="(data)=>{uploadImageSuccessCallback(data,isVailidateOcrToUboInfoArray[index],'idCardOcr','positive','uboInfoListPositive',index)}"
                  v-model="item.uboIdDocCopy" :limit="1" :multiple="false"
                ></ShpUploadFile>
              </el-form-item>
              <el-form-item :prop="`uboInfoList.${index}.uboIdDocCopyBack`"
                            :rules="form_Info_Rules['uboInfoList.uboIdDocCopyBack']"
                            style="align-items: center;font-weight: bold">
                <template #label>
                  <labelExplain label="证件反面照片">
                    <template #explain>
                      <div>
                        请上传受益人证件的反面照片，若证件类型为身份证，请上传人像面照片
                        请上传彩色照片or彩色扫描件or复印件（需加盖公章鲜章），可添加“微信支付”相关水印（如微信支付认证）
                      </div>
                    </template>
                  </labelExplain>
                </template>
                <ShpUploadFile
                  :ref="'oppositeRef_'+index"
                  @success="(data)=>{uploadImageSuccessCallback(data,isVailidateOcrToUboInfoArray[index],'idCardOcr','opposite','uboInfoListOpposite',index)}"
                  v-model="item.uboIdDocCopyBack" :limit="1" :multiple="false"
                  flag="businessAdditionPics"></ShpUploadFile>
              </el-form-item>
              <el-form-item :prop="`uboInfoList.${index}.uboIdDocName`"
                            :rules="form_Info_Rules['uboInfoList.uboIdDocName']"
                            style="align-items: center;font-weight: bold"
                            label="证件姓名">
                <template #label>
                  <labelExplain label="证件姓名">
                    <template #explain>
                      <div>
                        请填写证件姓名
                      </div>
                    </template>
                  </labelExplain>
                </template>
                <el-input v-model="item.uboIdDocName"></el-input>
              </el-form-item>
              <el-form-item :prop="`uboInfoList.${index}.uboIdDocNumber`"
                            :rules="form_Info_Rules['uboInfoList.uboIdDocNumber']"
                            style="align-items: center;font-weight: bold"
                            label="证件号码">
                <template #label>
                  <labelExplain label="证件号码">
                    <template #explain>
                      <div>
                        请填写证件号码
                      </div>
                    </template>
                  </labelExplain>
                </template>
                <el-input v-model="item.uboIdDocNumber"></el-input>
              </el-form-item>
              <el-form-item :prop="`uboInfoList.${index}.uboIdDocAddress`"
                            :rules="form_Info_Rules['uboInfoList.uboIdDocAddress']"
                            style="align-items: center;font-weight: bold"
                            label="证件居住地址">
                <template #label>
                  <labelExplain label="证件居住地址">
                    <template #explain>
                      <div>
                        请按照证件上住址填写，若证件上无住址则按照实际住址填写，如广东省深圳市南山区xx路xx号xx室

                      </div>
                    </template>
                  </labelExplain>
                </template>
                <el-input v-model="item.uboIdDocAddress"></el-input>
              </el-form-item>
              <el-form-item :prop="`uboInfoList.${index}.uboPeriodBegin`"
                            :rules="form_Info_Rules['uboInfoList.uboPeriodBegin']"
                            style="align-items: center;font-weight: bold"
                            label="证件有效期开始时间">
                <template #label>
                  <labelExplain label="证件有效期开始时间">
                    <template #explain>
                      <div>
                        结束时间大于开始时间,
                        示例值：2026-06-06
                      </div>
                    </template>
                  </labelExplain>
                </template>
                <ShpTimeChoose
                  :default-time="item.uboPeriodBegin"
                  :chooseTag="'begin'" v-model="item.uboPeriodBegin"
                  :end-time="item.uboPeriodEnd"></ShpTimeChoose>
              </el-form-item>
              <el-form-item :prop="`uboInfoList.${index}.uboPeriodEnd`"
                            :rules="form_Info_Rules['uboInfoList.uboPeriodEnd']"
                            style="align-items: center;font-weight: bold"
                            label="证件有效期结束时间">
                <template #label>
                  <labelExplain label="证件有效期结束时间">
                    <template #explain>
                      <div>
                        结束时间大于开始时间,
                        示例值：2026-06-06
                      </div>
                    </template>
                  </labelExplain>
                </template>
                <div class="content">
                  <div>
                    <el-switch active-text="长期有效"
                               inactive-text="长期有效"
                               inline-prompt @change="()=>{deadlinebySwitch('uboInfoList',index)}"
                               v-model="isPermanentlyValid_uboInfoList[index]" />
                  </div>
                  <div v-if="!isPermanentlyValid_uboInfoList[index]" class="chooseEndDate">
                    <ShpTimeChoose
                      :default-time="item.uboPeriodEnd"
                      :chooseTag="'end'" v-model="item.uboPeriodEnd"
                      :begin-time="item.uboPeriodBegin"></ShpTimeChoose>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div style="text-align: center;margin-top: 10px">
              <el-button size="small" type="primary" @click="addUboInfoPersion">添加受益人</el-button>
            </div>
          </el-collapse-item>

        </el-collapse>
      </el-form>
      <el-button @click="submit">校验</el-button>
    </el-card>
  </div>
</template>
<script setup>
//主体资料
import { getCurrentInstance, nextTick, onMounted, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import labelExplain from "./labelExplain.vue";
import { getToken } from "@/utils/auth";
import ShpUploadFile from "./ShpUploadFile.vue";
import ShpTimeChoose from "@/views/insurance/customer/components/ShpTimeChoose";
import { bizLicenseOcr, enterpriseLicenseOCR, idCardOcr } from "@/api/insurance/wechatIncoming";
import { Close } from "@element-plus/icons-vue";
//token信息
const uploadData = ref({
  uploadUrl: import.meta.env.VITE_APP_BASE_API + "pay/media/wxPictureUpload",
  token: getToken()
});
//全局代理对象
const proxy = getCurrentInstance();
/**变量定义*/
//上传组件实例（身份证和其他证件上传的实例）
const licenseCopy_Instance = ref(null);
const idCardInfoIdCardCopy_Instance = ref(null);
const idCardInfoIdCardNational_Instance = ref(null);
const uboInfoListUboIdDocCopy_Instance = ref(null);
const uboInfoListUboIdDocCopyBack_Instance = ref(null);
const certificateInfoCertCopy_Instance = ref(null);
//证件持有人选择控制
let controlIdHolderTypeDisabled = ref(true);
//最终受益人的证件是否需要ocr校验
const isVailidateOcrToUboInfo = ref(false);
//上传文件失败清除文件的方法
const uploadInstances = ref({
  licenseCopyInstance: () => {
    licenseCopy_Instance.value.removeFile();
  },
  idCardInfoIdCardCopyInstance: () => {
    idCardInfoIdCardCopy_Instance.value.removeFile();
  },
  idCardInfoIdCardNationalInstance: () => {
    idCardInfoIdCardNational_Instance.value.removeFile();
  },
  uboInfoListUboIdDocCopyInstance: () => {
    uboInfoListUboIdDocCopy_Instance.value.removeFile();
  },
  uboInfoListUboIdDocCopyBackInstance: () => {
    uboInfoListUboIdDocCopyBack_Instance.value.removeFile();
  },
  certificateInfoCertCopyInstance: () => {
    certificateInfoCertCopy_Instance.value.removeFile();
  }
});
//存储特殊文件ocr校验后回传的值用于默认填写
const specialChecksData = ref({
  licenseCopyData: {},//营业执照校验信息
  idCardInfoIdCardCopyData: {},//身份证人像面照片信息
  idCardInfoIdCardNationalData: {},//身份证反向面照片信息
  uboInfoListUboIdDocCopyData: {},//最终受益人证件正向面信息
  uboInfoListUboIdDocCopyBackData: {},//最终受益人证件反向面信息
  certificateInfoCertCopyData: {},//登记证书照片信息
  uboInfoListPositiveData: [],  //存放最终受益人正面信息
  uboInfoListOppositeData: []//存放最终受益人反面信息
});
//最终受益人当中是否需要进行身份校验（仅有当证件类型选择身份证的时候需要ocr身份校验）
const isVailidateOcrToUboInfoArray = ref([]);
//表单主体信息
const form_Info = ref({
  subjectType: null, //主体类型
  financeInstitution: false,//是否是金融机构
  certificateLetterCopy: null,//单位证明函照片
  //-营业执照
  businessLicenseInfo: {
    //营业执照照片
    licenseCopy: null,
    //注册号/统一社会信用代码
    licenseNumber: null,
    //商户名称
    merchantName: null,
    //个体户经营者/法人姓名
    legalPerson: null,
    //注册地址
    licenseAddress: null,
    //开始时间
    periodBegin: null,
    //结束时间
    periodEnd: null
  },
  //登记证书
  certificateInfo: {
    //登记证书照片
    certCopy: null,
    // 登记证书类型
    certType: null,
    //证书号
    certNumber: null,
    //商户名称
    merchantName: null,
    //注册地址
    companyAddress: null,
    //法定代表
    legalPerson: null,
    //有效期限开始日期
    periodBegin: null,
    //有效期限结束日期
    periodEnd: null
  },
  //金融机构许可证信息
  financeInstitutionInfo: {
    //金融机构类型
    financeType: null,
    //金融机构许可证图片
    financeLicensePics: null
  },
  // 经营者/法人身份证件
  identityInfo: {
    //证件持有人类型
    idHolderType: "LEGAL",
    // 证件类型
    idDocType: null,
    //法定代表人说明函
    authorizeLetterCopy: null,
    //经营者/法人是否为受益人
    owner: false,
    // 身份证信息
    idCardInfo: {
      //身份证人像面照片
      idCardCopy: null,
      //身份证国徽面照片
      idCardNational: null,
      //身份证姓名
      idCardName: null,
      //身份证号码
      idCardNumber: null,
      //身份证居住地址
      idCardAddress: null,
      cardPeriodBegin: null,
      cardPeriodEnd: null
    },
    //其他类型证件信息
    idDocInfo: {
      //证件正面照片
      idDocCopy: null,
      //证件反面照片
      idDocCopyBack: null,
      //证件姓名
      idDocName: null,
      //证件号码
      idDocNumber: null,
      //证件居住地址
      idDocAddress: null,
      //开始日期
      docPeriodBegin: null,
      // 结束日期
      docPeriodEnd: null
    }
  },
  //最终受益人信息列表
  uboInfoList: []

});
//取消监听收集器数组
let clearWatchArray = ref([]);
//外层折叠面板name数组
let activeNames = ref([]);
//内层折叠面板name数组
let innerActiveNames = ref([]);
//营业执照中证件结束时间选择器是否展示
const isPermanentlyValid_businessLicenseInfo = ref(false);
//登记证书中证件结束时间选择器是否展示
const isPermanentlyValid_certificateInfo = ref(false);
//身份证信息中证件结束时间选择器是否展示
const isPermanentlyValid_identityInfo_idCardInfo = ref(false);
//其他证件信息中证件结束时间选择器是否展示
const isPermanentlyValid_identityInfo_idDocInfo = ref(false);
//最终受益人当中证件结束时间选择器师傅展示的集合
let isPermanentlyValid_uboInfoList = ref([]);
//单位函证明是否展示
const isShowCertificateLetterCopy = ref(true);
//控制身份证信息展示
const isIdCard = ref(false);
//控制其他证件信息的展示
const idDoc = ref(false);
//控制营业执照是否展示
const isShowBusiness = ref(false);
// 控制登记证书是否展示
const isShowCertificate = ref(false);
//控制最终受益人信息列表是否展示
const uboInfo = ref(false);
//form表单实例
let instance_Form = ref(null);
/**常量定义*/
//主体类型
const isSubjectType = ref(null);
//主体类型选择选项
const subjectTypeOption = ref([
  {
    label: "个体户",
    value: "SUBJECT_TYPE_INDIVIDUAL"
  },
  {
    label: "企业",
    value: "SUBJECT_TYPE_ENTERPRISE"
  },
  {
    label: "政府机关",
    value: "SUBJECT_TYPE_GOVERNMENT"
  },
  {
    label: "事业单位",
    value: "SUBJECT_TYPE_INSTITUTIONS"
  },
  {
    label: "社会组织",
    value: "SUBJECT_TYPE_OTHERS"
  }
]);
//金融机构类型选择选项
const financeTypeOption = ref([
  {
    label: "银行业",
    value: "BANK_AGENT"
  },
  {
    label: "支付机构",
    value: "PAYMENT_AGENT"
  },
  {
    label: "交易及结算类金融机构",
    value: "INSURANCE"
  },
  {
    label: "保险业",
    value: "TRADE_AND_SETTLE"
  },
  {
    label: "其他金融机构",
    value: "OTHER"
  }
]);
//证件类型选项
const idDocTypeOption = ref([
  {
    label: "中国大陆居民-身份证",
    value: "IDENTIFICATION_TYPE_IDCARD",
    disabled: false
  },
  {
    label: "其他国家或地区居民-护照",
    value: "IDENTIFICATION_TYPE_OVERSEA_PASSPORT",
    disabled: false
  },
  {
    label: "中国香港居民-来往内地通行证",
    value: "IDENTIFICATION_TYPE_HONGKONG_PASSPORT",
    disabled: false
  },
  {
    label: "中国澳门居民-来往内地通行证",
    value: "IDENTIFICATION_TYPE_MACAO_PASSPORT",
    disabled: false
  },
  {
    label: "中国台湾居民-来往大陆通行证",
    value: "IDENTIFICATION_TYPE_TAIWAN_PASSPORT",
    disabled: false
  },
  {
    label: "外国人居留证",
    value: "IDENTIFICATION_TYPE_FOREIGN_RESIDENT",
    disabled: false
  },
  {
    label: "港澳居民证",
    value: "DENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT",
    disabled: false
  },
  {
    label: "台湾居民证",
    value: "IDENTIFICATION_TYPE_TAIWAN_RESIDENT",
    disabled: false
  }
]);
//其他受益人证件类型选择选项
const uboIdDocTypeOption = ref([
  {
    label: "中国大陆居民-身份证",
    value: "IDENTIFICATION_TYPE_IDCARD",
    disabled: false
  },
  {
    label: "其他国家或地区居民-护照",
    value: "IDENTIFICATION_TYPE_OVERSEA_PASSPORT",
    disabled: false
  },
  {
    label: "中国香港居民-来往内地通行证",
    value: "IDENTIFICATION_TYPE_HONGKONG_PASSPORT",
    disabled: false
  },
  {
    label: "中国澳门居民-来往内地通行证",
    value: "IDENTIFICATION_TYPE_MACAO_PASSPORT",
    disabled: false
  },
  {
    label: "中国台湾居民-来往大陆通行证",
    value: "IDENTIFICATION_TYPE_TAIWAN_PASSPORT",
    disabled: false
  },
  {
    label: "外国人居留证",
    value: "IDENTIFICATION_TYPE_FOREIGN_RESIDENT",
    disabled: false
  },
  {
    label: "港澳居民证",
    value: "DENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT",
    disabled: false
  },
  {
    label: "台湾居民证",
    value: "IDENTIFICATION_TYPE_TAIWAN_RESIDENT",
    disabled: false
  }
]);
//登记证书选项
const certTypeOption = ref([
  {
    label: "事业单位法人证书",
    value: "CERTIFICATE_TYPE_2388",
    disabled: false
  },
  {
    label: "统一社会信用代码证书",
    value: "CERTIFICATE_TYPE_2389",
    disabled: false
  },
  {
    label: "社会团体法人登记证书",
    value: "CERTIFICATE_TYPE_2394",
    disabled: false
  },
  {
    label: "民办非企业单位登记证书",
    value: "CERTIFICATE_TYPE_2395",
    disabled: false
  },
  {
    label: "基金会法人登记证书",
    value: "CERTIFICATE_TYPE_2396",
    disabled: false
  },
  {
    label: "执业许可证/执业证",
    value: "CERTIFICATE_TYPE_2520",
    disabled: false
  },
  {
    label: "基层群众性自治组织特别法人统一社会信用代码证",
    value: "CERTIFICATE_TYPE_2521",
    disabled: false
  },
  {
    label: "农村集体经济组织登记证",
    value: "CERTIFICATE_TYPE_2522",
    disabled: false
  },
  {
    label: "宗教活动场所登记证",
    value: "CERTIFICATE_TYPE_2399",
    disabled: false
  },
  {
    label: "政府部门下发的其他有效证明文件",
    value: "CERTIFICATE_TYPE_2400",
    disabled: false
  }
]);
/**方法定义*/
//选择最终受益人的证件类型
const changeUboIdDocType = (value, index) => {
  //如果为身份证需要ocr校验
  if (value == "IDENTIFICATION_TYPE_IDCARD") {
    isVailidateOcrToUboInfoArray.value[index] = true;
  } else {
    isVailidateOcrToUboInfoArray.value[index] = false;
  }
};
//添加受益人
const addUboInfoPersion = () => {
    let itemObj = {
      //证件类型
      uboIdDocType: null,
      //证件正面照片
      uboIdDocCopy: null,
      //证件反面照片
      uboIdDocCopyBack: null,
      //证件姓名
      uboIdDocName: null,
      // 证件号码
      uboIdDocNumber: null,
      // 证件居住地址
      uboIdDocAddress: null,
      //证件有效期开始时间
      uboPeriodBegin: null,
      // 证件有效期结束时间
      uboPeriodEnd: null
    };
    let { owner } = form_Info.value.identityInfo;
    try {
      if (owner) {
        if (form_Info.value.uboInfoList.length > 2) {
          ElMessage.error("最多存在4个受益人");
        } else {
          form_Info.value.uboInfoList.push(itemObj);
        }
      } else {
        if (form_Info.value.uboInfoList.length > 1) {
          ElMessage.error("最多存在3个受益人");
        } else {
          form_Info.value.uboInfoList.push(itemObj);
        }
      }
    } finally {
      form_Info.value.uboInfoList.forEach((item, index) => {
        //初始化添加的受益人是否需要进行ocr校验
        if (!(isVailidateOcrToUboInfoArray.value[index] instanceof Boolean)) {
          isVailidateOcrToUboInfoArray.value[index] = false;
        }
        console.log((isPermanentlyValid_uboInfoList.value[index] instanceof Boolean));
        //初始化长期的选择器是否展示
        if (!(isPermanentlyValid_uboInfoList.value[index] instanceof Boolean)) {
          isPermanentlyValid_uboInfoList.value[index] = false;
        }
      });
      clearWatchArray.value = [];
      form_Info.value.uboInfoList.forEach((item, index) => {
        clearWatchArray.value.push(watch(() => form_Info.value.uboInfoList[index].uboPeriodEnd, () => {
            if (form_Info.value.uboInfoList[index].uboPeriodEnd == "长期") {
              isPermanentlyValid_uboInfoList.value[index] = true;
            } else {
              isPermanentlyValid_uboInfoList.value[index] = false;
            }
          })
        );
      });
      instance_Form.value.validate();

    }
  }
;
//删除受益人
const deleteUboInfoPersion = (index) => {
  let { owner } = form_Info.value.identityInfo;
  if (index == 0 && !owner) {
    ElMessage.error("经营者/法人不为受益人时，至少填写一个最终受益人");
    return;
  }
  console.log(clearWatchArray.value);
  form_Info.value.uboInfoList.splice(index, 1);
  isVailidateOcrToUboInfoArray.value.splice(index, 1);
  isPermanentlyValid_uboInfoList.value.splice(index, 1);
  console.log(clearWatchArray.value[index], "fn");
  clearWatchArray.value[index]();
};
//监听specialChecksData当中的值将值回显到对应选项当中
watch(() => specialChecksData.value, () => {
  // 遍历当前对象将对应的值添加到指定的form_info对象当中
  try {
    Object.keys(specialChecksData.value).forEach(key => {
      switch (key) {
        case "licenseCopyData": {
          let {
            regNum,
            name,
            person,
            address,
            beginTime,
            endTime
          } = specialChecksData.value[key];
          form_Info.value.businessLicenseInfo.licenseNumber = regNum;
          form_Info.value.businessLicenseInfo.merchantName = name;
          form_Info.value.businessLicenseInfo.legalPerson = person;
          form_Info.value.businessLicenseInfo.licenseAddress = address;
          form_Info.value.businessLicenseInfo.periodBegin = beginTime;
          form_Info.value.businessLicenseInfo.periodEnd = endTime;
        }
          break;
        case "idCardInfoIdCardCopyData": {
          let { address = "", idNum = "", name = "" } = specialChecksData.value[key];
          form_Info.value.identityInfo.idCardInfo.idCardName = name;
          form_Info.value.identityInfo.idCardInfo.idCardNumber = idNum;
          form_Info.value.identityInfo.idCardInfo.idCardAddress = address;
          break;
        }
        case "idCardInfoIdCardNationalData": {
          let { beginTime, endTime } = specialChecksData.value[key];
          form_Info.value.identityInfo.idCardInfo.cardPeriodBegin = beginTime;
          form_Info.value.identityInfo.idCardInfo.cardPeriodEnd = endTime;
          break;
        }
        case "uboInfoListUboIdDocCopyData": {
          let { address = "", idNum = "", name = "" } = specialChecksData.value[key];
          form_Info.value.uboInfoList.uboIdDocName = name;
          form_Info.value.uboInfoList.uboIdDocNumber = idNum;
          form_Info.value.uboInfoList.uboIdDocAddress = address;
          break;
        }
        case "uboInfoListUboIdDocCopyBackData": {
          break;
        }
        case "uboInfoListPositiveData": {
          //遍历数组对应赋值
          specialChecksData.value[key].forEach((item, index) => {
            let { address = "", idNum = "", name = "" } = item;
            form_Info.value.uboInfoList[index].uboIdDocName = name;
            form_Info.value.uboInfoList[index].uboIdDocNumber = idNum;
            form_Info.value.uboInfoList[index].uboIdDocAddress = address;
          });
          break;
        }
        case "uboInfoListOppositeData": {
          specialChecksData.value[key].forEach((item, index) => {
            let { beginTime, endTime } = item;
            form_Info.value.uboInfoList[index].uboPeriodBegin = beginTime;
            form_Info.value.uboInfoList[index].uboPeriodEnd = endTime;
          });
          break;
        }
      }
    });
  } finally {
    instance_Form.value.validate();
  }


}, {
  immediate: false,
  deep: true
});

/**自定义校验规则定义*/
//自定义校验统一社会信用代码
const validateLicenseNumber = (rule, value, callback) => {
  let validateReg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
  if (validateReg.test(value)) {
    callback();
  } else {
    callback(new Error("请填写符合格式的18位统一社会信用代码"));
  }
};
//自定义单位证明函证书校验
const validateCertificateLetterCopy = (rule, value, callback) => {
  if (isSubjectType.value) {
    if (!value && (isSubjectType.value !== "政府机关" || isSubjectType.value == "事业单位")) {
      callback(new Error("请上传单位函证书"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
//自定义金融机构许可证图片校验
const validateFinanceLicensePics = (rule, value, callback) => {
  callback(new Error("请上传金融机构许可证图片"));
};
//自定义法人代表说明函校验
const validateAuthorizeLetterCopy = (rule, value, callback) => {
  let { idHolderType } = form_Info.value.identityInfo;
  console.log(idHolderType);
  if (idHolderType == "SUPER" && value == null) {
    callback(new Error("请上传法人代表说明函"));
  } else {
    callback();
  }

};
//自定义身份证信息中身份证号码校验
const validateIdCardInfoIdCardNumber = (rule, value, callback) => {
  let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (value === "" || value === undefined) {
    callback(new Error("请输入正确的身份证件号码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的身份证件号码"));
  } else {
    callback();
  }
};
//自定义身份证信息当中身份证居住地址的校验
const validateIdCardInfoIdCardAddress = (rule, value, callback) => {
  if (isSubjectType.value == "企业" && value == "") {
    callback(new Error("主体类型为企业该选项必填"));
  } else {
    callback();
  }
};
//自定义其他类型证件信息中证件反面照片的校验
const validateIdDocInfoIdDocCopyBack = (rule, value, callback) => {
  let { idDocType } = form_Info.value.identityInfo;
  //若为护照无需上传
  if (value == "" && idDocType == "IDENTIFICATION_TYPE_OVERSEA_PASSPORT") {
    callback();
  } else if (value == "" && idDocType !== "IDENTIFICATION_TYPE_OVERSEA_PASSPORT") {
    callback("请上传证件反面照片");
  } else {
    callback();
  }
};
//自定义其他证件类型居住地址的校验
const validateIdDocInfoIdDocAddress = (rule, value, callback) => {
  if (isSubjectType.value == "企业" && value == "") {
    callback(new Error("主体类型为企业该选项必填"));
  } else {
    callback();
  }
};
//自定义经营者/法人是否为受益人
const validateIdDocInfoOwner = (rule, value, callback) => {
  // let { owner } = form_Info.value.identityInfo;
  // if (isSubjectType.value == "企业" && owner == false) {
  //   callback(new Error("请选择经营者/法人是否为受益人"));
  // } else {
  //   callback();
  // }
  callback();
};
//自定义最终受益人列表当中证件反面照片的校验
const validateUboInfoListUboIdDocCopyBack = (rule, value, callback) => {
  let { owner } = form_Info.value.identityInfo;
  if (!owner) {
    let index = Number(rule.field.split(".")[1]);
    let { uboIdDocType } = form_Info.value.uboInfoList[index];
    //若为护照无需上传
    if (value == null && uboIdDocType == "IDENTIFICATION_TYPE_OVERSEA_PASSPORT") {
      callback();
    } else if (value == null && uboIdDocType !== "IDENTIFICATION_TYPE_OVERSEA_PASSPORT") {
      callback("请上传证件反面照片");
    } else {
      callback();
    }
  } else {
    callback();
  }
};
/**表单校验规则汇总*/
const form_Info_Rules = ref({
  "subjectType": [
    { required: true, message: "请选择主体类型", trigger: "change" }
  ],
  "certificateLetterCopy": [
    { required: true, validator: validateCertificateLetterCopy, trigger: "blur" }
    // { required: true, message: "请上传单位函证明", trigger: "change" }
  ],
  //营业执照
  "businessLicenseInfo.licenseNumber": [
    { required: true, message: "请填写注册号/统一社会信用代码", trigger: "blur" },
    { required: true, validator: validateLicenseNumber, trigger: "blur" }
  ],
  "businessLicenseInfo.licenseCopy": [
    // { required: true, validator: validateLicenseCopy, trigger: "blur" }
    { required: true, message: "请上传营业执照照片", trigger: "change" }
  ],
  "businessLicenseInfo.merchantName": [
    { required: true, message: "请填写商户名称", trigger: "blur" }
  ],
  "businessLicenseInfo.legalPerson": [
    { required: true, message: "请填写个体户经营者/法人姓名", trigger: "blur" }
  ],
  "businessLicenseInfo.licenseAddress": [
    { required: true, message: "请填写注册地址", trigger: "blur" }
  ],
  "businessLicenseInfo.periodBegin": [
    { required: true, message: "请选择有效期限开始日期", trigger: "blur" }
  ],
  "businessLicenseInfo.periodEnd": [
    { required: true, message: "请选择有效期限结束日期", trigger: "blur" }
  ],
  //登记证书
  "certificateInfo.certCopy": [
    { required: true, message: "请上传登记证书照片", trigger: "change" }
  ],
  "certificateInfo.certType": [
    // { required: true, validator: validateCertType, trigger: "blur" },
    { required: true, message: "请选择登记证书类型", trigger: "change" }
  ],
  "certificateInfo.certNumber": [
    { required: true, message: "请填写证书编号", trigger: "blur" }
  ],
  "certificateInfo.merchantName": [
    { required: true, message: "请填写商户名称", trigger: "blur" }
  ],
  "certificateInfo.companyAddress": [
    { required: true, message: "请填写注册地址", trigger: "blur" }
  ],
  "certificateInfo.legalPerson": [
    { required: true, message: "请填写法定代表", trigger: "blur" }
  ],
  "certificateInfo.periodBegin": [
    { required: true, message: "请选择有效期限开始日期", trigger: "blur" }
  ],
  "certificateInfo.periodEnd": [
    { required: true, message: "请选择有效期限结束日期", trigger: "blur" }
  ],
//金融机构许可证信息
  "financeInstitutionInfo.financeLicensePics": [
    // { required: true, validator: validateFinanceLicensePics, trigger: "blur" },
    { required: true, message: "请上传金融机构许可照片", trigger: "change" }
  ],
  "financeInstitutionInfo.financeType": [
    { required: true, message: "请选择金融机构类型", trigger: "change" }
  ],
//  经营者/法人身份证件
  "identityInfo.idHolderType": [
    // { required: true, message: "请选择证件持有人类型", trigger: "change" }
  ],
  "identityInfo.idDocType": [
    { required: true, message: "请选择证件类型", trigger: "change" }
  ],
  "identityInfo.authorizeLetterCopy": [
    { required: true, validator: validateAuthorizeLetterCopy, trigger: "blur" }
  ],
//  身份证信息校验
//  身份证人像面照片
  "identityInfo.idCardInfo.idCardCopy": [
    // { required: true, validator: validateIdCardInfoIdCardCopy, trigger: "blur" }
    { required: true, message: "请上传身份证人身面照片", trigger: "change" }
  ],
  "identityInfo.idCardInfo.idCardNational": [
    // { required: true, validator: validateIdCardInfoIdCardNational, trigger: "blur" }
    { required: true, message: "请上传身份证国徽面照片", trigger: "change" }
  ],
  "identityInfo.idCardInfo.idCardName": [
    { required: true, message: "请填写身份证姓名", trigger: "blur" }
  ],
  "identityInfo.idCardInfo.idCardNumber": [
    { required: true, validator: validateIdCardInfoIdCardNumber, trigger: "blur" }
  ],
  "identityInfo.idCardInfo.idCardAddress": [
    { required: true, validator: validateIdCardInfoIdCardAddress, trigger: "blur" }
  ],
  "identityInfo.idCardInfo.cardPeriodBegin": [
    { required: true, message: "请选择身份证有效期开始时间", trigger: "change" }
  ],
  "identityInfo.idCardInfo.cardPeriodEnd": [
    { required: true, message: "请选择身份证有效期结束时间", trigger: "change" }
  ],
//  其他类型证件信息
  "identityInfo.idDocInfo.idDocCopy": [
    { required: true, message: "请上传证件正面照片", trigger: "change" }
  ],
  "identityInfo.idDocInfo.idDocCopyBack": [
    { required: true, validator: validateIdDocInfoIdDocCopyBack, trigger: "blur" }
  ],
  "identityInfo.idDocInfo.idDocName": [
    { required: true, message: "请填写证件姓名", trigger: "blur" }
  ],
  "identityInfo.idDocInfo.idDocNumber": [
    { required: true, message: "请填写证件号码", trigger: "blur" }
  ],
  "identityInfo.idDocInfo.idDocAddress": [
    { required: true, validator: validateIdDocInfoIdDocAddress, trigger: "blur" }
  ],
  "identityInfo.idDocInfo.docPeriodBegin": [
    { required: true, message: "请选择证件有效期开始时间", trigger: "change" }
  ],
  "identityInfo.idDocInfo.docPeriodEnd": [
    { required: true, message: "请选择证件有效期结束时间", trigger: "blur" }
  ],
  "identityInfo.idDocInfo.owner": [
    { required: true, validator: validateIdDocInfoOwner, trigger: "blur" }
  ],
//最终受益人信息列表
  "uboInfoList.uboIdDocType": [
    { required: true, message: "请选择证件类型", trigger: "change" }
  ],
  "uboInfoList.uboIdDocCopy": [
    { required: true, message: "请上传证件正面照片", trigger: "change" }
  ],
  "uboInfoList.uboIdDocCopyBack": [
    { required: true, validator: validateUboInfoListUboIdDocCopyBack, trigger: "blur" }
  ],
  "uboInfoList.uboIdDocName": [
    { required: true, message: "请填写证件姓名", trigger: "blur" }
  ],
  "uboInfoList.uboIdDocNumber": [
    { required: true, message: "请填写证件号码", trigger: "blur" }
  ],
  "uboInfoList.uboIdDocAddress": [
    { required: true, message: "请填写证件居住地址", trigger: "blur" }
  ],
  "uboInfoList.uboPeriodBegin": [
    { required: true, message: "请选择证件有效期开始时间", trigger: "blur" }
  ],
  "uboInfoList.uboPeriodEnd": [
    { required: true, message: "请选择证件有效期结束时间", trigger: "blur" }
  ]
});
/**重置方法*/
//重置最终受益人信息列表
const resetUboInfoList = () => {
  form_Info.value.uboInfoList = [{
    //证件类型
    uboIdDocType: null,
    //证件正面照片
    uboIdDocCopy: null,
    //证件反面照片
    uboIdDocCopyBack: null,
    //证件姓名
    uboIdDocName: null,
    // 证件号码
    uboIdDocNumber: null,
    // 证件居住地址
    uboIdDocAddress: null,
    //证件有效期开始时间
    uboPeriodBegin: null,
    // 证件有效期结束时间
    uboPeriodEnd: null
  }];

};
//重置营业执照的数据
const resetBusinessLicenseInfo = () => {
  form_Info.value.businessLicenseInfo = {
    //营业执照照片
    licenseCopy: null,
    //注册号/统一社会信用代码
    licenseNumber: null,
    //商户名称
    merchantName: null,
    //个体户经营者/法人姓名
    legalPerson: null,
    //注册地址
    licenseAddress: null,
    //开始时间
    periodBegin: null,
    //结束时间
    periodEnd: null
  };
};
//重置登记证书数据
const resetCertificateInfo = () => {
  form_Info.value.certificateInfo = {
    //登记证书照片
    certCopy: null,
    // 登记证书类型
    certType: null,
    //证书号
    certNumber: null,
    //商户名称
    merchantName: null,
    //注册地址
    companyAddress: null,
    //法定代表
    legalPerson: null,
    //有效期限开始日期
    periodBegin: null,
    //有效期限结束日期
    periodEnd: null
  };
};
//重置身份证信息数据
const resetIdCardInfo = () => {
  form_Info.value.identityInfo.idCardInfo = {
    //身份证人像面照片
    idCardCopy: null,
    //身份证国徽面照片
    idCardNational: null,
    //身份证姓名
    idCardName: null,
    //身份证号码
    idCardNumber: null,
    //身份证居住地址
    idCardAddress: null,
    cardPeriodBegin: null,
    cardPeriodEnd: null
  };
};
//重置其他证件信息数据
const resetIdDocInfo = () => {
  form_Info.value.identityInfo.idDocInfo = {
    //证件正面照片
    idDocCopy: null,
    //证件反面照片
    idDocCopyBack: null,
    //证件姓名
    idDocName: null,
    //证件号码
    idDocNumber: null,
    //证件居住地址
    idDocAddress: null,
    //开始日期
    docPeriodBegin: null,
    // 结束日期
    docPeriodEnd: null
  };
};
/**方法定义*/
// 折叠展开
const ChangeCollapse = (activeNames) => {
  console.log(activeNames);
};
//选择主体类型
const chooseSubjectType = (value) => {
  if (value) {
    isSubjectType.value = subjectTypeOption.value.filter(item => {
      return item.value == value;
    }) [0].label;
    switch (value) {
      //个体户
      case "SUBJECT_TYPE_INDIVIDUAL":
        controlBusinessLicenseInfoRuler(true);
        controlCertificateInfoRuler(false);
        //改外层变量
        changeVariablesToOuterLayer();
        //改主体类型修改营业执照变量
        changeVariablesToBusinessLicenseInfo();
        //改主体类型修改登记证书变量
        changeVariablesToCertificateInfo();
        // 改金融机构许可证信息变量
        changeVariablesToFinanceInstitutionInfo();
        //改经营者/法人身份证件信息变量
        changeVariablesToIdentityInfo();
        //改最终受益人信息列表信息变量
        changeVariablesToUboInfoList();
        break;
      //  企业
      case "SUBJECT_TYPE_ENTERPRISE":
        controlBusinessLicenseInfoRuler(true);
        controlCertificateInfoRuler(false);
        //改外层变量
        changeVariablesToOuterLayer();
        //改主体类型修改营业执照变量
        changeVariablesToBusinessLicenseInfo();
        //改主体类型修改登记证书变量
        changeVariablesToCertificateInfo();
        // 改金融机构许可证信息变量
        changeVariablesToFinanceInstitutionInfo();
        //改经营者/法人身份证件信息变量
        changeVariablesToIdentityInfo();
        //改最终受益人信息列表信息变量
        changeVariablesToUboInfoList();
        break;
      //  政府机关
      case "SUBJECT_TYPE_GOVERNMENT":
        controlBusinessLicenseInfoRuler(false);
        controlCertificateInfoRuler(true);
        //改外层变量
        changeVariablesToOuterLayer();
        //改主体类型修改营业执照变量
        changeVariablesToBusinessLicenseInfo();
        //改主体类型修改登记证书变量
        changeVariablesToCertificateInfo();
        // 改金融机构许可证信息变量
        changeVariablesToFinanceInstitutionInfo();
        //改经营者/法人身份证件信息变量
        changeVariablesToIdentityInfo();
        //改最终受益人信息列表信息变量
        changeVariablesToUboInfoList();
        break;
      // 事业单位
      case "SUBJECT_TYPE_INSTITUTIONS":
        controlBusinessLicenseInfoRuler(false);
        controlCertificateInfoRuler(true);
        //改外层变量
        changeVariablesToOuterLayer();
        //改主体类型修改营业执照变量
        changeVariablesToBusinessLicenseInfo();
        //改主体类型修改登记证书变量
        changeVariablesToCertificateInfo();
        // 改金融机构许可证信息变量
        changeVariablesToFinanceInstitutionInfo();
        //改经营者/法人身份证件信息变量
        changeVariablesToIdentityInfo();
        //改最终受益人信息列表信息变量
        changeVariablesToUboInfoList();
        break;
      //  社会组织
      case "SUBJECT_TYPE_OTHERS":
        controlBusinessLicenseInfoRuler(false);
        controlCertificateInfoRuler(true);
        //改外层变量
        changeVariablesToOuterLayer();
        //改主体类型修改营业执照变量
        changeVariablesToBusinessLicenseInfo();
        //改主体类型修改登记证书变量
        changeVariablesToCertificateInfo();
        // 改金融机构许可证信息变量
        changeVariablesToFinanceInstitutionInfo();
        //改经营者/法人身份证件信息变量
        changeVariablesToIdentityInfo();
        //改最终受益人信息列表信息变量
        changeVariablesToUboInfoList();
        break;
    }
  }
};
//选择是否为金融机构
const chooseFinanceInstitution = (value) => {
  controlFinanceInstitutionRuler(value);
};
//选择证件持有人类型
const chooseIdHolderType = (value) => {

  if (value == "LEGAL") {
    controlIdDocTypeRuler(true);
  } else {
    controlIdDocTypeRuler(false);
  }
//  清除数据

};
//改变主体类型修改外层变量的方法
const changeVariablesToOuterLayer = () => {
  // 单位证明函照片上传是否展示
  if (isSubjectType.value !== "政府机关" && isSubjectType.value !== "事业单位") {
    isShowCertificateLetterCopy.value = false;
  } else {
    isShowCertificateLetterCopy.value = true;
  }
  activeNames.value = ["1", "2", "3", "4", "5"];
};
//改变主体类型修改营业执照变量的方法
const changeVariablesToBusinessLicenseInfo = () => {
};
//改变主体类型修改登记证书变量的方法
const changeVariablesToCertificateInfo = () => {
  switch (isSubjectType.value) {
    case "个体户" :
      form_Info.value.certificateInfo.certType = "";
      certTypeOption.value.forEach(item => {
        item.disabled = true;
      });
      break;
    case "企业" :
      form_Info.value.certificateInfo.certType = "";
      certTypeOption.value.forEach(item => {
        item.disabled = true;
      });
      break;
    case "政府机关":
      form_Info.value.certificateInfo.certType = "CERTIFICATE_TYPE_2389";
      certTypeOption.value.forEach(item => {
        item.disabled = true;
      });
      break;
    case "事业单位":
      form_Info.value.certificateInfo.certType = "CERTIFICATE_TYPE_2388";
      certTypeOption.value.forEach(item => {
        item.disabled = true;
      });
      break;
    case "社会组织":
      certTypeOption.value.forEach(item => {
        if (item.label == "事业单位法人证书") {
          item.disabled = true;
        }
      });
      break;
    default:
      form_Info.value.certificateInfo.certType = "";
      certTypeOption.value.forEach(item => {
        item.disabled = false;
      });
  }
};
//修改金融机构许可证信息变量的方法
const changeVariablesToFinanceInstitutionInfo = () => {
};
//改变主体类型修改经营者/法人身份证件信息变量的方法
const changeVariablesToIdentityInfo = () => {
  if (isSubjectType.value == "政府机关") {
    form_Info.value.identityInfo.idDocType = "";
    idDocTypeOption.value.forEach(item => {
      if (!(item.label == "中国大陆居民-身份证")) {
        item.disabled = true;
      }
    });
  } else {
    idDocTypeOption.value.forEach(item => {
      item.disabled = false;
    });
  }

};
//改变主体类型修改最终受益人信息列表信息变量的方法
const changeVariablesToUboInfoList = () => {
  //是否展示最终受益人列表模块
  if (isSubjectType.value == "企业") {
    uboInfo.value = true;
  } else {
    uboInfo.value = false;
    //清空最终受益人数据
    resetUboInfoList();
  }
};
//改变登记证书类型
const changeCertificateInfoCertType = () => {
  console.log(form_Info.value.certificateInfo, "???");
  console.log(form_Info.value.certificateInfo.certType, "???");
};
//控制营业执照整体是否添加校验
const controlBusinessLicenseInfoRuler = (isAdd) => {
  let allRuleToBusiness = {};
  for (let itemKey in form_Info_Rules.value) {
    if (itemKey.split(".")[0] == "businessLicenseInfo") {
      Object.defineProperty(allRuleToBusiness, itemKey, {
        value: form_Info_Rules.value[itemKey],
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
  }
  if (isAdd) {
    isChangeRulerRequired(allRuleToBusiness, isAdd);
  } else {
    Object.keys(allRuleToBusiness).forEach(itemKey => {
      allRuleToBusiness[itemKey].forEach((nextItem, index) => {
        if (nextItem.hasOwnProperty("validator")) {
          allRuleToBusiness[itemKey].splice(index, 1);
        }
      });
    });
    isChangeRulerRequired(allRuleToBusiness, isAdd);
  }
};
//更改是否校验
const isChangeRulerRequired = (allRuleToBusiness, changeBoolean) => {
  for (const allRuleToBusinessKey in allRuleToBusiness) {
    allRuleToBusiness[allRuleToBusinessKey].forEach(item => {
      item.required = changeBoolean;
    });
  }
  Object.assign(form_Info_Rules.value, allRuleToBusiness);
};
//控制登记证书的填写
const controlCertificateInfoRuler = (isAdd) => {
  let allRuleToCertificateInfo = {};
  for (let itemKey in form_Info_Rules.value) {
    if (itemKey.split(".")[0] == "certificateInfo") {
      Object.defineProperty(allRuleToCertificateInfo, itemKey, {
        value: form_Info_Rules.value[itemKey],
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
  }
  if (isAdd) {
    isChangeRulerRequired(allRuleToCertificateInfo, isAdd);
  } else {
    Object.keys(allRuleToCertificateInfo).forEach(itemKey => {
      allRuleToCertificateInfo[itemKey].forEach((nextItem, index) => {
        if (nextItem.hasOwnProperty("validator")) {
          allRuleToCertificateInfo[itemKey].splice(index, 1);
        }
      });
    });
    isChangeRulerRequired(allRuleToCertificateInfo, isAdd);
  }
};
//控制金融机构许可证信息选项是否校验
const controlFinanceInstitutionRuler = (isAdd) => {
  let allRuleToFinanceInstitution = {};
  for (let itemKey in form_Info_Rules.value) {
    if (itemKey.split(".")[0] == "financeInstitutionInfo") {
      Object.defineProperty(allRuleToFinanceInstitution, itemKey, {
        value: form_Info_Rules.value[itemKey],
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
  }
  if (isAdd) {
    isChangeRulerRequired(allRuleToFinanceInstitution, isAdd);
  } else {
    Object.keys(allRuleToFinanceInstitution).forEach(itemKey => {
      allRuleToFinanceInstitution[itemKey].forEach((nextItem, index) => {
        if (nextItem.hasOwnProperty("validator")) {
          allRuleToFinanceInstitution[itemKey].splice(index, 1);
        }
      });
    });
    isChangeRulerRequired(allRuleToFinanceInstitution, isAdd);
  }
};
//通过证件持有人类型控制经营者/法人身份证件当中的校验项（证件类型）
const controlIdDocTypeRuler = (isAdd) => {
  Object.keys(form_Info_Rules.value).forEach(itemKey => {
    if (itemKey == "identityInfo.idDocType") {
      form_Info_Rules.value[itemKey].forEach(item => {
        item.required = isAdd;
      });
    }
  });
};
//证件结束日期为长期
const deadlinebySwitch = (tag, index = null) => {
  switch (tag) {
    case "businessLicenseInfoTime":
      if (isPermanentlyValid_businessLicenseInfo.value) {
        form_Info.value.businessLicenseInfo.periodEnd = "长期";
      } else {
        form_Info.value.businessLicenseInfo.periodEnd = null;
      }
      break;
    case "certificateInfo":
      if (isPermanentlyValid_certificateInfo.value) {
        form_Info.value.certificateInfo.periodEnd = "长期";
      } else {
        form_Info.value.certificateInfo.periodEnd = null;
      }
      break;
    case "identityInfoIdCardInfo":
      if (isPermanentlyValid_identityInfo_idCardInfo.value) {
        form_Info.value.identityInfo.idCardInfo.cardPeriodEnd = "长期";
      } else {
        form_Info.value.identityInfo.idCardInfo.cardPeriodEnd = null;
      }
      break;
    case "uboInfoList":
      if (isPermanentlyValid_uboInfoList.value[index]) {
        form_Info.value.uboInfoList[index].uboPeriodEnd = "长期";
        isPermanentlyValid_uboInfoList.value[index] = true;
      } else {
        isPermanentlyValid_uboInfoList.value[index] = false;
        form_Info.value.uboInfoList[index].uboPeriodEnd = null;
      }
      break;
    case "identityInfoIdCardInfo":
      if (isPermanentlyValid_identityInfo_idDocInfo.value) {
        form_Info.value.identityInfo.idDocInfo.docPeriodEnd = "长期";
      } else {
        form_Info.value.identityInfo.idDocInfo.docPeriodEnd = null;
      }
      break;
  }
};
//上传图片成功后的回调
const uploadImageSuccessCallback = (data, tag, instanceName, positiveOrOpposite, saveName, index = null) => {
//  判断是否校验
  if (tag) {
    //判断校验类型
    switch (instanceName) {
      case "idCardOcr":
        //人员校验
        if (index == null) {
          idCardOcr({ url: data.url }).then(res_id => {
            if (res_id.code == 200) {
              //  判断校验正面还是反面
              if (positiveOrOpposite == "positive") {
                if (res_id.data.authority !== "" || res_id.data.validDate !== "") {
                  ElMessage.error("请上传证件正面照片");
                  let name = saveName + "Instance";
                  uploadInstances.value[name]();
                } else {
                  let { address, idNum, name } = res_id.data;
                  let validateResultData = {
                    address,
                    idNum,
                    name
                  };
                  let variableName = saveName + "Data";
                  specialChecksData.value[variableName] = validateResultData;
                }
              } else if (positiveOrOpposite == "opposite") {
                if (res_id.data.authority === "" || res_id.data.validDate === "") {
                  ElMessage.error("请上传证件反面照片");
                  //  清除对应上传选项
                  let name = saveName + "Instance";
                  uploadInstances.value[name]();
                } else {
                  let { validDate } = res_id.data;
                  let handleValidDate = validDate.split("-");
                  handleValidDate[0] = handleValidDate[0].replaceAll(".", "-"),
                    handleValidDate[1] = handleValidDate[1].replaceAll(".", "-");
                  let validateResultData = {
                    beginTime: handleValidDate[0],
                    endTime: handleValidDate[1]
                  };
                  let variableName = saveName + "Data";
                  specialChecksData.value[variableName] = validateResultData;
                }
              }
            }

          }).catch(() => {
            let name = saveName + "Instance";
            uploadInstances.value[name]();
          });
        } else {
          idCardOcr({ url: data.url }).then(res_id => {
            if (res_id.code == 200) {
              //  判断校验正面还是反面
              if (positiveOrOpposite == "positive") {
                if (res_id.data.authority !== "" || res_id.data.validDate !== "") {
                  ElMessage.error("请上传证件正面照片");
                  let clearName = `${positiveOrOpposite}Ref_${index}`;
                  proxy.refs[clearName][0].removeFile();
                  instance_Form.value.validate();
                } else {
                  let { address, idNum, name } = res_id.data;
                  let validateResultData = {
                    address,
                    idNum,
                    name
                  };
                  let variableName = saveName + "Data";
                  specialChecksData.value[variableName][index] = validateResultData;
                }
              } else if (positiveOrOpposite == "opposite") {
                if (res_id.data.authority === "" || res_id.data.validDate === "") {
                  ElMessage.error("请上传证件反面照片");
                  //  清除对应上传选项
                  let clearName = `${positiveOrOpposite}Ref_${index}`;
                  proxy.refs[clearName][0].removeFile();
                  instance_Form.value.validate();
                } else {
                  let { validDate } = res_id.data;
                  let handleValidDate = validDate.split("-");
                  handleValidDate[0] = handleValidDate[0].replaceAll(".", "-"),
                    handleValidDate[1] = handleValidDate[1].replaceAll(".", "-");
                  let validateResultData = {
                    beginTime: handleValidDate[0],
                    endTime: handleValidDate[1]
                  };
                  let variableName = saveName + "Data";
                  specialChecksData.value[variableName][index] = validateResultData;
                }
              }
            }
          }).catch(() => {
            let clearName = `${positiveOrOpposite}Ref_${index}`;
            proxy.refs[clearName][0].removeFile();
            instance_Form.value.validate();
          });

        }
        break;
      case "bizLicenseOcr":
        // 营业执照校验
        bizLicenseOcr({ url: data.url }).then(res_id => {
          if (res_id.code === 200) {
            let { regNum, name, person, address, period, setDate } = res_id.data;
            let handlePeriod = period.split("至");
            handlePeriod = handlePeriod.map(item => {
              let handleItem = item.replaceAll(/年|月|日/g, "-");
              if (handleItem.substring(handleItem.length - 1) == "-") {
                handleItem = handleItem.substring(0, handleItem.length - 1);
              }
              if (item == "永久") {
                handleItem = "长期";
              }
              return handleItem;
            });
            let validateResultData = {
              regNum,
              name,
              person,
              address,
              beginTime: handlePeriod[0],
              endTime: handlePeriod[1]
            };
            let variableName = saveName + "Data";
            specialChecksData.value[variableName] = validateResultData;
          }
        }).catch(() => {
          let name = saveName + "Instance";
          uploadInstances.value[name]();
        });
        break;
      case "enterpriseLicenseOCR":
        //企业证照识别
        enterpriseLicenseOCR({ url: data.url }).then(res_id => {
          if (res_id.code === 200) {
            // 法人证书可用
          }
        }).catch(() => {
          let name = saveName + "Instance";
          uploadInstances.value[name]();
        });
    }
  } else {
    instance_Form.value.validate();
  }
};
//是否为最终受益人
const changeOwner = (value) => {
  //清空所有监听
  clearWatchArray.value.forEach(clearFn => {
    clearFn();
  });
  if (value) {
    form_Info.value.uboInfoList = [];
  } else {
    let itemObj = {
      //证件类型
      uboIdDocType: null,
      //证件正面照片
      uboIdDocCopy: null,
      //证件反面照片
      uboIdDocCopyBack: null,
      //证件姓名
      uboIdDocName: null,
      // 证件号码
      uboIdDocNumber: null,
      // 证件居住地址
      uboIdDocAddress: null,
      //证件有效期开始时间
      uboPeriodBegin: null,
      // 证件有效期结束时间
      uboPeriodEnd: null
    };
    form_Info.value.uboInfoList = [];
    form_Info.value.uboInfoList.push(itemObj);
  }
  form_Info.value.uboInfoList.forEach((item, index) => {
    clearWatchArray.value.push(watch(() => form_Info.value.uboInfoList[index].uboPeriodEnd, () => {
        if (form_Info.value.uboInfoList[index].uboPeriodEnd == "长期") {
          isPermanentlyValid_uboInfoList.value[index] = true;
        } else {
          isPermanentlyValid_uboInfoList.value[index] = false;
        }
      })
    );
  });
};
/**监听器*/
//多条件监听身份证信息是否必传
watch(() => [form_Info.value.identityInfo.idHolderType, form_Info.value.identityInfo.idDocType], () => {
  let { identityInfo: { idHolderType, idDocType } } = form_Info.value;
  if (idHolderType && idDocType) {
    if (idHolderType == "LEGAL" && idDocType == "IDENTIFICATION_TYPE_IDCARD") {
      isIdCard.value = true;
      idDoc.value = false;
      resetIdDocInfo();
    } else if (idHolderType == "LEGAL" && idDocType !== "IDENTIFICATION_TYPE_IDCARD") {
      isIdCard.value = false;
      idDoc.value = true;
      resetIdCardInfo();
    } else {
      isIdCard.value = false;
      idDoc.value = false;
      resetIdDocInfo();
      resetIdCardInfo();
    }
  }
}, {
  immediate: true,
  deep: true
});
watch(() => form_Info.value.financeInstitution, () => {
  controlFinanceInstitutionRuler(form_Info.value.financeInstitution);
}, {
  immediate: true
});
watch(() => isSubjectType.value, () => {
  if (isSubjectType.value == "个体户" || isSubjectType.value == "企业") {
    isShowBusiness.value = true;
    isShowCertificate.value = false;
    //  数据重置
    resetCertificateInfo();
  } else {
    isShowBusiness.value = false;
    isShowCertificate.value = true;
    resetBusinessLicenseInfo();
  }
  if (isSubjectType.value == "政府机关" || isSubjectType.value == "事业单位") {
    controlIdHolderTypeDisabled.value = false;
  } else {
    form_Info.value.identityInfo.idHolderType = "LEGAL";
    controlIdHolderTypeDisabled.value = true;
  }

}, {
  immediate: true,
  deep: true
});
watch(() => form_Info.value.businessLicenseInfo.periodEnd, () => {
  if (form_Info.value.businessLicenseInfo.periodEnd == "长期") {
    isPermanentlyValid_businessLicenseInfo.value = true;
  } else {
    isPermanentlyValid_businessLicenseInfo.value = false;
  }
});
watch(() => form_Info.value.identityInfo.idCardInfo.cardPeriodEnd, () => {
  if (form_Info.value.identityInfo.idCardInfo.cardPeriodEnd == "长期") {
    isPermanentlyValid_identityInfo_idCardInfo.value = true;
  } else {
    isPermanentlyValid_identityInfo_idCardInfo.value = false;
  }
});


onMounted(() => {
  form_Info.value.uboInfoList.forEach((item, index) => {
    isVailidateOcrToUboInfoArray.value[index] = false;
    isPermanentlyValid_uboInfoList.value[index] = false;
  });
//  受益人为否是默认其他受益人添加一项
  let itemObj = {
    //证件类型
    uboIdDocType: null,
    //证件正面照片
    uboIdDocCopy: null,
    //证件反面照片
    uboIdDocCopyBack: null,
    //证件姓名
    uboIdDocName: null,
    // 证件号码
    uboIdDocNumber: null,
    // 证件居住地址
    uboIdDocAddress: null,
    //证件有效期开始时间
    uboPeriodBegin: null,
    // 证件有效期结束时间
    uboPeriodEnd: null
  };
  let { owner } = form_Info.value.identityInfo;
  if (!owner) {
    form_Info.value.uboInfoList = [];
    form_Info.value.uboInfoList.push(itemObj);
  }
  form_Info.value.uboInfoList.forEach((item, index) => {
    clearWatchArray.value.push(watch(() => form_Info.value.uboInfoList[index].uboPeriodEnd, () => {
        if (form_Info.value.uboInfoList[index].uboPeriodEnd == "长期") {
          isPermanentlyValid_uboInfoList.value[index] = true;
        } else {
          isPermanentlyValid_uboInfoList.value[index] = false;
        }
      })
    );
  });
});
const emit = defineEmits(["result"]);//提交校验
//提交校验
const submit = async () => {
  instance_Form.value.validate((isPass) => {
    if (isPass) {
      console.log(form_Info.value, "???");
      emit("result", { subjectInfo: form_Info.value });
    } else {
      activeNames.value = ["1", "2", "3", "4", "5"];
      innerActiveNames.value = ["1", "2"];
      console.log(form_Info.value, "???");
      emit("result", false);
    }
  });
};
defineExpose({
  submit
});
</script>
<style lang="scss" scoped>
.el-form-item {
  align-items: center;

  :deep(.el-form-item__label) {
    font-weight: 700;
  }

  :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 60px;
    border: 0;
  }

  :deep(.el-upload-list--picture-card) .el-upload-list__item {
    width: 60px;
    height: 60px;
  }
}

.mainInfo_outBox::v-deep(.el-collapse-item__header) {
  border: none !important;
}

.mainInfo_outBox::v-deep(.el-collapse) {
  border: none !important;
}

.form-img {
  width: 60px;
  height: 60px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
}

.el-icon.avatar-uploader-icon {
  font-size: 22px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
}

.el-upload:hover {
  border-color: var(--el-color-primary);
}

.mainInfo_outBox {
  display: flex;
  justify-content: space-around;

  ::v-deep(.el-input) {
    //width: 100% !important;
  }

  ::v-deep(.el-form-item__error) {
    font-weight: normal !important;
  }

  .box-card {
    width: 100% !important;
  }

  .templateUboinfo {
    margin-top: 10px;
    border: 1px solid #d7dae0;
    border-radius: 10px;
    padding: 20px;
  }

  .collapseName {
    width: 180px;
    font-size: 14px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    display: flex;
    justify-content: flex-end;
  }

  .tipIcon {
    margin-left: 20px;
    line-height: 100%;
  }

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

</style>