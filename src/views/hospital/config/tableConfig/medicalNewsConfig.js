const tableConfig = {
  title: "医疗动态",
  createTitle: "新建医疗动态",
  propList: [
    { prop: "title", label: "标题", minWidth: "100" },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: "250",
      slotName: "updateTime"
    },
    {
      prop: "updateTime",
      label: "更新时间",
      minWidth: "250",
      slotName: "updateTime"
    },
    { prop: "status", label: "状态", minWidth: "100", slotName: "status" },

    { label: "操作", minWidth: "120", slotName: "handler" }
  ],
  showIndexColumn: true

};
export default tableConfig;