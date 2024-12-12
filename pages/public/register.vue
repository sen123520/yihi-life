<template>
	<view class="container">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>

		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->

		<view class="wrapper">
			<view class="welcome">
				<!-- {{desc}} -->
			</view>
			<view class="input-content">

				<view class="input-item">
					<text class="tit">账号</text>
					<input type="text" v-model="username" placeholder="请输入登陆账号" />
				</view>

				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="mobile" placeholder="请输入手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input style="width: 300rpx;" type="text" v-model="captcha" placeholder="请输入验证码" />
					<button class="get_captcha" @click="getCaptcha">{{get_captcha}}</button>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="text" v-model="password" placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty" maxlength="18" minlength="8" password />
				</view>
				<view class="input-item">
					<text class="tit">确认密码</text>
					<input type="text" v-model="passwordRe" placeholder="请确认密码,确保两次密码一致" placeholder-class="input-empty"
						maxlength="18" minlength="8" password @confirm="toLogin" />
				</view>


				<view class="input-item" v-if="event == 'register'">
					<text class="tit">推荐人账号(必填)</text>
					<input type="text" v-model="r_username" placeholder="请输入推荐人账号" />
				</view>

				<view class="input-item" v-if="event == 'register'">
					<text class="tit">接点人账号(选填)</text>
					<input type="text" v-model="c_username" placeholder="请输入接点人账号" />
				</view>
				<view class="input-item" v-if="event == 'register'">
					<text class="tit">请选择左右区</text>
					<picker :value="pointIndex" :range="pointArray" @change="changePoint">
						<input type="text" v-model="pointArray[pointIndex]" />
					</picker>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">
				{{status}}
			</button>
			<view class="protocol-style">
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
	} from 'vuex';

	export default {
		data() {
			return {
				username: '',
				r_username: '',
				c_username: '',
				point: '',
				nickname: '',
				mobile: '',
				password: '',
				passwordRe: '',
				captcha: '',
				logining: false,
				status: '',
				desc: '',
				get_captcha: '获取验证码',
				event: '',
				pointArray: ['左区', '右区'],
				pointArray_2: ['left', 'right'],
				pointIndex: 0,
				agree: false,
			}
		},
		onLoad(options) {
			if (options.event == 'register') {
				this.status = '立即注册';
				this.desc = '注册账号'
			} else {
				this.status = '确认修改';
				this.desc = '修改密码';
				uni.setNavigationBarTitle({
					title: '修改密码'
				})
			}
			this.event = options.event;
			this.recommendedRegistration()
		},
		methods: {
			...mapMutations(['login']),
			changePoint: function(e) {
				this.pointIndex = e.detail.value
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
			async getCaptcha() {
				let that = this;
				let num = 60;

				if (this.mobile == '') {
					this.$api.msg('请输入手机号码');
					return;
				}

				let data = await this.$api.request('/sms/send', 'POST', {
					mobile: this.mobile,
					event: this.event
				});
				if (data) {
					that.get_captcha = num + ' S';
					let intervalId = setInterval(function() {
						num--;
						that.get_captcha = num + ' S';
						if (num == 0) {
							that.get_captcha = '获取验证码'
							clearInterval(intervalId);
						}
					}, 1000);
				}
			},
			navBack() {
				uni.navigateBack();
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			async toLogin() {
				if ((this.username && this.password && this.mobile && this.captcha) == false) {
					return uni.showToast({
						title: '请输入相关信息',
						icon: 'none',
						duration: 2000
					})
				}
				let url = this.event == 'register' ? '/user/register' : '/user/resetpwd';
				if (this.password != this.passwordRe) {
					this.password = ''
					this.passwordRe = ''
					return uni.showToast({
						title: '两次密码不一致，请重新设置密码',
						icon: 'none',
						duration: 2000
					})
				}
				if (!this.agree) {
					return this.$api.msg("请阅读并同意隐私政策");
				}
				let data = await this.$api.request(url, 'POST', {
					mobile: this.mobile,
					password: this.password,
					username: this.username,
					captcha: this.captcha,
					event: this.event,
					r_username: this.r_username,
					c_username: this.c_username,
					point: this.pointArray_2[this.pointIndex]
				});
				if (data) {
					//this.login(data.userinfo);
					setTimeout(function() {
						uni.navigateTo({
							url: '/pages/public/login'
						});
					}, 1500);
				} else {

				}
			},
			forget() {
				uni.navigateTo({
					url: './forget'
				})
			},
			register() {
				uni.navigateTo({
					url: './forget'
				})
			},
			async recommendedRegistration() {
				let pid = uni.getStorageSync('pid')
				try {
					const data = await this.$api.request('/user/bindUpTemp', 'POST', {
						pid: pid
					});
					this.r_username = data.username ? data.username : ''
				} catch (err) {

				}
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 0rpx;
		position: relative;
		/* width: 100vw; */
		/* height: 100vh; */
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

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
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
		height: 120upx;
		/* border-radius: 4px; */
		margin-bottom: 50upx;
		position: relative;
		border-bottom: rgba(51, 51, 51, 0.1) solid 1rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50rpx;
			line-height: 56rpx;
			font-size: 28rpx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: 24rpx;
			color: $font-color-dark;
			width: 100%;
		}

		.captcha {
			width: 300rpx;
		}

		.get_captcha {
			position: absolute;
			right: 0;
			top: 46rpx;
			display: block;
			width: 200rpx;
			background: transparent;
			color: #ff3f01;
			text-align: center;
			font-size: 28rpx;
			z-index: 100;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		color: #fff;
		background: linear-gradient(270deg, #FF7A00 0%, #FF3D00 100%);
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+10upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 100upx;

		label {
			margin: 10upx 60upx;
		}
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}

	.protocol-style {
		margin-top: 24rpx;
		margin-bottom: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #cccccc;
		font-size: 24rpx;

		.select-img {
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

	.protocol-empty-style {
		height: 120rpx;
	}

	.get_captcha::after {
		content: none;
	}
</style>