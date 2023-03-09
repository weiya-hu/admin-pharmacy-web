const tableConfig = {
  title: "科室管理",
  createTitle: "新建部门简介",
  propList: [
    { prop: "title", label: "标题" },
    {
      prop: "createTime",
      label: "创建时间",
      slotName: "updateTime"
    },
    {
      prop: "updateTime",
      label: "更新时间",
      slotName: "updateTime"
    },
    { prop: "status", label: "状态", slotName: "status" },

    { label: "操作", slotName: "handler", fixed: "right" }
  ],
  showIndexColumn: false

};
export default tableConfig;