<template>
  <view class="main">
    <!-- <header class="header">
			<view class="header-right" @click="goback()">
				< 
			</view>
			<view class="header-center">
				账号复制
			</view>
			<view class="header-left">

			</view>
		</header> -->
    <view class="content">
      <view class="card-container">
        <view class="card">
          <!-- <image class="card-image" src="your_image_url" mode="aspectFill"></image> -->
          <view class="card-content">
            <h4 class="title">复制账号</h4>
            <text class="description">剩余可复制账号数量：{{ numberOfCopies }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="ipt">
      <input class="uni-input" focus placeholder="输入要复制的账号数量" v-model="numbers" />
      <uni-section title="选择用户分区" type="line" class="sele">
        <uni-data-select v-model="point" :localdata="range" @change="change"></uni-data-select>
      </uni-section>
      <button type="primary" plain="true" @click="copyAccount" class="btn">复制账号</button>
    </view>

    <view class="bottom">
      <text class="note">
        1.复制账号的所有收益会自动转到主账号中
        <br />
        2.复制的账号可通过切换账号的方式登陆
      </text>
    </view>
  </view>
</template>

<script>
export default {
  onLoad() {
    this.copyAccountMaxNum();
  },
  data() {
    return {
      numberOfCopies: '',
      numbers: '',
      point: 0,
      range: [
        {
          value: 'left',
          text: '左区'
        },
        {
          value: 'right',
          text: '右区'
        }
      ]
    };
  },
  methods: {
    // 获取可复制账号数量
    async copyAccountMaxNum() {
      try {
        const data = await this.$api.request('/user/copyAccountMaxNum', 'POST');
        this.numberOfCopies = data;
      } catch (err) {
        console.log(err);
      }
    },
    // 复制账号
    async copyAccount() {
      uni.showLoading({
        title: '加载中',
        mask: true
      });
      try {
        const data = await this.$api.request(
          '/user/copyAccount',
          'POST',
          {
            num: this.numbers,
            point: this.point
          },
          true,
          15000
        );
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(function () {
          uni.hideLoading();
        }, 500);
        uni.showModal({
          title: '提示',
          content: '复制完成',
          success: (res) => {
            if (res.confirm) {
              uni.redirectTo({
                url: '/pages_other/user/copyaccount'
              });
            } else if (res.cancel) {
              console.log('无事发生');
            }
          }
        });
      }
    },
    goback() {
      uni.switchTab({
        url: '/pages/user/user'
      });
    },
    change(e) {
      console.log('e:', e);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  background-color: #f8f8f8;
  height: calc(100vh - 88rpx);
  padding-top: 2rpx;
}

.ipt {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  // height: 200rpx;

  .btn {
    width: 50%;
    color: #fff;
    padding: 0 19px;
    margin: 0 auto;
    border-radius: 100px;
    height: 39px;
    line-height: 35px;
    font-size: 15px;
    background: #d34d68;
    box-shadow: 1px 2px 5px rgba(244, 67, 54, 0.4);
    border: 0;
    margin-top: 40rpx;
  }

  input {
    height: 80rpx;
    width: 660rpx;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 20rpx;
    padding-left: 40rpx;
  }

  .sele {
    width: 660rpx;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 10rpx;
  }
}

.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh;
}

.card {
  width: 660rpx;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 150px;
  border-radius: 10px 10px 0 0;
}

.card-content {
  padding: 16px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.description {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.bottom {
  position: absolute;
  bottom: 20rpx;
  margin: 0 40rpx;

  .note {
    color: #ccc;
    font-size: 30rpx;
  }
}

::v-deep .uni-select {
  margin: 10px;
  width: 95%;
}
::v-deep .uni-section .uni-section-header__decoration {
  background-color: #d34d68;
}
</style>
