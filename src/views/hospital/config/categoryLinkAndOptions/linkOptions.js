import useHospitalConfigStore from "@/store/modules/hospitalConfig";

const hospitalConfigStore = useHospitalConfigStore();
const host = hospitalConfigStore.linkHost;
const linkOptions = [
  {
    label: "医院简介",
    value: `${host}/hospitalprofile?code=HOSPITAL_PROFILE`
  },
  {
    label: "科室管理",
    value: `${host}/departments?code=DEPARTMENT_MANAGEMENT`
  },
  {
    label: "医生管理",
    value: `${host}/expertteam?code=PHYSICIAN_MANAGEMENT`
  }, {
    label: "医保专栏",
    value: `${host}/medicalInsurance?code=MEDICAL_INSURANCE`
  },
  {
    label: "医疗指南",
    value: `${host}/medicalGuide?code=MEDICAL_GUIDE`
  },
  {
    label: "医疗动态",
    value: `${host}/medicaltrends?code=MEDICAL_TRENDS`
  }
];
export default linkOptions;