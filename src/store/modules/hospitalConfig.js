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
import { _ } from "lodash";
import { getBannerList } from "@/api/hospital/bannerManagement";

const useHospitalConfigStore = defineStore("hospitalConfig", {
  state: () => ({
    linkHost: "http://test.hospital.shanhaiping.com",
    publicLoading: false,
    logo: "",
    hasCategory: [{
      name: "栏目管理", categoryId: "01"
    }, {
      name: "banner图管理",
      categoryId: "001"
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
    allActiveNav: [],
    corpId: null,
    total: 0
  }), actions: {
    changeCopId(id) {
      this.corpId = id;
    },
    filterNavStatusBar(nav) {
      let cloneNav = _.cloneDeep(nav);
      let newNav = [];
      cloneNav.map(item => {
        if (item.status !== 0) {
          if (item.hasOwnProperty("childs")) {
            item.childs = item.childs.filter(nextItem => {
              return nextItem.status !== 0;
            });
          }
          newNav.push(item);
        }
      });
      return newNav;
    },
    //获取功能导航
    generateNavs(query) {
      return new Promise((resolve, reject) => {
        try {
          getHospitalCategoryTree(query).then(res => {
            if (res.code == 200) {
              this.allActiveNav = [];
              this.allActiveNav = this.hasCategory.concat(this.filterNavStatusBar(res.data));
              console.log(this.allActiveNav);
              this.category = res.data;
              this.navBar = this.hasCategory.concat(res.data);
              resolve(true);
            }
          });
        } catch {
          reject(new Error("请求失败"));
        }
      });
    },
    //  改变组件展示
    changeComponentShow(isShow) {
      this.isShowComponent = isShow;
    }, //  选中bar的基本信息
    changeActiveBarInfo(info) {
      this.activeBarInfo = info;
      //获取父元素的节点信息
      if (info.name !== "栏目管理" && info.name !== "banner图管理") {
        this.getParentNodeInfo();
        let { categoryId, corpId, name } = this.activeBarInfo;
        this.getCategoryDataList({ categoryId, corpId, name });
      } else if (info.name == "banner图管理") {
        this.innitShowConfig("HOSPITAl_BANNER");
        this.getCategoryDataListToBanner({ copId: this.copId });
      }
    },
    //获取父元素的节点信息
    getParentNodeInfo() {
      this.activeParentBarInfo = this.navBar.filter(item => {
        return item.categoryId === this.activeBarInfo.pid;
      })[0];
      //  初始化列表展示配置和富文本默认展示
      this.innitShowConfig();
    },
    innitShowConfig(code = null) {
      if (code == null) {
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
      } else {
        switch (code) {
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
          case "HOSPITAl_BANNER":
            this.publicTableConfig = configTableMap.get("HOSPITAl_BANNER");
            break;
        }
      }
    }
    ,
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
    //获取banner图列表数据
    getCategoryDataListToBanner(data) {
      this.publicLoading = true;
      try {
        getBannerList(data).then(res => {
          if (res.code == 200) {
            this.categoryDataList = res.data.list;
            this.total = Number(res.data.total);
            this.publicLoading = false;
          }
        });
      } catch {
        this.publicLoading = false;
      }
    },
    //获取除了banner图和栏目管理外的其他菜单数据
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