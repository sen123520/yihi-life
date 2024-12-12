<template>
  <view class="container">
    <view style="width: 200rpx; margin: 200rpx auto">敬请期待</view>
    <!-- <view class="title">企业入驻申请表单</view> -->

    <!-- 营业执照上传 -->
    <!--    <uni-upload
      @upload="onBusinessLicenseUpload"
      :before-upload="beforeUpload"
      v-model="businessLicenseFile"
      :max-size="1024 * 1024"
      :compressed="true"
      :show-upload-list="false"
      :limit="1"
      :file-type="['jpg', 'png']"
      :upload-text="uploadText"
    >
      <view class="upload-item">
        <text>营业执照照片</text>
        <image :src="businessLicenseUrl || defaultImage" class="upload-image" mode="aspectFit"></image>
      </view>
    </uni-upload> -->

    <!-- 对公开户证明上传 -->
    <!-- 类似的结构用于对公开户证明上传 -->

    <!-- 法人姓名 -->
    <!-- <input class="form-input" type="text" placeholder="请输入法人姓名" v-model="legalName" @blur="validateLegalName" required /> -->

    <!-- 法人手机号 -->
    <!-- 使用uni-app的pattern属性验证手机号格式 -->
    <!-- <input class="form-input" type="tel" placeholder="请输入法人手机号" v-model="phoneNumber" @blur="validatePhoneNumber" required /> -->

    <!-- 上架产品专区 -->
    <!-- <textarea class="form-input textarea" placeholder="请详细描述希望上架的产品专区及产品信息" v-model="productZone" required></textarea> -->

    <!-- 提交按钮 -->
    <!-- <button class="btn-primary" @click="submitApplication">提交申请</button> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageValue: [],
      businessLicenseFile: [],
      businessLicenseUrl: '',
      uploadText: '点击上传营业执照',
      legalName: '',
      phoneNumber: '',
      productZone: '',
      defaultImage: '/static/default.png' // 默认图片路径
    };
  },
  methods: {
    // 获取上传状态
    select(e) {
      console.log('选择文件：', e);
    },
    // 获取上传进度
    progress(e) {
      console.log('上传进度：', e);
    },

    // 上传成功
    success(e) {
      console.log('上传成功', e);
    },

    // 上传失败
    fail(e) {
      console.log('上传失败：', e);
    },
    onBusinessLicenseUpload(file) {
      this.businessLicenseUrl = file.tempFilePaths[0]; // 获取临时文件路径显示预览图
    },

    beforeUpload(file) {
      // 在这里可以做上传前的文件校验
      return true; // 返回true表示允许上传
    },

    validateLegalName() {
      // 实现法人姓名的验证逻辑
    },

    validatePhoneNumber() {
      // 实现手机号码的验证逻辑
    },

    submitApplication() {
      // 将收集到的数据通过接口提交给后端
      uni.request({
        url: '/api/submit_application',
        method: 'POST',
        data: {
          businessLicense: this.businessLicenseFile[0],
          legalName: this.legalName,
          phoneNumber: this.phoneNumber,
          productZone: this.productZone
        },
        success(res) {
          console.log('提交成功');
        },
        fail(err) {
          console.error('提交失败:', err);
        }
      });
    }
  }
};
</script>

<style scoped></style>
