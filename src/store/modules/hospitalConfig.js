// 匹配views里面所有的.vue文件
import { getEditorList, getHospitalCategoryTree } from "@/api/hospital/hospitalConfig";

const modules = import.meta.glob("./../../views/**/*.vue");

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
    activeBarInfo: {},
    categoryDataList: []
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
      console.log(info);
      this.getCategoryDataList(this.activeBarInfo);
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