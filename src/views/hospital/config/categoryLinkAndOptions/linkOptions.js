import useHospitalConfigStore from "@/store/modules/hospitalConfig";

const hospitalConfigStore = useHospitalConfigStore();
const host = hospitalConfigStore.linkHost;
const linkOptions = [
  {
    label: "医院简介",
    value: `${host}/hospitalprofile`
  },
  {
    label: "部门管理",
    value: `${host}/departments`
  },
  {
    label: "医生管理",
    value: `${host}/expertteam`
  }, {
    label: "医保专栏",
    value: `${host}/medicalInsurance`
  },
  {
    label: "医疗指南",
    value: `${host}/medicalGuide`
  },
  {
    label: "医疗动态",
    value: `${host}/medicaltrends`
  }
];
export default linkOptions;