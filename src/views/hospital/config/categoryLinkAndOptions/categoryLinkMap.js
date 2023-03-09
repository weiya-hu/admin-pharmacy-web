import useHospitalConfigStore from "@/store/modules/hospitalConfig";
const hospitalConfigStore = useHospitalConfigStore();
const host = hospitalConfigStore.linkHost;
const linkMap = new Map();

//医院简介
linkMap.set("HOSPITAL_PROFILE", `${host}/hospitalprofile?code=HOSPITAL_PROFILE`);
//部门管理
linkMap.set("DEPARTMENT_MANAGEMENT", `${host}/departments?code=DEPARTMENT_MANAGEMENT`);
//医生管理
linkMap.set("PHYSICIAN_MANAGEMENT", `${host}/expertteam?code=PHYSICIAN_MANAGEMENT`);
//医保专栏
linkMap.set("MEDICAL_INSURANCE", `${host}/medicalInsurance?code=MEDICAL_INSURANCE`);
// 医疗指南
linkMap.set("MEDICAL_GUIDE", `${host}/medicalGuide?code=MEDICAL_GUIDE`);
//医疗动态
linkMap.set("MEDICAL_TRENDS", `${host}/medicaltrends?code=MEDICAL_TRENDS`);
export default linkMap;