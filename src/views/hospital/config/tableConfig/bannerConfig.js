const tableConfig = {
  title: "banner图",
  createTitle: "新增banner图",
  propList: [
    { prop: "title", label: "标题", minWidth: "100" },
    {
      prop: "des",
      label: "简述",
      slotName: "des"
    },
    {
      prop: "picUrl",
      label: "图片",
      slotName: "picUrlSlot"
    },
    { prop: "pageUrl", label: "链接", minWidth: "250", slotName: "pageUrlSlot" },
    { prop: "sort", label: "排序", minWidth: "100", slotName: "sortSlot" },
    { prop: "status", label: "状态", minWidth: "100", slotName: "statusSlot" },
    { label: "操作", minWidth: "120", slotName: "handlerToBanner", fixed: "right" }
  ],
  showIndexColumn: true
};
export default tableConfig;
