// let wechartIncomingConfig = [
//   {
//     label: "业务申请编号",
//     prop: "businessCode",
//     slotName: "businessCodeSlot",
//   },
//   {
//     label: "登记证书类型",
//     prop: "certType",
//     slotName: "certTypeSlot",
//   },
//   {
//     label: "超管姓名",
//     prop: "contactName",
//     slotName: "contactNameSlot",
//   },
//   {
//     label: "超管类型",
//     prop: "contactType",
//     slotName: "contactTypeSlot",
//   },
//   {
//     label: "身份证有效期开始时间",
//     prop: "docPeriodBegin",
//     slotName: "docPeriodBeginSlot",
//   },
//   {
//     label: "身份证有效期结束时间",
//     prop: "docPeriodEnd",
//     slotName: "docPeriodEndSlot",
//   },
//   {
//     label: "金融机构",
//     prop: "financeInstitution",
//     slotName: "financeInstitutionSlot",
//   },
//   {
//     label: "证件居住地",
//     prop: "idDocAddress",
//     slotName: "idDocAddressSlot",
//   },
//   {
//     label: "证件姓名",
//     prop: "idDocName",
//     slotName: "idDocNameSlot",
//   },
//   {
//     label: "证件号码",
//     prop: "idDocNumber",
//     slotName: "idDocNumberSlot",
//   },
//   {
//     label: "证件类型",
//     prop: "idDocType",
//     slotName: "idDocTypeSlot",
//   },
//   {
//     label: "证件持有人类型",
//     prop: "idHolderType",
//     slotName: "idHolderTypeSlot",
//   },
//   {
//     label: "注册地址",
//     prop: "licenseAddress",
//     slotName: "licenseAddressSlot",
//   },
//   {
//     label: "经营者/法人姓名",
//     prop: "licenseMerchantName",
//     slotName: "licenseMerchantNameSlot",
//   },
//   {
//     label: "商户凭证",
//     prop: "licenseNumber",
//     slotName: "licenseNumberSlot",
//   },
//   {
//     label: "凭证有效期开始日期",
//     prop: "licensePeriodBegin",
//     slotName: "licensePeriodBeginSlot",
//   },
//   {
//     label: "凭证有效期限结束日期",
//     prop: "licensePeriodEnd",
//     slotName: "licensePeriodEndSlot",
//   },
//   {
//     label: "是否收益人",
//     prop: "owner",
//     slotName: "ownerSlot",
//   },
//   {
//     label: "商户简称",
//     prop: "merchantShortname",
//     slotName: "merchantShortnameSlot",
//   },
//   // {
//   //   label: "驳回原因",
//   //   prop: "rejectReason",
//   //   slotName: "rejectReasonSlot",
//   // },
//   {
//     label: "经营场景类型名称",
//     prop: "salesScenesTypeName",
//     slotName: "salesScenesTypeNameSlot",
//   },
//   {
//     label: "客服电话",
//     prop: "servicePhone",
//     slotName: "servicePhoneSlot",
//   },
//   // {
//   //   label: "签约链接",
//   //   prop: "signUrl",
//   //   slotName: "signUrlSlot",
//   //   isFixed: "right",
//   // },
//   {
//     label: "申请状态",
//     prop: "statusMsg",
//     slotName: "statusMsgSlot",
//     isFixed: "right",
//   },
//   {
//     label: "特约商户号",
//     prop: "subMchid",
//     slotName: "subMchidSlot",
//   },
//   {
//     label: "主体类型",
//     prop: "subjectType",
//     slotName: "subjectTypeSlot",
//   },
//   {
//     label: "微信支付申请单号",
//     prop: "wechatApplymentId",
//     slotName: "wechatApplymentIdSlot",
//   },
// ];

let wechartIncomingConfig = [
  {
    label: "超级管理员姓名",
    prop: "contactName",
    slotName: "contactNameSlot",
  },
  {
    label: "商户名称",
    prop: "licenseMerchantName",
    slotName: "licenseMerchantNameSlot",
  },
  {
    label: "商户号",
    prop: "licenseNumber",
    slotName: "licenseNumberSlot",
  },
  {
    label: "申请状态",
    prop: "statusMsg",
    slotName: "statusMsgSlot",
  },
  {
    label: "驳回原因",
    prop: "rejectReason",
    slotName: "rejectReasonSlot",
  },
];
export default wechartIncomingConfig;
