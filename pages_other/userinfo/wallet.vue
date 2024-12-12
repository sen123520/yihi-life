<template>
	<view class="container">
		<!-- <view class="topbar"> -->
			<uni-nav-bar left-icon="left" right-icon="home" title="钱包" @clickLeft="left" @clickRight="right" :border="false" :shadow="true" :fixed="true" :statusBar="true"/>
		<!-- </view> -->
		<view class="smallbox onetop"
			@click="navto('/pages_other/userinfo/wallet_log?type=real_money&name=余额',`&value=${extend_info.wallet.real_money}`)"
			style="background-image: url('/static/wallet/3wallet2.png');">
			<view class="smallbox-left">
				<text>余额：</text><text>{{extend_info.wallet.real_money}}</text>
			</view>
			<view class="smallbox-right">
				<view>

				</view>
				<button class="bottom"
					@click.stop="navto('/pages_other/userinfo/transfermoney?type=real_money&name=余额',`&value=${extend_info.wallet.real_money}`)">转账</button>
			</view>
		</view>
		<view class="smallbox"
			@click="navto('/pages_other/userinfo/wallet_log?type=been&name=奖励积分',`&value=${extend_info.wallet.been}`)"
			style="background-image: url('/static/wallet/3wallet2.png');">
			<view class="smallbox-left">
				<text>奖励积分：</text><text>{{extend_info.wallet.been}}</text>
			</view>
			<view class="smallbox-right">
				<view>

				</view>
				<button class="bottom"
					@click.stop="navto('/pages_other/userinfo/transfermoney?type=been&name=奖励积分',`&value=${extend_info.wallet.been}`)">转账</button>
			</view>
		</view>
		<view class="smallbox"
			@click="navto('/pages_other/userinfo/wallet_log?type=been_benefit&name=消费奖励积分',`&value=${extend_info.wallet.been_benefit}`)"
			style="background-image: url('/static/wallet/3wallet2.png');">
			<view class="smallbox-left">
				<text>消费奖励积分：</text><text>{{extend_info.wallet.been_benefit}}</text>
			</view>
			<view class="smallbox-right">
				<button class="top"
					@click.stop="navto('/pages_other/userinfo/changeBeen?type=been_benefit&name=消费奖励积分',`&value=${extend_info.wallet.been_benefit}&exchange_ratio=${exchange_ratio.been_benefit_ratio}`)"
					v-if="exchange_ratio.been_benefit_ratio != 0">兑换</button>
				<view v-if="exchange_ratio.been_benefit_ratio == 0">

				</view>
				<button class="bottom"
					@click.stop="navto('/pages_other/userinfo/transfermoney?type=been_benefit&name=消费奖励积分',`&value=${extend_info.wallet.been_benefit}`)">转账</button>
			</view>
		</view>
		<view class="smallbox"
			@click="navto('/pages_other/userinfo/wallet_log?type=greenscore&name=购物券',`&value=${extend_info.wallet.greenscore}`)"
			style="background-image: url('/static/wallet/3wallet2.png');">
			<view class="smallbox-left">
				<text>购物券：</text><text>{{extend_info.wallet.greenscore}}</text>
			</view>
			<view class="smallbox-right">
				<button class="top"
					@click.stop="navto('/pages_other/userinfo/changeBeen?type=greenscore&name=购物券',`&value=${extend_info.wallet.greenscore}&exchange_ratio=${exchange_ratio.greenscore_ratio}`)"
					v-if="exchange_ratio.greenscore_ratio != 0">兑换</button>
				<view v-if="exchange_ratio.greenscore_ratio == 0">

				</view>
				<button class="bottom"
					@click.stop="navto('/pages_other/userinfo/transfermoney?type=greenscore&name=购物券',`&value=${extend_info.wallet.greenscore}`)">转账</button>
			</view>
		</view>
		<view class="smallbox"
			@click="navto('/pages_other/userinfo/wallet_log?type=greenscore_benefit&name=福利购物券'),`&value=${extend_info.wallet.greenscore_benefit}`"
			style="background-image: url('/static/wallet/3wallet2.png');">
			<view class="smallbox-left">
				<text>福利购物券：</text><text>{{extend_info.wallet.greenscore_benefit}}</text>
			</view>
			<view class="smallbox-right">
				<button class="top"
					@click.stop="navto('/pages_other/userinfo/changeBeen?type=greenscore_benefit&name=福利购物券'),`&value=${extend_info.wallet.greenscore_benefit}&exchange_ratio=${exchange_ratio.greenscore_benefit_ratio}`"
					v-if="exchange_ratio.greenscore_benefit_ratio != 0">兑换</button>
				<view v-if="exchange_ratio.greenscore_benefit_ratio == 0">

				</view>
				<button class="bottom"
					@click.stop="navto('/pages_other/userinfo/transfermoney?type=greenscore_benefit&name=福利购物券',`&value=${extend_info.wallet.greenscore_benefit}`)">转账</button>
			</view>
		</view>
		<view class="smallbox"
			@click="navto('/pages_other/userinfo/wallet_log?type=rebuyscore&name=复消积分'),`&value=${extend_info.wallet.rebuyscore}`"
			style="background-image: url('/static/wallet/3wallet2.png');">
			<view class="smallbox-left">
				<text>复消积分：</text><text>{{extend_info.wallet.rebuyscore}}</text>
			</view>
			<view class="smallbox-right">
				<view>
		
				</view>
				<button class="bottom"
					@click.stop="navto('/pages_other/userinfo/transfermoney?type=rebuyscore&name=复消积分',`&value=${extend_info.wallet.rebuyscore}`)">转账</button>
			</view>
		</view>
		<!-- <text class="topbar" >返回个人中心</text> -->
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	export default {
		data() {
			return {
				extend_info: {
					wallet: {
						real_money: '',
						been: '',
						been_benefit: '',
						greenscore: '',
						greenscore_benefit: '',
					}
				},
				exchange_ratio: {}
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.loadData();
			this.getExchangeRatio()
		},
		//加载更多
		onReachBottom() {},
		methods: {
			async loadData() {
				let e_info = await this.$api.request("/user/getUserExtendInfo");
				this.extend_info = e_info
			},
			navto(e, data) {
				this.$api.navTo(`${e}&${data}`)
			},
			navto2(e, data) {
				this.$api.navTo(`${e}&${data}`)
			},
			// 获取兑换比例
			async getExchangeRatio() {
				try {
					const data = await this.$api.request('/user/getExchangeRatio', 'POST')
					this.exchange_ratio = data
				} catch (err) {
					console.log(err);
				}
			},
			left(e){
				uni.switchTab({
					url: '/pages/user/user'
				});
			},
			right(){
				uni.switchTab({
					url: '/pages/user/user'
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		// padding: 30upx 0 60upx;
		// position: relative;
	}

	.smallbox {
		margin: 20upx 20upx;
		padding: 40rpx;
		display: flex;
		justify-content: space-between;
		height: 214rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: black;

		.smallbox-left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 40rpx;
		}

		.smallbox-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 24rpx;

			.top {
				font-size: 28rpx;
				// margin-top: 80rpx;
				color: #5a5a5a;
				background-color: white;
				width: 86rpx;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0;
			}

			.bottom {
				color: #5a5a5a;
				font-size: 28rpx;
				width: 86rpx;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0;
				background-color: white;
			}
		}
	}
	.topbar{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
		::v-deep .uni-navbar--border{
			border-bottom-style: none;
		}
		// ::v-deep .uni-icons{
		// 	font-size: 60rpx;
		// }
	}
</style>