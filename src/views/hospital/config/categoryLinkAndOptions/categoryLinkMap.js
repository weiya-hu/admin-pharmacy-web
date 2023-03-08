import useHospitalConfigStore from "@/store/modules/hospitalConfig";
const hospitalConfigStore = useHospitalConfigStore();
const host = hospitalConfigStore.linkHost;
const linkMap = new Map();

//医院简介
linkMap.set("HOSPITAL_PROFILE", `${host}/hospitalprofile`);
//部门管理
linkMap.set("DEPARTMENT_MANAGEMENT", `${host}/departments`);
//医生管理
linkMap.set("PHYSICIAN_MANAGEMENT", `${host}/expertteam`);
//医保专栏
linkMap.set("MEDICAL_INSURANCE", `${host}/medicalInsurance`);
// 医疗指南
linkMap.set("MEDICAL_GUIDE", `${host}/medicalGuide`);
//医疗动态
linkMap.set("MEDICAL_TRENDS", `${host}/medicaltrends`);
export default linkMap;