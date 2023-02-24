const tableConfig = {
  title: "文章列表",
  propList: [
    { prop: "name", label: "标题", minWidth: "100" },
    {
      prop: "createAt",
      label: "创建时间",
      minWidth: "250",
      slotName: "createAt"
    },
    {
      prop: "depart",
      label: "科室",
      minWidth: "250",
      slotName: "depart"
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