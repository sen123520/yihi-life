<template>
	<view class="main">
		<view class="tab-list">

			<view class="tab-list-item" v-for="(item, index) in theList" :key="index">
				<view class="tab-list-item-text">
					{{ item.describe }}

				</view>
				<view class="tab-list-item-price">

					<view class="tab-list-item-text-time">{{ item.createtime_text }}</view>
					<view class="">
						+{{ parseFloat(item.score) }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//列表数据
				theList: [],
				page_no: 1,
				page_num: 20,
				//是否继续请求数据，如false，则说明数据都已加载完毕
				goOnLoad: true,
				current: 'greenscore',
				name: {},
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			async getData(pageCurrent, value = '') {
				try {
					const data = await this.$api.request('/user/transferMoneyLog', 'POST', {
						pageno: '1',
						pagenum: '15',
					})
					console.log(data);
					this.theList = data
				} catch (err) {
					console.log(err);
				}
			},

		}
	}
</script>

<style lang="scss">
	.main{
		height: calc(100vh - 88rpx);
		background-color: #f8f8f8;
		padding: 20rpx;
	}
	.list-total {
		color: white;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px 26px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		background-image: url('../../image/topbgimg.jpg');
		background-size: 100% 140%;
		background-repeat: no-repeat;

		text {
			margin-top: 10rpx;
		}
	}

	.tab-list {
		margin: 0 30upx;
		// border:1px solid #e3e3e3;
		border-bottom: none;

		.tab-list-item {
			padding: 20upx 20upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			border-bottom: 1px solid #f4f4f4;
			background-color: #fff;
			border-radius: 10px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			margin: 20rpx 0;

			.tab-list-item-text {
				// width: 510upx;
				line-height: 1.4em;
				color: #333;
				font-size: 28rpx;


			}

			.tab-list-item-text-time {
				font-size: 22upx;
				color: #999999;
				line-height: 40rpx;
			}

			.tab-list-item-price {
				// width: 200upx;
				text-align: right;
				font-size: 32upx;
				font-weight: bold;
				display: flex;
				// flex-direction: column;
				justify-content: space-between;
				color: #ff4e4e;
				margin-top: 20rpx;

				.state1 {
					font-weight: normal;
					color: #ff512b;
					font-size: 24upx;
				}

				.state2 {
					font-weight: normal;
					color: #00B26A;
					font-size: 24upx;
				}

				.state3 {
					font-weight: normal;
					color: #007AFF;
					font-size: 24upx;
				}

				.state4 {
					font-weight: normal;
					color: #888;
					font-size: 24upx;
				}

				.state5 {
					font-weight: normal;
					color: #ff512b;
					font-size: 24upx;
				}
			}
		}
	}
</style>