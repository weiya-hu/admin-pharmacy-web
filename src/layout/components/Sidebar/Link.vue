<template>
  <component :is="type" v-bind="linkProps()" @click="toUrl">
    <slot />
  </component>
</template>

<script setup>
import { isExternal } from '@/utils/validate'
import { getEssbasicOrg } from '@/api/insurance/insurance'


const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  }
})

const isExt = computed(() => {
  return isExternal(props.to)
})

const type = computed(() => {
  if (isExt.value) {
    //如果检测到是外联，把标签设置为div，之前是a标签，现在有个需求是点击了之后要请求接口之后才返回地址，所以a不满足，现改成div点击js去跳转
    return 'div'
  }
  return 'router-link'
})

function linkProps() {
  if (isExt.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to: props.to
  }
}

const toUrl =()=> {
  //如果是外链点击打开新标签，其他不变化
  if (isExt.value) {
    let obj = linkProps()
    switch(obj.href){
      //如果地址是http://elecsign就去请求接口获取电子签平台地址
      case 'http://elecsign':
        getEssbasicOrg().then(res => {
          res.code === 200 && window.open(res.data.url,'_blank')
        })
        break
      default: window.open(obj.href,'_blank')
    }
  }
    
  return
}
</script>
