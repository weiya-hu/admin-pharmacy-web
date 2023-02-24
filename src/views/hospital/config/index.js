import hospitalIntroductionConfig from "@/views/hospital/config/hospitalIntroductionConfig";
import departmentManageConfig from "@/views/hospital/config/departmentManageConfig";
import doctorManageConfig from "@/views/hospital/config/doctorManageConfig";
import medicalInsuranceColumnConfig from "@/views/hospital/config/medicalInsuranceColumnConfig";
import medicalGuideConfig from "@/views/hospital/config/medicalGuideConfig";
import medicalNewsConfig from "@/views/hospital/config/medicalNewsConfig";
//功能菜单表格展示配置项
let configMap = new Map();
configMap.set("1", hospitalIntroductionConfig);
configMap.set("2", departmentManageConfig);
configMap.set("3", doctorManageConfig);
configMap.set("4", medicalInsuranceColumnConfig);
configMap.set("5", medicalGuideConfig);
configMap.set("6", medicalNewsConfig);
export default configMap;


