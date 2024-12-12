<template>
	<view class="content">
		<view class="yt-list-cell">
			<view class="cell-tit clamp">
				<view class="title">
					银行卡号
				</view>
				<input class="input" type="text" v-model="bank_num" placeholder="请输入银行卡号码" />
			</view>
		</view>
		<view class="yt-list-cell">
			<view class="cell-tit clamp">
				<view class="title">
					银行卡归属人
				</view>
				<input class="input" type="text" v-model="real_name" placeholder="请输入银行卡归属人姓名" />
			</view>
		</view>
		<view class="yt-list-cell">
			<view class="cell-tit clamp">
				<view class="title">
					身份证号
				</view>
				<input class="input" type="text" v-model="real_idcard" placeholder="请输入银行卡归属人身份证号码" />
			</view>
		</view>
		<view class="yt-list-cell">
			<view class="cell-tit clamp">
				<view class="title">
					提现银行
				</view>
				<view class="input">
					<picker @change="bindPickerChange" :value="bank_index" :range="bank_array">
						<view class="uni-input">{{bank_array[bank_index]}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="yt-list-cell" v-on:click="showCityPicker()">
			<view class="cell-tit clamp">
				<view class="title">
					银行归属地
				</view>
				<view class="input">
					{{cityLebel}}
				</view>
			</view>
		</view>


		<view class="yt-list-cell">
			<view class="cell-tit clamp">
				<view class="title">
					手机号
				</view>
				<input class="input" type="text" v-model="real_mobile" placeholder="请输入银行预留手机号" />
			</view>
		</view>
		<view class="yt-list-cell" style="border-radius: 0 0 16rpx 16rpx;">
			<view class="cell-tit clamp">
				<text>验证码</text>
				<input class="input" type="text" v-model="captcha" placeholder="请输入验证码" />
				<text class="get_captcha" @click="getCaptcha">{{get_captcha}}</text>
			</view>
		</view>

		<view class='tips'>
			<view>* 提现需填写银行卡信息</view>
			<view>* 银行卡归属人，手机号归属人，身份证姓名必须一致，否则将提现失败</view>
			<view>* 身份证年龄需小于等于60岁</view>
		</view>

		<view class="submit" style="margin-top:40upx;background: none;">
			<button @click="submit" class="submitBtn">提交保存</button>
		</view>

		<mpvue-city-picker @onChange="onChange" @onCancel="onCancel" @onConfirm="onConfirm"
			ref="mpvueCityPicker"></mpvue-city-picker>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import mpvueCityPicker from '@/components/mpvueCityPicker.vue';
	export default {
		data() {
			return {
				real_name: '',
				real_idcard: '',
				real_mobile: '',
				bank_num: '',
				bank_array: ['请选择'],
				bank_index: 0,
				addressData: {
					province_id: 0,
					city_id: 0,
					area_id: 0,
				},
				pickerValueDefault: [0, 0, 0], //城市选择器默认值 省市区id
				cityLebel: '请选择地区',
				get_captcha: '获取验证码',
				captcha: ''
			};
		},
		components: {
			mpvueCityPicker
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.getBankInformation();
			this.getMyBank();

		},
		methods: {
			...mapMutations(['setUserInfo']),
			async getMyBank() {
				let info = await this.$api.request("/user/getMyBank");

				this.real_name = info.data.real_name;
				this.real_idcard = info.data.real_idcard;
				this.bank_num = info.data.bank_num;
				this.bank_name = info.data.bank_name;
				this.real_mobile = info.data.real_mobile
				if (Boolean(info.data.bank_name) == true) {
					console.log(info.data.bank_name);
					setTimeout(() => {
						this.bank_index = this.bank_array.indexOf(info.data.bank_name);
					}, 300)
				}

				if (info.data.bank_pid > 0 && info.data.bank_cid > 0 && info.data.bank_aid) {
					let pickerValueDefault = [];
					pickerValueDefault.push(info.data.bank_pid);
					pickerValueDefault.push(info.data.bank_cid);
					pickerValueDefault.push(info.data.bank_aid);
					this.pickerValueDefault = pickerValueDefault;
					this.$refs.mpvueCityPicker.creat(pickerValueDefault);
				}

			},
			async submit() {

				let post_data = {
					bank_name: ''
				};

				post_data.real_name = this.real_name
				post_data.real_idcard = this.real_idcard


				if (this.bank_index > 0) {
					post_data.bank_name = this.bank_array[this.bank_index]
				}
				post_data.bank_num = this.bank_num;
				post_data.bank_pid = this.addressData.province_id;
				post_data.bank_cid = this.addressData.city_id;
				post_data.bank_aid = this.addressData.area_id;
				post_data.captcha = this.captcha;
				post_data.real_mobile = this.real_mobile
				post_data.bank_index = this.bank_index
				let data = await this.$api.request('/user/editBank', 'POST', post_data);
				if (data) {
					let userInfo = this.userInfo;
					userInfo.real_name = post_data.real_name;
					userInfo.real_idcard = post_data.real_idcard;
					userInfo.bank_name = post_data.bank_name;
					userInfo.bank_num = post_data.bank_num;
					userInfo.bank_index = post_data.bank_index;
					userInfo.real_mobile = post_data.real_mobile;
					this.setUserInfo(userInfo);
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/user/user'
						});
					}, 2000);
				}
			},
			async getCaptcha() {
				let that = this;
				let num = 60;

				if (this.real_mobile == '') {
					this.$api.msg('请输入手机号码');
					return;
				}

				let data = await this.$api.request('/sms/send', 'POST', {
					mobile: this.real_mobile,
					event: 'editbank'
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
			bindPickerChange: function(e) {
				this.bank_index = e.detail.value
				console.log(this.bank_index);
			},
			// 城市选择器
			showCityPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			// 城市选择器改变值
			onChange(e) {
				// console.log('选择的值')
				// console.log(e);
			},
			// 城市选择器关闭
			onCancel(e) {
				//console.log(e);
			},
			// 城市选择器确定
			onConfirm(e) {
				//console.log(e);
				this.cityLebel = e.label;
				this.pickerValueDefault = e.value;

				this.addressData.province_id = this.pickerValueDefault[0];
				this.addressData.city_id = this.pickerValueDefault[1];
				this.addressData.area_id = this.pickerValueDefault[2];
			},
			//默认地址
			switchChange(e) {
				this.addressData.is_default = e.detail.value;
			},
			// 获取银行信息
			async getBankInformation() {
				try {
					const data = await this.$api.request('/user/getBankList', 'POST')
					this.bank_array = data
				} catch (err) {
					console.log(err);
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding: 24rpx;
	}

	.content {
		border-radius: 16rpx;
		// background-color: #fff;
		overflow: hidden;
	}

	.yt-list-cell {
		// margin-top: 16rpx;
		background: #fff;
		display: flex;
		align-items: center;
		padding: 10rpx 30rpx;
		line-height: 70rpx;
		position: relative;

		.cell-tit {
			width: 100%;
			font-size: 24rpx;
			color: #000000;
			margin-right: 10rpx;

			.title {
				height: 42rpx;
				line-height: 42rpx;
			}

			.input {
				font-size: 24rpx;
				// border: #000000 solid 1rpx;
				// margin-left: 20rpx;
				width: 100%;
				line-height: 60rpx !important;
				height: 60rpx !important;
				border-bottom: #f2f4f7 1rpx solid;
			}

			.username {
				width: 300rpx;
				position: absolute;
				right: 30rpx;
				z-index: 100;
			}
		}
	}

	.tips {
		margin-top: 24rpx;
		height: 160rpx;
		font-size: 24rpx;
		color: rgba(50, 50, 51, 0.6);
		text-align: left;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
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
</style>