<template>
	<view>
		
		<!-- 无二维码 -->
		<view class="empty" v-if="showEmpty"><image src="https://imageoss.qicaihemei34.com/images/noqrcode.jpg" mode="widthFix"></image></view>

		<!-- 二维码模糊背景 -->
		<view class="qrcode-background" v-if="codeList.length>0" v-for="(item, index) in codeList" :key="index" v-show="index==swiperIndex" :style="{'background-image': 'url(' + item + ')'}"></view>

		<!-- 二维码容器 -->
		<view class="qrcode" v-if="codeList.length>0">
			<swiper class="swiper" duration="300" previous-margin="20px" next-margin="20px" @change="swiperChange">
				<swiper-item v-for="(item, index) in codeList" :key="index"><image class="qrcode-img" :src="item" mode="widthFix"></image></swiper-item>
			</swiper>

			<!-- #ifdef APP-PLUS -->
			<view class="app-save-btn" @click="saveImg">保存此图片到手机相册</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="app-save-btn">长按图片可保存</view>
			<!-- #endif -->
		</view>
	
	</view>
</template>

<script>
export default {
	data() {
		return {
			//二维码图片列表
			codeList: [],
			//轮播当前索引
			swiperIndex: 0,
			//背景底图
			backgroundImg: "",
			//是否显示空状态
			showEmpty:false
		};
	},
	onLoad(option) {
		this.getSharePoster();
	},
	methods: {
		async getSharePoster(){
			let data = await this.$api.request('/user/getSharePoster');
			this.codeList = data.img_url;
			if (this.codeList.length > 0) {
				this.backgroundImg = this.codeList[0];
			} else {
				this.showEmpty = true;
			}
			
		},
		//轮播切换
		swiperChange(e) {
			this.swiperIndex = e.detail.current;
			this.backgroundImg = this.codeList[this.swiperIndex];
		},
		//保存图片到手机，仅在APP端使用
		saveImg() {
			plus.gallery.save(this.codeList[this.swiperIndex], function() {
				uni.showToast({
					title: '已保存到手机相册',
					icon: "none"
				});
			}, function() {
				uni.showToast({
					title: '保存失败',
					icon: "none"
				});
			});
		}
		
	}
};
</script>

<style lang="scss">
	.qrcode-background {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 2;
		background-repeat: round;
		filter: blur(55px);
	}

	.qrcode{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		/* #ifdef APP-PLUS */
		top: calc(var(--status-bar-height) + 30px);
		/* #endif */
		/* #ifdef H5 */
		top: 160upx;
		/* #endif */
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 10;
		.swiper {
			width: 750upx;
			height: 950upx;
			text-align: center;

			.qrcode-img {
				width: 75%;
				height: 100%;
			}
		}
		
		.app-save-btn {
			width: 240rpx;
			text-align: center;
			height: 60upx;
			line-height: 62upx;
			padding: 0 30upx;
			background: linear-gradient( 133deg, #FF825B 0%, #FF5B5E 100%);
			color: #fff;
			margin-top: 20upx;
			border-radius: 106rpx;
			font-size: 24rpx;
		}
		
		.h5-save-text {
			margin-top: 20upx;
		}
	}

</style>
