<template>
	<view class="container">
		<view class="user-section">
			<view class="user-top">
				<text></text>
				<text>个人中心</text>
				<text></text>
			</view>

			<view class="user-info-box">
				<view class="portrait-box" @click="$api.navTo('/pages_other/userinfo/userinfo')">
					<image class="portrait" :src="userInfo.avatar ? userInfo.avatar : '/static/avatar.png'"></image>
				</view>
				<view class="info-box" :style="!hasLogin ? 'flex: 1' : ''">
					<view class="userinfo" v-if="userInfo.username">账号：{{ userInfo.username }}</view>
					<view class="userinfo" v-if="userInfo.mobile">手机号: {{ maskMobile(userInfo.mobile) }}</view>
					<!-- 用户级别 -->
					<view class="username">
						<view v-if="!hasLogin">游客</view>
						<!-- 会员等级 -->
						<view class="pin" v-if="hasLogin">
							<image :src="vipIcon[extend_info.level.rebate_level]" mode="aspectFill"></image>
							<text> {{ extend_info.level.rebate_level_text }}</text>
						</view>
						<!-- 联创 -->
						<view class="pin" v-if="extend_info.level.create_level > 0 && hasLogin">
							<image :src="createIcon[extend_info.level.create_level]"></image>
							<text> {{ extend_info.level.create_level_text }} </text>	
						</view>
						<!-- 社区等级 -->
						<view class="pin" v-if="extend_info.level.sgroup_level > 0 && hasLogin">
							<image src="@/static/my/sgroup.png" mode="aspectFill"></image>
							<text> {{ extend_info.level.sgroup_level_text }}</text>
						</view>
						<!-- 门店等级 -->
						<view class="pin" v-if="extend_info.level.shop_level > 0 && hasLogin">
							<image src="@/static/my/shop.png" mode="aspectFill"></image>
							<text> {{ extend_info.level.shop_level_text }}</text>							
						</view>
						<!-- 合伙人 -->
						<view class="pin" v-if="extend_info.level.yibao_level > 0 && hasLogin">
							<image src="@/static/my/he.png" mode="aspectFill"></image>
							<text> {{ extend_info.level.yibao_level_text }}</text>	
						</view>
						<!-- 驿站 -->
						<view class="pin" v-if="extend_info.level.is_yizhan > 0 && hasLogin">
							<image src="@/static/my/yi.png" mode="aspectFill"></image>
							<text> 驿 </text>	
						</view>
						<!-- 股东 -->
						<view class="pin" v-if="extend_info.level.is_gudong > 0 && hasLogin">
							<image src="@/static/my/gu.png" mode="aspectFill"></image>
							<text> 股 </text>	
						</view>
					</view>
				</view>
				<!-- 二维码 -->
				<view class="qrcode" @click="turnQrcodePage()" v-if="hasLogin">
					<view class="iconfont top_erweima">&#xe607;</view>
				</view>
			</view>

		</view>

		<!-- 功能区 -->
		<view class="cover-container">
			<view class="" style="position: relative; bottom: 220rpx">
				<!-- 我的订单 -->
				<view class="order-header">
					<view class="title">我的订单</view>
					<view class="item" @click="$api.navTo('/pages_other/order/order?state=0')">
						查看全部
						<text class="yticon right icon-you"></text>
					</view>
				</view>
				<view class="order-section">
					<view class="order-item" @click="$api.navTo('/pages_other/order/order?state=1')"
						hover-class="common-hover" :hover-stay-time="50">
						<!-- <text class="yticon icon-daifukuan"></text> -->
						<image src="@/static/daifukuan.png" mode="aspectFill"></image>
						<text class="num" v-if="orderNum.unpaid > 0 && hasLogin">{{ orderNum.unpaid }}</text>
						<text>待付款</text>
					</view>
					<view class="order-item" @click="$api.navTo('/pages_other/order/order?state=2')"
						hover-class="common-hover" :hover-stay-time="50">
						<image src="@/static/daifahuo.png" mode="aspectFill"></image>
						<text class="num" v-if="orderNum.undelivered > 0 && hasLogin">{{ orderNum.undelivered }}</text>
						<text>待发货</text>
					</view>
					<view class="order-item" @click="$api.navTo('/pages_other/order/order?state=3')"
						hover-class="common-hover" :hover-stay-time="50">
						<image src="@/static/daishouhuo.png" mode="aspectFill"></image>
						<text class="num" v-if="orderNum.unreceived > 0 && hasLogin">{{ orderNum.unreceived }}</text>
						<text>待收货</text>
					</view>
					<view class="order-item" @click="$api.navTo('/pages_other/order/order?state=4')"
						hover-class="common-hover" :hover-stay-time="50">
						<image src="@/static/pingjia.png" mode="aspectFill"></image>
						<text class="num" v-if="orderNum.uncomment > 0 && hasLogin">{{ orderNum.uncomment }}</text>
						<text>评价</text>
					</view>
					<!-- <view class="order-item" @click="$api.navTo('/pages_other/order/order?state=5')"
						hover-class="common-hover" :hover-stay-time="50">
						<text class="yticon icon-shouhou"></text>
						<text class="num" v-if="orderNum.refund > 0">{{orderNum.refund}}</text>
						<text>退款/售后</text>
					</view> -->
				</view>


				<!-- 常用 -->
				<view class="history-section icon">
					<view class="history-header">
						<view class="title">常用</view>
					</view>
					<uni-grid :column="4" :show-border="false" :square="false">
						<uni-grid-item>
							<view class="grid-item-box" @click="$api.navTo('/pages_other/address/address')">
								<view class="icon_list">
									<image src="/static/my/shouhuodizhi.png" mode="aspectFit"></image>
								</view>
								<view class="text">收货地址</view>
							</view>
						</uni-grid-item>

						<uni-grid-item v-if="hasLogin">
							<view class="grid-item-box" @click="turnQrcodePage()">
								<view class="icon_list">
									<image src="/static/my/fenxianghaibao.png" mode="aspectFit"></image>
								</view>
								<view class="text">分享海报</view>
							</view>
						</uni-grid-item>
						<uni-grid-item v-if="determine">
							<view class="grid-item-box" @click="$api.navTo('/pages/user/vipdesc')">
								<view class="icon_list">
									<image src="/static/my/huiyuandengji.png" mode="aspectFit"></image>
								</view>
								<view class="text">会员等级</view>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box" @click="$api.navTo('/pages/favorite/favorite')">
								<view class="icon_list">
									<image src="/static/my/wodeshoucang.png" mode="aspectFit"></image>
								</view>
								<view class="text">我的收藏</view>
							</view>
						</uni-grid-item>
						<uni-grid-item v-if="!determine">
							<view class="grid-item-box" @click="$api.navTo('/pages_other/user/switchAccount')">
								<view class="icon_list">
									<image src="/static/my/zhanghaoguanli.png" mode="aspectFit"></image>
								</view>
								<view class="text">账号管理</view>
							</view>
						</uni-grid-item>
						<uni-grid-item v-if="determine">
							<view class="grid-item-box" @click="$api.navTo('/pages_other/user/newSwitchAccount')">
								<view class="icon_list">
									<image src="/static/my/zhanghaoguanli.png" mode="aspectFit"></image>
								</view>
								<view class="text">账号管理</view>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box" @click="$api.navTo('/pages/set/set')">
								<view class="icon_list">
									<image src="/static/my/shezhi.png" mode="aspectFit"></image>
								</view>
								<view class="text">设置</view>
							</view>
						</uni-grid-item>
						<uni-grid-item v-if="extend_info.user_info.tieqing_url">
							<view class="grid-item-box" @click="openTieqing">
								<view class="icon_list">
									<image src="/static/my/wurenche.png" mode="aspectFit"></image>
								</view>
								<view class="text">无人车购买</view>
							</view>
						</uni-grid-item>
						<uni-grid-item v-if="extend_info.user_info.tieqing_url">
							<view class="grid-item-box" @click="$api.navTo('/pages/article/article?id=2')">
								<view class="icon_list">
									<image src="/static/my/user.png" mode="aspectFit"></image>
								</view>
								<view class="text">用户协议</view>
							</view>
						</uni-grid-item>
						<uni-grid-item v-if="extend_info.user_info.tieqing_url">
							<view class="grid-item-box" @click="$api.navTo('/pages/article/article?id=1')">
								<view class="icon_list">
									<image src="/static/my/yinsi.png" mode="aspectFit"></image>
								</view>
								<view class="text">隐私政策</view>
							</view>
						</uni-grid-item>
						<uni-grid-item v-if="extend_info.user_info.tieqing_url">
							<view class="grid-item-box" @click="$api.navTo('/pages/article/article?id=6')">
								<view class="icon_list">
									<image src="/static/my/xiaofei.png" mode="aspectFit"></image>
								</view>
								<view class="text">消费须知</view>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<view class="id"
					style="display: flex; justify-content: center; align-items: center; margin-top: 40rpx; font-size: 28rpx; color: #ccc">
					<text style="" v-if="userInfo.user_id">用户ID：{{ userInfo.user_id }}</text>
				</view>
			</view>
		</view>
		<!-- <view class="cover-container" v-if="hasLogin">
			<view class="log-out-btn" @click="$api.navTo('/pages_other/user/switchAccount')">切换账号</view>
		</view> -->
		<!-- <view class="user_tips">
			<view>客服电话：xxxxxxxxx</view>
		</view> -->
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex';

	export default {
		components: {},
		data() {
			return {
				vipIcon:{
					1:'../../static/my/vip1.png',
					2:'../../static/my/vip2.png',
					3:'../../static/my/vip3.png',
					4:'../../static/my/vip4.png',
					5:'../../static/my/vip5.png'
				},
				createIcon:{
					1:'../../static/my/lian1.png',
					2:'../../static/my/lian2.png'
				},
				orderNum: {
					unpaid: 0,
					undelivered: 0,
					unreceived: 0,
					uncomment: 0,
					refund: 0
				},
				extend_info: {
					level: {
						rebate_level_name: '',
						duty_level_name: '',
						rebate_level: '',
					},
					user_info: {
						is_close_greenscore: 0
					},
					master_id: null,
					wallet: {
						contribute: '',
						contribute_2: '',
						contribute_welfare: '',
						contribute_welfare_2: '',
						epuity: '',
						epuity_2: '',
						epuity_welfare: '',
						epuity_welfare_2: ''
					}
				},
				isshow: false
			};
		},
		onLoad() {
			// this.determine()
		},
		onShow() {
			if (this.hasLogin) {
				this.getUserExtendInfo();
				this.getOrderNum();
				// #ifdef H5
				//this.getOpenid()
				// #endif
				// console.log('-----', this.userInfo);
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			// 判断用户创建时间
			determine() {
				var dateObj = new Date('2024-01-20T00:00:00');
				var timestamp = dateObj.getTime();
				const createTime = Number(this.userInfo.jointime + '000');
				// console.log('0000', createTime);
				if (createTime - timestamp > 0) {
					return true;
				}
			}
		},
		methods: {
			//跳转其他页面
			maskMobile(mobile) {
				return mobile.slice(0, 3) + '******' + mobile.slice(8);
			},
			openTieqing() {
				// if(!this.extend_info.user_info.tieqing_url){
				// 	return uni.showModal({
				// 		content:'请先登录',
				// 		success: (res) => {
				// 			if(res.confirm){
				// 				this.$api.navTo('/pages/public/login')
				// 			}
				// 		}
				// 	})
				// }
				const url = this.extend_info.user_info.tieqing_url
				//app时跳转到浏览器打开this.url
				//h5 时跳转到指定this.url页面
				// #ifdef H5
				// 在H5环境下执行的操作
				window.location.href = url;
				// #endif

				// #ifdef APP
				// 在APP或其他非H5环境下执行的操作
				plus.runtime.openURL(url).catch(() => {
					// 如果uni.openURL调用失败（例如在不支持直接打开URL的小程序中）
					uni.showToast({
						title: '无法直接打开链接，请手动复制并访问:',
						duration: 2000
					});
					uni.setClipboardData({
						data: url,
					});
				});
				// #endif
			},

			switchChange(e) {
				// console.log(e.detail.value);
				// this.extend_info.user_info.is_close_greenscore = !this.extend_info.user_info.is_close_greenscore
				// console.log(this.extend_info.user_info.is_close_greenscore);
				uni.showModal({
					content: `您将${this.extend_info.user_info.is_close_greenscore?'关闭':'开启'}购物券赠送!`,
					success: async (res) => {
						if (res.confirm) {
							this.extend_info.user_info.is_close_greenscore = !this.extend_info.user_info
								.is_close_greenscore
							const changeRes = await this.$api.request('/user/changeUserGreenscore',
								'post', {
									is_close_greenscore: +this.extend_info.user_info.is_close_greenscore
								});

						}
						if (!res.confirm) {
							console.log('取消');
						}

					}
				})

			},

			async getOpenid() {
				let data = await this.$api.request('/user/getUserOpenid');
				if (data.is_new_user == true) {
					location.href = data.url;
				}
			},
			//商家入住

			joinShop() {
				if (this.extend_info.level.rebate_level >= 3) {
					this.$api.navTo('/pages_other/user/shopjoin');
					return;
				}
				// this.$api.navTo('/pages_other/user/shopjoin');
				this.$api.msg('未达到申请条件', 2000, true);
			},

			// 获取订单数量
			async getOrderNum() {
				let data = await this.$api.request('/order/count');
				if (data) {
					this.orderNum = {
						unpaid: data.unpaid ? data.unpaid : 0,
						undelivered: data.undelivered ? data.undelivered : 0,
						unreceived: data.unreceived ? data.unreceived : 0,
						uncomment: data.uncomment ? data.uncomment : 0,
						refund: data.refund ? data.refund : 0
					};
				}
			},
			async getUserExtendInfo() {
				let e_info = await this.$api.request('/user/getUserExtendInfo');
				this.extend_info = e_info;
				console.log(this.extend_info);
				this.extend_info.wallet.contribute = Number(this.extend_info.wallet.contribute);
				this.extend_info.wallet.contribute_2 = Number(this.extend_info.wallet.contribute_2);
				this.extend_info.wallet.contribute_welfare = Number(this.extend_info.wallet.contribute_welfare);
				this.extend_info.wallet.contribute_welfare_2 = Number(this.extend_info.wallet.contribute_welfare_2);
				this.extend_info.wallet.epuity = Number(this.extend_info.wallet.epuity);
				this.extend_info.wallet.epuity_2 = Number(this.extend_info.wallet.epuity_2);
				this.extend_info.wallet.epuity_welfare = Number(this.extend_info.wallet.epuity_welfare);
				this.extend_info.wallet.epuity_welfare_2 = Number(this.extend_info.wallet.epuity_welfare_2);
			},
			turnQrcodePage() {
				if (this.extend_info.level.rebate_level == 0 && this.extend_info.level.nice_level == 0) {
					this.$api.msg('升级后获取分享海报');
				} else {
					this.$api.navTo('/pages_other/userinfo/qrcode');
				}
			},
			async removeMaster() {
				uni.showModal({
					content: '解除后，主账号将不再收到此账号的收益，但仍可以通过切换账号的方式登陆此账号',
					confirmText: '确定解除',
					success: async (e) => {
						if (e.confirm) {
							let data = await this.$api.request('/user/removeMaster');
						}
					}
				});
			},
			navto(e, data) {
				this.$api.navTo(`${e}&${data}`);
			}
		}
	};
</script>
<style lang="scss">
	page {
		background: #F2F4F7;
	}

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}

	.user-section {
		width: 750rpx;
		height: 404rpx;
		padding: 30upx;
		margin-bottom: 30rpx;
		position: relative;
		background: url('@/static/myBg.png') no-repeat center;
		background-size: contain;
		height: 474rpx;

		.user-top {
			color: white;
			padding: 2rpx 10rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;

		}
	}

	.user-info-box {
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;
		justify-content: space-between;

		.portrait-box {
			width: 130upx;

			.portrait {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
			}
		}

		.info-box {
			width: 65%;
			padding-left: 20upx;
			color: $font-color-white;

			.username {
				font-size: $font-lg;
				display: flex;
			}

			.userinfo {
				font-size: $font-lg;
			}
		}

		.qrcode {
			width: 15%;

			.top_erweima {
				color: #fff;
				font-size: 90upx;
			}
		}
	}

	.isClose_greenscore {
		display: flex;
		align-items: center;
		color: #fff;
		font-size: 26rpx;
		margin-left: 150rpx;

	}

	.vip-card-box {
		color: #f7d680;
		overflow: hidden;
		position: relative;
		padding: 16upx 0 0 0;
		font-size: $font-lg - 5upx;
		text-align: center;
	}

	.vip-card-box.grey {
		color: #878787;
	}

	.cover-container {
		padding: 0 30rpx;
		position: relative;
		background: #F2F4F7;
		/* padding-bottom: 20upx; */
	}

	.tj-sction {
		@extend %section;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}

		.num {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}

	.history-header {
		// @extend %section;
		padding: 0upx 0 20upx;
		border-bottom: 1px solid #fbf9f9;
		border-radius: 20rpx 20rpx 0 0;
		// margin-top: 20upx;
		font-size: 32rpx;
		font-weight: 500;

		.title {
			width: 50%;
			color: $font-color-dark;
			margin-left: 30rpx;
		}

	}

	.order-header {
		@extend %section;
		padding: 28upx 0 12upx;
		border-bottom: 1px solid #fbf9f9;
		border-radius: 20upx 20upx 0 0;
		margin-top: 20upx;
		font-size: $font-base;
		display: flex;
		justify-content: space-between;

		.title {
			color: $font-color-dark;
			margin-left: 30upx;
			font-size: $font-lg;
		}

		.item {
			color: $font-color-base;
			text-align: right;
			margin-right: 8upx;
			font-size: 24rpx;
			margin-right: 24rpx
		}
	}

	.order-section {
		@extend %section;
		border-radius: 0 0 20upx 20upx;
		padding: 24rpx 0;

		.order-item {
			@extend %flex-center;
			width: 25%;
			height: 120upx;
			border-radius: 10upx;
			font-weight: 400;
			font-size: 24rpx;
			color: #232323;
			line-height: 28rpx;
			position: relative;

			image {
				width: 72rpx;
				height: 72rpx;
			}


			.num {
				border: 2rpx solid #fa436a;
				width: 36rpx;
				height: 36rpx;
				line-height: 32rpx;
				color: #fff;
				text-align: center;
				border-radius: 40rpx;
				position: absolute;
				background: #FF2E00 ;
				right: 52rpx;
				top: 12rpx;
				font-size: 24rpx;
			}
		}

		.yticon {
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #3a3a3a;
		}

		.icon-shouhoutuikuan {
			font-size: 44upx;
		}
	}

	.history-section {
		padding: 20px 0;
		margin-top: 20rpx;
		background: #fff;
		border-radius: 16rpx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}

	.grid-item-box {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10px 0;

		.icon_list {
			.yticon {
				font-size: 70upx;
			}

			image {
				width: 72rpx;
				height: 72rpx;
			}
		}

		.text {
			font-size: $font-lg;
			font-size: 3;
			line-height: 70rpx;
			font-size: $font-base;
		}
	}

	.pin {
		margin-right: 12rpx;
		height: 42rpx;
		font-size: 20upx;
		color: #fff;
		display: flex;
		align-items: center;
		margin-top: 4rpx;
		image {
			width: 42rpx;
			height: 42rpx;
		}
		text{
			font-size: 24rpx;
		}
		
	}

	.pin.pin2 {
		background-image: linear-gradient(90deg, #d58e00, #edd18f);
	}

	.pin.pin3 {
		background-image: linear-gradient(90deg, #b17600, #d58e00);
	}

	.pin.pin4 {
		background-image: linear-gradient(90deg, #d58e00, #b17600);
	}

	.pin.pin5 {
		background-image: linear-gradient(90deg, #edd18f, #d58e00);
	}

	.user_tips {
		font-size: $font-base;
		font-color: $font-color-light;
		text-align: center;
		padding: 20upx;
	}

	.log-out-btn {
		margin-top: 20upx;
		color: $font-color-999;
		text-align: center;
		background-color: #fff;
		border-radius: 10upx;
		font-size: $font-lg;
		line-height: 3;
	}

	.order-section {
		flex-flow: row wrap;
	}

	.order-header {
		font-size: 32rpx;
	}
</style>