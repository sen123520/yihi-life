<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>

		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">

			<view class="welcome">

			</view>

			<view class="input-content">
				<view class="input-item">
					<text class="tit">登陆账号</text>
					<input type="text" v-model="username" placeholder-class="input-empty" placeholder="请输入登陆账号" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="mobile" v-model="password" placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty" maxlength="20" password @confirm="toLogin" />
				</view>
			</view>
			<view class="forget-section">
				<!-- <view> -->
				<view class="forgetPassword" @click="register('resetpwd')">忘记密码？</view>
				<view @click="register('register')">立马注册</view>
				<!-- </view> -->
			</view>
		</view>
		<view class="page-bottom">
			<button class="confirm-btn" @click="toLogin">登录</button>
			<view class="protocol-style">
<!-- 				<checkbox-group @change="changeAgree">
					<label>
						<checkbox value="agree" color="#ff5733" style="transform: scale(0.7)" />选中
					</label>
				</checkbox-group> -->
				<view class="select" @click="changeAgree">
					<image class="select-img" src="@/static/select.png" mode="aspectFill" v-if="!agree"></image>
					<image class="select-img" src="@/static/selected.png" mode="aspectFill" v-if="agree"></image>
				</view>
				<view class="protocol-text">
					<text class=""> 我已阅读并同意 </text>
					<text class="font-color-red" @click="toUserAgreement">
						《用户协议》
					</text>
					<text class=""> 和 </text>
					<text class="font-color-red" @click="toPrivacyPolicy">
						《隐私协议》
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from "vuex";

	export default {
		data() {
			return {
				agree: false,
				username: "",
				password: "",
				logining: false, //开锁
			};
		},
		onLoad() {},
		methods: {
			...mapMutations(["login"]),
			navBack() {
				uni.navigateBack();
			},

			//跳转到用户协议
			toUserAgreement() {
				uni.navigateTo({
					url: "/pages/article/article?id=2",
				});
			},

			//隐私政策
			toPrivacyPolicy() {
				// console.log(1223);
				uni.navigateTo({
					url: "/pages/article/article?id=1",
				});
			},

			changeAgree(e) {
				this.agree = !this.agree;
				console.log(e, this.agree);
			},

			async toLogin() {
				if (!this.agree) {
					return this.$api.msg("请阅读并同意隐私政策");
				}
				if (this.username == "" || this.password == "") {
					return this.$api.msg("账号或密码不能为空");
				}

				let data = await this.$api.request("/user/login", "POST", {
					username: this.username,
					password: this.password,
				});
				// console.log(data);
				if (data) {
					console.log(data);
					this.$store.commit("login", data);
					if (data.pw_status == 0) {
						setTimeout(function() {
							uni.switchTab({
								url: "/pages/user/user",
							});
						}, 1000);
					}
					if (data.pw_status == 202) {
						return uni.showModal({
							content: "密码长度需要在8-18字符之间",
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages_other/userinfo/changePassword",
									});
								}
							},
						});
					}
					if (data.pw_status == 201) {
						return uni.showModal({
							content: "密码安全性较低,请使用字母+数字组合",
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages_other/userinfo/changePassword",
									});
								}
							},
						});
					}
				}
			},
			register(event) {
				uni.navigateTo({
					url: "./register?event=" + event,
				});
			},
		},
	};
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.container {
		// padding-top: 60rpx;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.welcome {
		height: 326rpx;
		background: url('@/static/LoginBg.png') no-repeat center;
		background-size: cover;
		background-position: 0 -82rpx;
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		height: 122rpx;
		margin-bottom: 12rpx;
		border-bottom: rgba(51, 51, 51, 0.1) solid 1rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: 28rpx;
			color: $font-color-base;
			margin-bottom: 12rpx;
		}

		input {
			height: 60rpx;
			font-size: 24rpx;
			color: $font-color-dark;
			width: 100%;
			margin-bottom: 12rpx;
		}

		.input-empty {
			font-size: 24rpx;
			color: rgba(50, 51, 51, 0.6);
		}

	}
	.page-bottom{
		position: absolute;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.confirm-btn {
		width: 630rpx;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50px;
		margin-top: 0rpx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: 24rpx;
		color: $font-color-primary;
		text-align: center;
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 60rpx;

		.forgetPassword {
			color: rgba(50, 50, 51, 0.6);
		}
	}

	.protocol-style {
		margin-top: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgba(50, 51, 51, 0.6);
		font-size: 24rpx;

		.select-img{
			width: 24rpx;
			height: 24rpx;
			margin-right: 12rpx;
			margin-top: 8rpx;
		}
		.protocol-text {
			text-align: center;
			line-height: 50rpx;
		}

		.font-color-red {
			color: #ff5733;
		}
	}
</style>