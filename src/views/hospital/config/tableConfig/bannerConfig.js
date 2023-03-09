const tableConfig = {
  title: "banner图",
  createTitle: "新增banner图",
  propList: [
    { prop: "title", label: "标题", minWidth: "100", tooltip: true },
    {
      prop: "des",
      label: "简述",
      slotName: "des",
      tooltip: true
    },
    {
      prop: "picUrl",
      label: "图片",
      slotName: "picUrlSlot",
      tooltip: false
    },
    { prop: "pageUrl", label: "链接", minWidth: "300", slotName: "pageUrlSlot", tooltip: true },
    { prop: "sort", label: "排序", minWidth: "100", slotName: "sortSlot", tooltip: true },
    { prop: "status", label: "状态", minWidth: "100", slotName: "statusSlot", tooltip: true },
    { label: "操作", minWidth: "120", slotName: "handlerToBanner", fixed: "right", tooltip: false }
  ],
  showIndexColumn: true
};
export default tableConfig;
