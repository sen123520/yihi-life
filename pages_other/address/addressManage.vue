<template>
	<view>
		<view class="content">
			<view class="row b-b">
				<text class="tit">收货人</text>
				<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">联系电话</text>
				<input class="input" type="number" v-model="addressData.mobile" placeholder="收货人手机号码"
					placeholder-class="placeholder" />
			</view>
			<view class="row b-b" v-on:click="showCityPicker()">
				<text class="tit">收货地址</text>
				<view class="input">
					{{ cityLebel }}
				</view>
			</view>
			<view class="row b-b">
				<text class="tit">详细地址</text>
				<input class="input" type="text" v-model="addressData.address" placeholder="详细地址,楼号"
					placeholder-class="placeholder" />
			</view>
			<view class="moren">
				<switch :checked="addressData.is_default" style="transform:scale(0.7)" color="#FF001F" @change="switchChange" />
				<text class="tit">设为默认</text>
			</view>

		</view>

		<button class="add-btn" @click="confirm">提交</button>

		<mpvue-city-picker @onChange="onChange" @onCancel="onCancel" @onConfirm="onConfirm"
			ref="mpvueCityPicker"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvueCityPicker.vue';
	import {
		onMounted
	} from 'vue';
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				addressData: {
					name: '',
					mobile: '',
					address: '',
					province_id: 0,
					city_id: 0,
					area_id: 0,
					is_default: false
				},
				pickerValueDefault: [0, 0, 0], //城市选择器默认值 省市区id
				cityLebel: '请选择地区'
			};
		},
		onLoad(option) {
			let title = '新增收货地址';
			if (option.type === 'edit') {
				console.log(option);
				this.getInfo(option.id);
				title = '编辑收货地址';
			} else {}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			});
		},
		onMounted() {
			this.$refs.mpvueCityPicker.creat(this.pickerValueDefault);
		},
		methods: {
			// 获取地址详情
			async getInfo(id) {
				let addressData = await this.$api.request(`/address/info?id=${id}`);
				if (addressData) {
					//console.log(addressData);

					this.addressData = addressData;
					let pickerValueDefault = [];
					pickerValueDefault.push(addressData.province_id);
					pickerValueDefault.push(addressData.city_id);
					pickerValueDefault.push(addressData.area_id);
					this.pickerValueDefault = pickerValueDefault;

					this.$refs.mpvueCityPicker.creat(pickerValueDefault);
				}
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
			//提交
			async confirm() {
				//Deep Clone
				let data = JSON.parse(JSON.stringify(this.addressData));
				if (!data.name) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(data.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (!data.address) {
					this.$api.msg('请填详细地址信息');
					return;
				}

				data.is_default = data.is_default == true ? 1 : 0;
				let action = this.manageType == 'edit' ? 'edit' : 'add';
				let result = await this.$api.request('/address/' + action, 'POST', data);
				if (result) {
					this.$api.prePage().refreshList(data, this.manageType);
					setTimeout(() => {
						uni.navigateBack();
					}, 800);
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
		background-color: #f2f4f7;
		padding: 24rpx;
	}

	.content {
		background-color: #fff;
		border-radius: 16rpx;
		padding-bottom: 24rpx;
		overflow: hidden;
		.moren{
			font-size: 24rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: right;
		}
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 24rpx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			height: 56rpx;
			line-height: 56rpx;
			padding-left: 24rpx;
			font-size: 24rpx;
			color: $font-color-dark;
			background-color: #f2f3f7;
			border-radius: 16rpx;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(0.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		margin: 24rpx auto;
		font-size: 28rpx;
		color: #fff;
		background: linear-gradient( 133deg, #FF825B 0%, #FF5B5E 100%);
		border-radius: 106rpx;
		box-shadow: $box_shadow;
	}
</style>