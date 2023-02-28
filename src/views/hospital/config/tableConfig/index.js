import hospitalIntroductionConfig from "@/views/hospital/config/tableConfig/hospitalIntroductionConfig";
import departmentManageConfig from "@/views/hospital/config/tableConfig/departmentManageConfig";
import doctorManageConfig from "@/views/hospital/config/tableConfig/doctorManageConfig";
import medicalInsuranceColumnConfig from "@/views/hospital/config/tableConfig/medicalInsuranceColumnConfig";
import medicalGuideConfig from "@/views/hospital/config/tableConfig/medicalGuideConfig";
import medicalNewsConfig from "@/views/hospital/config/tableConfig/medicalNewsConfig";
//功能菜单表格展示配置项
let configTableMap = new Map();
//医院简介
configTableMap.set("HOSPITAL_PROFILE", hospitalIntroductionConfig);
//部门管理
configTableMap.set("DEPARTMENT_MANAGEMENT", departmentManageConfig);
//医生管理
configTableMap.set("PHYSICIAN_MANAGEMENT", doctorManageConfig);
//医保专栏
configTableMap.set("MEDICAL_INSURANCE", medicalInsuranceColumnConfig);
// 医疗指南
configTableMap.set("MEDICAL_GUIDE", medicalGuideConfig);
//医疗动态
configTableMap.set("MEDICAL_TRENDS", medicalNewsConfig);
export default configTableMap;
