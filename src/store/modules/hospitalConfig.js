// 匹配views里面所有的.vue文件
import {
  getEditorList,
  getHospitalCategoryTree,
  searchCategory,
  searchEditorList
} from "@/api/hospital/hospitalConfig";

const modules = import.meta.glob("./../../views/**/*.vue");
import configHtmlMap from "@/views/hospital/config/htmlDefulteConfig";
import configTableMap from "@/views/hospital/config/tableConfig";
import { useRouter } from "vue-router";

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
    publicEditorDefault: "",
    total: 0
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
      if (info.name !== "栏目管理") {
        this.getParentNodeInfo();
      }
      let { categoryId, corpId, name } = this.activeBarInfo;
      this.getCategoryDataList({ categoryId, corpId, name });
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
      switch (this.activeParentBarInfo.code) {
        case "HOSPITAL_PROFILE":
          this.publicTableConfig = configTableMap.get("HOSPITAL_PROFILE");
          this.publicEditorDefault = configHtmlMap.get("HOSPITAL_PROFILE");
          break;
        case "DEPARTMENT_MANAGEMENT":
          this.publicTableConfig = configTableMap.get("DEPARTMENT_MANAGEMENT");
          this.publicEditorDefault = configHtmlMap.get("DEPARTMENT_MANAGEMENT");
          break;
        case "PHYSICIAN_MANAGEMENT":
          this.publicTableConfig = configTableMap.get("PHYSICIAN_MANAGEMENT");
          this.publicEditorDefault = configHtmlMap.get("PHYSICIAN_MANAGEMENT");
          break;
        case "MEDICAL_INSURANCE":
          this.publicTableConfig = configTableMap.get("MEDICAL_INSURANCE");
          this.publicEditorDefault = configHtmlMap.get("MEDICAL_INSURANCE");
          break;
        case "MEDICAL_GUIDE":
          this.publicTableConfig = configTableMap.get("MEDICAL_GUIDE");
          this.publicEditorDefault = configHtmlMap.get("MEDICAL_GUIDE");
          break;
        case "MEDICAL_TRENDS":
          this.publicTableConfig = configTableMap.get("MEDICAL_TRENDS");
          this.publicEditorDefault = configHtmlMap.get("MEDICAL_TRENDS");
          break;
      }
    },
    filterCategory(data) {
      searchCategory(data).then(res => {
        if (res.code == 200) {
          this.category = res.data;
          this.navBar = this.hasCategory.concat(res.data);
        }
      });
    },
    filterCategoryDataList(data) {
      this.publicLoading = true;
      data = Object.assign(data, {
        categoryId: this.activeBarInfo.categoryId,
        corpId: this.activeBarInfo.corpId,
        name: this.activeBarInfo.name
      });
      searchEditorList(data).then(res => {
        this.categoryDataList = res.data.list;
        this.total = Number(res.data.total);
        this.publicLoading = false;
      });
    },
    getCategoryDataList(data) {
      data = Object.assign(data, {
        categoryId: this.activeBarInfo.categoryId,
        corpId: this.activeBarInfo.corpId,
        name: this.activeBarInfo.name
      });
      this.publicLoading = true;
      try {
        getEditorList(data).then(res => {
          if (res.code == 200) {
            this.categoryDataList = res.data.list;
            this.total = Number(res.data.total);
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