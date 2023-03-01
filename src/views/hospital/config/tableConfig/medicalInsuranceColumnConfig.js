const tableConfig = {
  title: "医保列表",
  createTitle: "新建医保栏目",
  propList: [
    { prop: "title", label: "标题", minWidth: "100" },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: "250",
      slotName: "createAt"
    },
    {
      prop: "version",
      label: "版本",
      minWidth: "250",
      slotName: "version"
    },
    { prop: "enable", label: "状态", minWidth: "100", slotName: "status" },

    { label: "操作", minWidth: "120", slotName: "handler" }
  ],
  showIndexColumn: true

};
export default tableConfig;