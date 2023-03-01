const tableConfig = {
  title: "部门管理",
  createTitle: "新建部门简介",
  propList: [
    { prop: "title", label: "标题", minWidth: "100" },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: "250",
      slotName: "createTime"
    },
    {
      prop: "updateTime",
      label: "更新时间",
      minWidth: "250",
      slotName: "updateTime"
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