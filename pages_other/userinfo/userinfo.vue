<template>
	<view class="user">
		<view class="user-section">
			<!-- 		<view class="portrait-box" @click="getAvatar">
				<image class="portrait" :src="avatar ? avatar : '/static/avatar.png'"></image>
			</view> -->
		</view>
		<view class="yt-list-cell">
			<view class="portrait-box" @click="getAvatar">
				<image class="portrait" :src="avatar ? avatar : '/static/avatar.png'" mode="aspectFill"></image>
				<image class="cremaIcon" src="@/static/my/crema.png" mode="aspectFill"></image>
			</view>
			<view class="title">
				昵称
			</view>
			<view class="input">
				<input class="input" type="text" v-model="nickname" />
			</view>
		</view>


		<view class="submit">
			<button @click="submit" class="submitBtn">提交保存</button>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				username: '',
				mobile: '',
				avatar: '',
				nickname: '',
				tempFilePath: ''
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.nickname = this.userInfo.nickname;
			this.username = this.userInfo.username;
			this.mobile = this.userInfo.mobile;
			this.avatar = this.userInfo.avatar ? this.userInfo.avatar : '';
		},
		methods: {
			...mapMutations(['setUserInfo']),
			getAvatar(e) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: function(res) {
						uni.showLoading({
							title: "上传中"
						});
						const tempFilePaths = res.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: that.$serverUrl + '/api/common/upload',
							filePath: tempFilePaths[0],
							name: 'file',
							success: function(uploadFileRes) {
								var res = JSON.parse(uploadFileRes.data);
								if (res.code == 1) {
									that.avatar = res.data.fullurl;
									that.submit();
								}
								setTimeout(function() {
									uni.hideLoading();
								}, 500);
							},
							fail: function(e) {
								setTimeout(function() {
									uni.hideLoading();
								}, 500);
								console.log(e);
							}
						});
					},
					fail: function() {
						uni.hideLoading();
					}
				});

			},

			async submit() {
				let data = await this.$api.request('/user/edit', 'POST', {
					nickname: this.nickname,
					avatar: this.avatar
				});
				if (data) {
					let userInfo = this.userInfo;
					userInfo.nickname = this.nickname;
					userInfo.avatar = this.avatar;
					this.setUserInfo(userInfo);
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/user/user'
						});
					}, 2000);
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}

	.user {
		position: relative;
		height: 100%
	}

	.user-section {
		height: 260rpx;
		position: relative;
		background-color: #FF3D00;
	}


	.yt-list-cell {
		width: 100%;
		height: 300rpx;
		padding: 0 24rpx;
		transform: translateY(-36rpx);
		border-radius: 36rpx;
		z-index: 99;
		font-size: 28rpx;
		background-color: #fff;
		.portrait-box {
			width: 160rpx;
			margin: 0 auto;
			position: relative;
			transform: translateY(-50%);
			overflow: hidden;
			.portrait {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				imgae {
					width: 160rpx;
					height: 160rpx;
				}
			}
			.cremaIcon{
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				position: absolute;
				bottom: 0;
				left: 50%;
			}
		}
			
		.title{
			font-weight: 500;
			height: 48rpx;
			line-height: 48rpx;
		}
		
		.input{
			height: 56rpx;
			padding: 0 24rpx;
			border-radius: 28rpx;
			background-color: #F2F4F7;
			margin-top: 18rpx;
			font-size: 24rpx;
			color: rgba(50, 50, 51, 0.6);
		}
	}


	.submit {
		width: 100%;
		height: 100rpx;
		position: absolute;
		bottom: 24rpx;
		left: 50%;
		transform: translateX(-50%);
		padding: 10rpx 30rpx;
	}


	.submitBtn {
		width: 100%;
		color: #fff;
		border-radius: 106rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		background: linear-gradient(133deg, #FF825B 0%, #FF5B5E 100%);
		box-shadow: $box_shadow;
	}
</style>