<template>
  <i-frame v-model:src="url"></i-frame>
</template>

<script setup>
import iFrame from '@/components/iFrame'
import {getToken} from "../../../utils/auth";

const router = useRouter();

const token = getToken()
// const token = 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxNTc1NjkzNjY3MTY5NTEzNDcyLCJ1c2VyX2tleSI6ImZkZTJhZTM2ZGZhYjQ3Yjc4ZGNlOTI2YzY4MTdlNjE1IiwidXNlcm5hbWUiOiLnjovnvo7ojJwifQ.sT46hq1TAVa55rx3apWiithr756ucB-eUVjtelH_Qw40Y4l58Yc0miBPId8NATPzm8CX5GONwyRxShgDrJzN9Q'

const url = ref(`${router.currentRoute.value.query.url}?token=${token}`)
</script>
