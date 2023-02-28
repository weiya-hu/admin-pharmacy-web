import departmentManageConfig from "@/views/hospital/config/htmlDefulteConfig/departmentManageConfig";
import doctorManageConfig from "@/views/hospital/config/htmlDefulteConfig/doctorManageConfig";
import hospitalIntroductionConfig from "@/views/hospital/config/htmlDefulteConfig/hospitalIntroductionConfig";
import medicalGuideConfig from "@/views/hospital/config/htmlDefulteConfig/medicalGuideConfig";
import medicalInsuranceColumnConfig from "@/views/hospital/config/htmlDefulteConfig/medicalInsuranceColumnConfig";
import medicalNewsConfig from "@/views/hospital/config/htmlDefulteConfig/medicalNewsConfig";

const configHtmlMap = new Map();
//医院简介
configHtmlMap.set("HOSPITAL_PROFILE", hospitalIntroductionConfig);
//部门管理
configHtmlMap.set("DEPARTMENT_MANAGEMENT", departmentManageConfig);
//医生管理
configHtmlMap.set("PHYSICIAN_MANAGEMENT", doctorManageConfig);
//医保专栏
configHtmlMap.set("MEDICAL_INSURANCE", medicalInsuranceColumnConfig);
// 医疗指南
configHtmlMap.set("MEDICAL_GUIDE", medicalGuideConfig);
//医疗动态
configHtmlMap.set("MEDICAL_TRENDS", medicalNewsConfig);
export default configHtmlMap;