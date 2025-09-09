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
      <van-field name="id_face" label="身份证正面">
        <template #input>
          <van-uploader
            v-model="id_face"
            :after-read="afterReadFace"
            :max-count="1"
            reupload
          />
        </template>
      </van-field>
      <van-field name="id_back" label="身份证反面">
        <template #input>
          <van-uploader
            v-model="id_back"
            :after-read="afterReadBack"
            :max-count="1"
            reupload
          />
        </template>
      </van-field>
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

interface FromData {
  name: string;
  identification_number: string;
  phone_number: string;
}

const name = ref('');
const identification_number = ref('');
const phone_number = ref('');
const id_face = ref([]);
const id_back = ref([]);

const onSubmit = (values: FromData) => {
  console.log('submit', values);
};

const afterReadFace = (file: File) => {
  console.log(file);
};
const afterReadBack = (file: File) => {
  console.log(file);
};
</script>
