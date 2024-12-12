<template>
	<view class="container">
		<view class="container-header">
			<view class="container-header-title" v-if="mainAccount">主账号</view>
			<view class="container-header-title" v-if="!mainAccount">子账号</view>
			<view class="container-header-desc">可以设置子账号自动转账到主账号。</view>
		</view>
		<scroll-view class="scroll-view" scroll-y>
			<cowain-slide-action :slide-width="{
          widths: state ? 360 : 0,
          mainAccount: rights
        }" v-for="(item, index) in mainAccount ? accounts : subAccount" :key="index" style="margin-right: -256rpx">
				<template v-slot:card>
					<view class="list" @click.stop="slide">
						<view :class="item.now_down_tag ? 'person_box' : 'person_box'">
							<view :class="item.now_down_tag ? 'active identifying' : 'identifying'"></view>
							<view class="p_img" v-if="show">
								<image :src="item.avatar" mode="aspectFill"></image>
							</view>
							<view :class="show ? 'p_title' : 'active2'">
								<view class="t1 clamp">账号：{{ item.username }}</view>
								<view class="" style="display: flex">
									<view v-if="userInfo.id == item.id" class="nowaccount" style="margin: 8rpx">当前登录
									</view>
									<view v-if="item.master_money_id" class="nowaccount" style="margin: 8rpx">自动转账
									</view>
									<view class="nowaccount" style="margin: 8rpx">{{ item.rebate_level_name }}</view>
								</view>
							</view>
						</view>
					</view>
				</template>
				<template v-slot:delete>
					<view class="delete-wrap">
						<button @click.stop="onDeleteItemClick(item.id)" v-if="userInfo.id != item.id">切换账号</button>
						<button @click.stop="switchSubAccounts(item.id)" v-if="mainAccount">查看子账号</button>
						<button @click.stop="removeMaster(item.id)" v-if="item.master_id && !mainAccount">解除从属</button>
						<button @click.stop="transferAccounts(item.id)"
							v-if="!mainAccount && item.master_id && !item.master_money_id">自动转账</button>
						<button @click.stop="cancellationTransferAccounts(item.id)"
							v-if="!mainAccount && item.master_id && item.master_money_id">取消转账</button>
					</view>
				</template>
			</cowain-slide-action>
			<button class="btn" @click.stop="mainAccount = !mainAccount" v-if="!mainAccount">返回</button>
		</scroll-view>
		<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0">
			<view class="popup-box">
				<view class="popup-title">
					请输入目标账号的密码
				</view>
				<view class="popup-input">
					<input type="password" placeholder="请输入密码" v-model="password" placeholder-style="font-size: 24rpx;">
				</view>
				<view class="popup-btn">
					<view class="popup-btn-cancel" @click="onClose">
						取消
					</view>
					<view class="popup-btn-comfirm" @click="onComfirm">
						确定切换
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				accounts: [],
				state: true,
				mainAccount: true,
				subAccount: [],
				moneyID: null,
				show: true,
				num: 360,
				rights: true,
				password: '',
				selectId: ''
			};
		},
		onLoad() {
			this.getAccount();
			// this.getPhoneModel()
		},
		methods: {
			open() {
				this.$refs.popup.open('center')
			},
			onClose() {
				this.$refs.popup.close()
			},

			async onComfirm() {
				let data = await this.$api.request('/user/loginById', 'POST', {
					user_id: this.selectId,
					password: this.password,
				});
				if (data) {
					this.$store.commit('login', data);
					uni.showToast({
						title: '切换中',
						icon: 'loading',
						duration: 1000
					});
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/user/user'
						});
					}, 1000);
				}
			},
			onDeleteItemClick(id) {
				// uni.showToast({
				// 	title: `点击了${id}位置`,
				// 	icon: 'none'
				// })
				// 切换账号
				if (id == this.userInfo.id) {
					return false;
				}
				this.selectId = id
				this.open()

			},
			// 获取所有主账号
			async getAccount() {
				let data = await this.$api.request('/user/getMasterAccount');
				this.accounts = data;
			},
			// 获取所有子账号
			async switchSubAccounts(id) {
				try {
					const data = await this.$api.request('/user/getSlaveAccount', 'POST', {
						master_id: id
					});
					this.subAccount = data;
				} catch (err) {
					console.log(err);
				} finally {
					this.rights = false;
					this.mainAccount = false;
				}
			},
			slide() {
				this.show = !this.show;
				this.state = !this.state;
			},
			// 解除从属关系
			async removeMaster(id) {
				uni.showModal({
					content: '账号间解除主从关系后，若子账号不改变手机号，那么主账号仍旧可以通过切换账号的形式登陆子账号。',
					confirmText: '确定解除',
					success: async (e) => {
						if (e.confirm) {
							let data = await this.$api.request('/user/removeMaster', 'POST', {
								slave_id: id
							});
						}
					}
				});
			},
			// 设置自动转账
			async transferAccounts(id) {
				uni.showModal({
					content: '设置子账号自动转账',
					confirmText: '确定',
					success: async (e) => {
						if (e.confirm) {
							let data = await this.$api.request('/user/setMoneyMaster', 'POST', {
								slave_id: id
							});
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages_other/user/newSwitchAccount'
								});
							}, 800);
						}
					}
				});
			},
			// 取消自动转账
			async cancellationTransferAccounts(id) {
				uni.showModal({
					content: '取消子账号自动转账',
					confirmText: '确定',
					success: async (e) => {
						if (e.confirm) {
							try {
								let data = await this.$api.request('/user/removeMoneyMaster', 'POST', {
									slave_id: id
								});
							} catch (err) {
								console.log(err);
							}
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages_other/user/newSwitchAccount'
								});
							}, 800);
						}
					}
				});
			}
			// 获取手机型号
			// getPhoneModel() {
			// 	let brand = '';
			// 	let zhDev = {
			// 		'apple': 'iPhone',
			// 		'samsung': '三星',
			// 		'huawei': '华为',
			// 		'xiaomi': '小米',
			// 		'oppo': 'OPPO',
			// 		'vivo': 'Vivo',
			// 		'oneplus': '一加',
			// 		'sony': '索尼',
			// 		'lg': 'LG',
			// 		'motorola': '摩托罗拉',
			// 		'google': '谷歌',
			// 		'nokia': '诺基亚',
			// 		'htc': 'HTC',
			// 		'lenovo': '联想',
			// 		'asus': '华硕',
			// 		'zte': '中兴',
			// 		'meizu': '魅族',
			// 		'coolpad': '酷派',
			// 	}
			// 	if (uni.getSystemInfoSync().platform === 'android' || 'ios') {
			// 		let model = uni.getSystemInfoSync().brand.toLowerCase();
			// 		brand = zhDev[model] ? zhDev[model] : '其它'
			// 	} else {
			// 		brand = '其它'
			// 	}
			// 	console.log('手机品牌', brand)
			// },
		},
		computed: {
			...mapState(['userInfo'])
		}
	};
</script>

<style lang="less">
	page {
		background-color: #f2f4f7;
		padding: 24rpx;
	}

	.container {
		width: 100%;
		background-color: #fff;
		border-radius: 16rpx;
		overflow: auto;
	}

	.container-header {
		height: 120rpx;
		width: 100%;
		border-bottom: #f2f4f7 solid 1rpx;

		.container-header-title {
			height: 48rpx;
			line-height: 48rpx;
			font-size: 28rpx;
		}

		.container-header-desc {
			height: 48rpx;
			line-height: 48rpx;
			font-size: 24rpx;
			color: rgba(50, 50, 51, 0.6);
		}
	}

	.scroll-view {
		width: 100%;
		.content {
			width: 100%;
		}
	}

	.card {
		margin-left: 24rpx;
		width: 702rpx;
		height: 171rpx;
		padding: 28rpx 24rpx;
		box-sizing: border-box;
		border-radius: 24rpx;
		background-color: white;
	}

	.header-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title-wrap {
		display: flex;
		align-items: center;
	}

	.dot {
		margin-right: 11rpx;
		width: 16rpx;
		height: 16rpx;
		background-color: rgba(222, 11, 11, 1);
		border-radius: 8rpx;
	}

	.title {
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #323233;
		line-height: 45rpx;
	}

	.remark {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 26rpx;
	}

	.time {
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		// color: $txt-black-204;
		line-height: 36rpx;
	}

	.msg {
		width: 540rpx;
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		line-height: 36rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.delete-wrap {
		position: absolute;
		right: 0;
		top: 0;
		width: 400rpx;
		height: 138rpx;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		z-index: 999;
		padding-right: 4rpx;

		button {
			height: 48rpx;
			line-height: 48rpx;
			background-color: rgba(50, 50, 51, 0.05);
			color:#323233;
			font-size: 20rpx;
			padding: 0 16rpx;
		}
	}

	.icon-delete {
		width: 80rpx;
		height: 80rpx;
		object-fit: cover;
	}

	/* 原样式 */
	page {
		// background: $page-color-base;
		padding-bottom: 100upx;
	}

	.container {
		padding: 24rpx;
	}

	.title {
		font-size: 50upx;
		text-align: center;
		line-height: 2;
		font-family: Source Han Sans CN;
		position: relative;
		color: #333;
	}

	.title::after {
		position: absolute;
		content: '';
		left: 0;
		right: 0;
		bottom: 0;
		width: 110px;
		height: 1px;
		background-color: #ababab;
		margin: 0 auto;
		text-align: center;
	}

	.small_title {
		font-size: 30upx;
		text-align: center;
		line-height: 3;
		color: #9d9d9d;
	}

	.list {
		margin-bottom: 32rpx;
		border-bottom: #f2f4f7 solid 1rpx;
		.person_box {
			height: 128rpx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			background: #fff;
			// padding: 20upx;
			// margin-bottom: 20upx;

			.p_img {
				width: 88rpx;

				image {
					width: 88rpx;
					height: 88rpx;
					border-radius: 44rpx;
				}
			}

			.p_title {
				color: rgba(50, 50, 51, 0.6);
				font-size: 24rpx;
				margin: 0 0 0 20upx;

				.t1 {
					line-height: 2;
				}
			}
		}
	}

	.nowaccount {
		background: rgba(255,0,31,0.05);
		color: #FF001F;
		padding: 4rpx 20rpx;
		text-align: center;
		border-radius: 12rpx;
		line-height: 2;
		font-size: 20rpx;
	}

	.add-btn {
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		// background-color: $base-color;
		border-radius: 10upx;
		// box-shadow: $box_shadow;
	}

	.btn {
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 24rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		font-size: 28rpx;
		color: #fff;
		background: linear-gradient( 133deg, #FF825B 0%, #FF5B5E 100%);
		border-radius: 106rpx;
		box-shadow: 1px 2px 5px rgba(244, 67, 54, 0.4);
	}

	.identifying {
		width: 2px;
		height: 100rpx;
		position: relative;
		left: -20rpx;
	}

	.active {
		border: 2px solid #ff6974;
	}

	.active2 {
		color: #333;
		font-size: 12px;
	}

	.popup-box {
		width: 524rpx;
		height: 282rpx;
		border-radius: 16rpx;
		background-color: #fff;
		padding: 20rpx;

		.popup-title {
			font-size: 28rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
		}

		.popup-input {
			padding: 0 24rpx;
			margin-top: 12rpx;
			font-size: 24rpx;
			height: 56rpx;
			display: flex;
			align-items: center;
			background-color: #f2f4f7;
			border-radius: 16rpx;
		}

		.popup-btn {
			height: 140rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.popup-btn-cancel {
				width: 234rpx;
				height: 78rpx;
				line-height: 78rpx;
				text-align: center;
				font-size: 24rpx;
				color: rgba(50, 50, 51, 0.6);
				border-radius: 16rpx;
				border: rgba(50, 50, 51, 0.3) solid 1rpx;
			}

			.popup-btn-comfirm {
				width: 234rpx;
				height: 78rpx;
				line-height: 78rpx;
				text-align: center;
				font-size: 24rpx;
				background: linear-gradient(133deg, #FF825B 0%, #FF5B5E 100%);
				color: #fff;
				border-radius: 16rpx;

			}

		}
	}
</style>