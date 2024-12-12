<template>
	<view>
		<view class="input-content">
			<view class="input-item">
				<text class="tit">手机号码</text>
				{{mobile}}
			</view>
			<view class="input-item">
				<text class="tit">请输入账户</text>
				{{account}}
				<!-- <input type="text" v-model.trim="account" placeholder="请输入需要修改密码的账号" /> -->
			</view>
			<view class="input-item">
				<text class="tit">请输入新登录密码</text>
				<input type="password" v-model="password" placeholder="请输入8-18位必须包含数字+字母组合的密码" />
			</view>
			<view class="input-item">
				<text class="tit">请再次输入密码</text>
				<input type="password" v-model="passwordRe" placeholder="请再次输入密码以确保两次密码一致" />
			</view>
			
			<view class="input-item">
				<text class="tit">验证码</text>
				<input type="text" v-model="captcha" placeholder="请输入验证码" data-key="captcha" />
				<view class="get_captcha" @click="getCaptcha">{{get_captcha}}</view>
			</view>
		</view>
		<view class="submit">
			<button @click="submit" class="submitBtn">提交保存</button>
		</view>
		<!-- <view class='tips'>
			<view>* 同一账号只能修改三次手机号</view>
		</view> -->
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
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
				password: '',
				get_captcha: '获取验证码',
				captcha: '',
				mobile: '',
				account:'',
				message: '',
				messageText: '',
				msgType:'success',
				passwordRe:'',
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.mobile = this.userInfo.mobile;
			this.account = this.userInfo.username
		},
		methods: {
			// 校验密码
			 validatePassword(password) {
			      // 校验密码必须为8到18位且包含数字和字母
			      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,18}$/;
			      return regex.test(password);
			    },
			// 获取验证码
			async getCaptcha() {
				let that = this;
				let num = 60;

				if (this.mobile == '') {
					this.$api.msg('请输入手机号码');
					return;
				}
				if (this.mobile !=this.userInfo.mobile ) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (this.password == '') {
					this.$api.msg('请输入新密码');
					return;
				}
				
				if (this.validatePassword(this.password)===false) {
					return this.$api.msg('请输入8-18位必须包含数字+字母组合');					
				}
				
				let data = await this.$api.request('/sms/send', 'POST', {
					mobile: this.mobile,
					event: 'resetpwd'
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
			// 修改密码
			async submit() {
				if(this.captcha==''){
					return uni.showToast({
						title:'请输入验证码',
						icon:'none'
					})
				}
				if(this.password!=this.passwordRe){
					this.password=''
					this.passwordRe=''
					return uni.showToast({
						title:'两次输入密码不一致，请重新设置密码',
						icon:'none',
						duration:2000
					})
				}
				try {
					const data = await this.$api.request('/user/changepwd', 'POST', {
						password: this.password,
						mobile: this.mobile,
						username:this.account,
						captcha: this.captcha
					})
					if(data==1){
						this.messageToggle(
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/public/login'
								})
							}, 1500))
					}
					console.log(data);
				} catch (err) {
					console.log(err);
				} finally {
				
				}
			},
			messageToggle() {
				this.msgType = 'success'
				this.messageText = `修改成功，即将跳转登录页`
				this.$refs.message.open()
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding: 24rpx;
	}

	.input-content {
		background-color: #fff;
		padding: 24rpx;
		border-radius: 16rpx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 24rpx;
		height: 132rpx;
		border-bottom: rgba(50, 50, 51, 0.1) solid 1rpx;
		position: relative;
		font-size: 24rpx;

		&:last-child {
			margin-bottom: 12rpx;
		}

		.tit {
			height: 60rpx;
			line-height: 66rpx;
			font-size: 24rpx;
			color: #323233;
			font-weight: 500;
		}

		input {
			height: 70upx;
			font-size: 24rpx;
			color: #323233;
			width: 100%;
		}

		.get_captcha {
			position: absolute;
			bottom: 12rpx;
			right: 20rpx;
			display: block;
			width: 200rpx;
			color: #FF3F01;
			text-align: center;
			line-height: 60upx;
			height: 60upx;
			z-index: 100;
			font-size: 24rpx;

			&::before {
				content: '';
				display: inline-block;
				height: 20rpx;
				width: 4rpx;
				margin-top: 4rpx;
				background: rgba(50, 50, 51, 0.3);
				margin-right: 16rpx;
			}
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

	.tips {
		font-size: $font-base;
		font-color: $font-color-light;
		text-align: center;
		padding: 20upx;
	}
</style>