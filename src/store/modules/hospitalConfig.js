// 匹配views里面所有的.vue文件
import { getEditorList, getHospitalCategoryTree } from "@/api/hospital/hospitalConfig";

const modules = import.meta.glob("./../../views/**/*.vue");
import configHtmlMap from "@/views/hospital/config/htmlDefulteConfig";
import configTableMap from "@/views/hospital/config/tableConfig";

const useHospitalConfigStore = defineStore("hospitalConfig", {
  state: () => ({
    publicLoading: false,
    logo: "",
    hasCategory: [{
      name: "栏目管理", categoryId: "01"
    }],
    category: [],
    navBar: [],
    isShowComponent: true,
    activeParentBarInfo: {},
    activeBarInfo: {},
    categoryId: "",
    categoryDataList: [],
    publicTableConfig: {},
    publicEditorDefault: ""
  }), actions: {
    //获取功能导航
    generateNavs(query) {
      return new Promise((resolve, reject) => {
        try {
          getHospitalCategoryTree(query).then(res => {
            if (res.code == 200) {
              this.category = res.data;
              this.navBar = this.hasCategory.concat(res.data);
              resolve(true);
            }
          });
        } catch {
          reject(new Error("请求失败"));
        }
      });
    }, //  改变组件展示
    changeComponentShow(isShow) {
      this.isShowComponent = isShow;
    }, //  选中bar的基本信息
    changeActiveBarInfo(info) {
      this.activeBarInfo = info;
      //获取父元素的节点信息
      this.getParentNodeInfo();
      this.getCategoryDataList(this.activeBarInfo);
    },
    //获取父元素的节点信息
    getParentNodeInfo() {
      this.activeParentBarInfo = this.navBar.filter(item => {
        return item.categoryId === this.activeBarInfo.pid;
      })[0];
      //  初始化列表展示配置和富文本默认展示
      this.innitShowConfig();
    },
    innitShowConfig() {
      console.log("code");
      switch (this.activeParentBarInfo.code) {
        case "HOSPITAL_PROFILE":
          this.publicTableConfig = configTableMap.get("HOSPITAL_PROFILE");
          this.publicEditorDefault = configHtmlMap.get("HOSPITAL_PROFILE");
          console.log(1);
          break;
        case "DEPARTMENT_MANAGEMENT":
          this.publicTableConfig = configTableMap.get("DEPARTMENT_MANAGEMENT");
          this.publicEditorDefault = configHtmlMap.get("DEPARTMENT_MANAGEMENT");
          console.log(2);
          break;
        case "PHYSICIAN_MANAGEMENT":
          this.publicTableConfig = configTableMap.get("PHYSICIAN_MANAGEMENT");
          this.publicEditorDefault = configHtmlMap.get("PHYSICIAN_MANAGEMENT");
          console.log(3);
          break;
        case "MEDICAL_INSURANCE":
          this.publicTableConfig = configTableMap.get("MEDICAL_INSURANCE");
          this.publicEditorDefault = configHtmlMap.get("MEDICAL_INSURANCE");
          console.log(4);
          break;
        case "MEDICAL_GUIDE":
          this.publicTableConfig = configTableMap.get("MEDICAL_GUIDE");
          this.publicEditorDefault = configHtmlMap.get("MEDICAL_GUIDE");
          console.log(5);
          break;
        case "MEDICAL_TRENDS":
          this.publicTableConfig = configTableMap.get("MEDICAL_TRENDS");
          this.publicEditorDefault = configHtmlMap.get("MEDICAL_TRENDS");
          console.log(6);
          break;
      }
    },
    getCategoryDataList(query) {
      this.publicLoading = true;
      try {
        getEditorList(query).then(res => {
          if (res.code == 200) {
            this.categoryDataList = res.data.list;
            this.publicLoading = false;
          }
        });
      } catch {
        this.publicLoading = false;
      }
    }
  }
});
export default useHospitalConfigStore;