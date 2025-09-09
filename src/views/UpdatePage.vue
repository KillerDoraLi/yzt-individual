<template>
  <div class="layout">
    <van-form @submit="onSubmit">
      <van-field
        v-model="name"
        name="name"
        label="姓名"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '姓名不能为空' }]"
      />
      <van-field
        v-model="identification_number"
        name="identification_number"
        label="身份证号"
        placeholder="请输入身份证号"
        :rules="[{ required: true, message: '身份证号不能为空' }]"
      />
      <van-field
        v-model="phone_number"
        name="phone_number"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '手机号不能为空' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { registerIndividual } from '@/api'; // 你封装的上传接口

const name = ref('');
const identification_number = ref('');
const phone_number = ref('');

// 提交表单
const onSubmit = () => {
  console.log({
    name: name.value,
    identification_number: identification_number.value,
    phone_number: phone_number.value,
    corporation_id: 1
  });
  showToast('表单提交，可在这里处理后端请求');
  registerIndividual({
    name: name.value,
    identification_number: identification_number.value,
    phone_number: phone_number.value,
    corporation_id: 1
  }).then((res) => {
    console.log(res);
  });
};
</script>
