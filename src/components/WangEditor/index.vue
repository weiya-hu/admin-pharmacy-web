<template>
  <div style="border: 1px solid #ccc;height: 100%;">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc;"
    />
    <Editor
      v-model="valueHtml"
      :default-config="editorConfig"
      :mode="mode"
      class="editor_custom"
      style="height: 455px; overflow-y: hidden;"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @onDestroyed="handleDestroyed"
      @onFocus="handleFocus"
      @onBlur="handleBlur"
      @customAlert="customAlert"
      @customPaste="customPaste"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const { proxy } = getCurrentInstance();
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["update:modelValue"]);

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// const menu = editor.getAllMenuKeys()
// const bar = toolbar.getConfig().toolbarKeys
// 内容 HTML
const valueHtml = ref(props.modelValue);
watch(() => valueHtml.value, newValue => {
  emit("update:modelValue", newValue);
});

watch(() => props.modelValue, newValue => {
  valueHtml.value = newValue;
});
// 模拟 ajax 异步获取内容
onMounted(() => {
  AuthorizationHeader();
});
const headerObj = ref({});
const AuthorizationHeader = () => {
  // if (tokenStore.token != '') {
  //     if (tokenStore.token != '0') {
  //         headerObj.value.Authorization =  tokenStore.token
  //     } else {
  //         headerObj.value.Authorization = userOutsideStore.tokenHead + userOutsideStore.token
  //     }
  // }
};
const toolbarConfig = {
  excludeKeys: [
    "fullScreen",
    "code",
    "group-video",
    "codeBlock",
    "bulletedList",
    "numberedList",
    "blockquote",
    "bold",
    "italic",
    "todo",
    "insertImage",
    "insertLink",
    "emotion"
  ]
};

const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {},
  hoverbarKeys: {
    "image": {
      // 清空 image 元素的 hoverbar
      menuKeys: []
    }
  }
};
editorConfig.MENU_CONF["emotion"] = {
  emotions: "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉".split(" ") // 数组
};

// 自定义校验链接
function customCheckLinkFn(text, url) {
  if (!url) {
    return;
  }
  // if (url.indexOf("http") !== 0) {
  //   return "链接必须以 http/https 开头";
  // }
  return true;
  // 返回值有三种选择：
  // 1. 返回 true ，说明检查通过，编辑器将正常插入链接
  // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
  // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
}

// 自定义转换链接 url
function customParseLinkUrl(url) {
  if (url.indexOf("http") !== 0) {
    return `http://${url}`;
  }
  return url;
}

// 插入链接
editorConfig.MENU_CONF["insertLink"] = {
  checkLink: customCheckLinkFn, // 也支持 async 函数
  parseLinkUrl: customParseLinkUrl // 也支持 async 函数
};
// 更新链接
editorConfig.MENU_CONF["editLink"] = {
  checkLink: customCheckLinkFn, // 也支持 async 函数
  parseLinkUrl: customParseLinkUrl // 也支持 async 函数
};

// 上传图片
editorConfig.MENU_CONF["uploadImage"] = {
  // 上传图片的接口地址
  // server: usUploadStore().uploadImage,
  // form-data fieldName ，默认值 'wangeditor-uploaded-image'
  fieldName: "file",

  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 5 * 1024 * 1024, // 5M

  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 20,

  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ["image/png,image/jpeg,image/jpg"],

  // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
  // meta: {
  //     token: 'xxx',
  //     otherKey: 'yyy'
  // },

  // 将 meta 拼接到 url 参数中，默认 false
  metaWithUrl: false,

  // 自定义增加 http  header
  headers: headerObj,

  // 跨域是否传递 cookie ，默认为 false
  withCredentials: true,

  // 超时时间，默认为 10 秒
  timeout: 5 * 1000, // 5 秒
  // 上传之前触发
  onBeforeUpload(file) {
    // file 选中的文件，格式如 { key: file }
    let fileObj = Object.values(file)[0].data;
    const isJPG = (fileObj.type == "image/jpg" || fileObj.type == "image/jpeg" || fileObj.type == "image/png");
    if (!isJPG) {
      proxy.$message.warning("图片只能是 JPG、GIF、PNG 格式!");
    }
    // 判断图片宽高
    // 定义 filereader对象

    // 判断图片大小
    let isLt = fileObj.size / 1024 / 1024 < 5; // 判断是否小于5M
    if (!isLt) {
      proxy.$message.warning("图片大小不能超过5M! 请重新上传");
    }
    // console.log(file, 'before')
    // console.log('isJPG, isSize, sisLt', isJPG, isLt)
    if (!isJPG) {
      return false;
    } else if (!isLt) {
      return false;
    } else {
      return file;
    }
    // 可以 return
    // 1. return file 或者 new 一个 file ，接下来将上传
    // 2. return false ，不上传这个 file
  },
  // 上传进度的回调函数
  onProgress(progress) {
    // progress 是 0-100 的数字
    console.log("progress", progress);
  },
  // 单个文件上传成功之后
  onSuccess(file, res) {
    console.log(`${file.name} 上传成功`, res);
  },
  // 自定义插入图片
  customInsert(res, insertFn) {
    // res 即服务端的返回结果
    // 从 res 中找到 url alt href ，然后插图图片
    insertFn(res.data.url, "", "");
  },
  // 单个文件上传失败
  // onFailed(file, res) {
  //     console.log(`${file.name} 上传失败`, res)
  // },
  // 上传错误，或者触发 timeout 超时
  onError(file, err, res) {
    console.log(`${file.name} 上传出错`, err, res);
  }
};
// 上传视频
editorConfig.MENU_CONF["uploadVideo"] = {
  // 上传视频接口地址
  // server: usUploadStore().uploadVideo,
  // form-data fieldName ，默认值 'wangeditor-uploaded-video'
  fieldName: "file",

  // 单个文件的最大体积限制，默认为 10M
  maxFileSize: 5 * 1024 * 1024, // 5M

  // 最多可上传几个文件，默认为 5
  maxNumberOfFiles: 3,

  // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ["video/mp4"],

  // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
  // meta: {
  //     token: 'xxx',
  //     otherKey: 'yyy'
  // },

  // 将 meta 拼接到 url 参数中，默认 false
  metaWithUrl: false,

  // 自定义增加 http  header
  headers: headerObj,

  // 跨域是否传递 cookie ，默认为 false
  withCredentials: true,

  // 超时时间，默认为 30 秒
  timeout: 15 * 1000, // 15 秒

  // 视频不支持 base64 格式插入
  // 自定义插入视频
  customInsert(res, insertFn) {
    // res 即服务端的返回结果

    // 从 res 中找到 url ，然后插入视频
    insertFn(res.data.url);
  },
  // 上传之前触发
  onBeforeUpload(file) {
    // file 选中的文件，格式如 { key: file }
    return file;

    // 可以 return
    // 1. return file 或者 new 一个 file ，接下来将上传
    // 2. return false ，不上传这个 file
  },
  // 上传进度的回调函数
  onProgress(progress) {
    // progress 是 0-100 的数字
    console.log("progress", progress);
  },
  // 单个文件上传成功之后
  onSuccess(file, res) {
    console.log(`${file.name} 上传成功`, res);
  },
  // 单个文件上传失败
  onFailed(file, res) {
    console.log(`${file.name} 上传失败`, res);
  },
  // 上传错误，或者触发 timeout 超时
  onError(file, err, res) {
    console.log(`${file.name} 上传出错`, err, res);
  }
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器回调函数
const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例
  if (props.disabled) {
    editor.disable();
  } else {
    editor.enable();
  }
};
const handleChange = editor => {
  console.log("change:", editor.getHtml());

};
const handleDestroyed = editor => {
  console.log("destroyed", editor);
};
const handleFocus = editor => {
  console.log("focus", editor);
};
const handleBlur = editor => {
  console.log("blur", editor);
};
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`);
};
const customPaste = (editor, event, callback) => {
  console.log("ClipboardEvent 粘贴事件对象", event);

  // 自定义插入内容
  // editor.insertText('xxx')

  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false) // 返回 false ，阻止默认粘贴行为
  callback(true); // 返回 true ，继续默认的粘贴行为
};

</script>


<style lang="scss" scoped>

:deep(.w-e-scroll) {
  overflow-y: hidden !important;
}

:deep(.w-e-text-container [data-slate-editor]) {
  overflow-y: auto !important;
  height: 100% !important;
}

</style>