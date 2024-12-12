<template>
	<view class="content">
		<view class="list-content">
			<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
				<!-- 空白页 -->
				<empty v-if="favorite.loaded === true && favorite.list.length === 0"></empty>

				<!-- 产品列表 -->
				<view v-for="(item, index) in favorite.list" :key="index" class="order-item">
					<view class="info" @click="navToDetailPage(item.product.product_id, item.status)">
						<view class="image">
							<image mode="aspectFill" :src="item.product.image"></image>
						</view>
						<view class="detail">
							<view class="title">{{item.product.title}}</view>
							<view class="price">
								<view class="sales">{{item.product.sales_price}} </view>
								<view class="market">{{item.product.market_price}}</view>
							</view>
							<view class="invalid" v-if="item.status == 0">失效</view>
							<text class="del-btn yticon icon-lajitong"
								@click.stop="deleteFavorite(item.product.product_id,index)"></text>
						</view>
					</view>
				</view>	
			</scroll-view>
		</view>
		<uni-load-more :status="favorite.loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";

	export default {
		components: {
			uniLoadMore,
			empty
		},
		computed: {},
		data() {
			return {
				favorite: {
					list: [],
					loadingType: 'more'
				},
				page: 1,
				pageSize: 20
			}
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.favorite = {};
			this.favorite.list = [];
			this.page = 1;
			this.loadData();
		},
		methods: {
			/**
			 * 获取收藏数据
			 */
			async loadData(source = false) {

				uni.stopPullDownRefresh();

				var favorite = this.favorite;

				if (favorite.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				if (favorite.loadingType == 'noMore') {
					//没有更多数据
					return;
				}

				favorite.loadingType = 'loading';

				let list = await this.$api.request('/product/favoriteList', 'GET', {
					page: this.page,
					pagesize: this.pageSize
				});
				if (list && list.length > 0) {
					if (list.length >= this.pageSize) {
						//判断是否还有数据， 有改为 more， 没有改为noMore
						favorite.loadingType = 'more';
					} else {
						favorite.loadingType = 'noMore';
					}
					// 页数加一
					this.page++;

					list.forEach((item, index) => {
						favorite.list.push(item);
					});

				} else {
					favorite.loadingType = 'noMore';
				}
			},
			// 商品详情页
			navToDetailPage(product_id, status) {
				if (status == 0) {
					this.$api.msg('此商品已失效');
					return;
				}
				uni.navigateTo({
					url: `/pages/product/product?id=${product_id}&flash=0`
				});
			},
			// 删除
			async deleteFavorite(id, index) {
				let data = await this.$api.request('/product/favorite?id=' + id);
				if (data) {
					this.favorite.list.splice(index, 1);
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F4F7;
		height: 100%;
	}

	.content {
		padding: 24rpx;
	}
	.list-content {
		border-radius: 16rpx;
		background-color: #fff;
		
	}
	.list-scroll-content {
		height: 100%;

	}

	.order-item {
	
		display: flex;
		flex-direction: column;
		padding-left: 20rpx;
		// background: #fff;

		.info {
			display: flex;
			flex-direction: row;
			padding-top: 20upx;
			padding-bottom: 20upx;

			.image {
				width: 138rpx;
				height: 138rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 16px;
				}
			}

			.detail {
				width: 540upx;
				height: 140upx;
				padding-left: 30upx;
				padding-top: 6upx;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title {
					font-size:28rpx;
					color: #303133;
					width: 370rpx;
					-webkit-line-clamp: 2;
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}

				.introduction {
					color: #999999;
					font-size: 26rpx;
				}

				.price {
					display: flex;
					font-size: 36rpx;
					flex-direction: row;
					margin-top: 20upx;

					.sales {
						font-size: 40upx;
						color: $base-color;
						font-weight: 500;
						&::before{
							content: '￥';
							font-size: 28rpx;
						}
					}

					.market {
						margin-left: 16upx;
						vertical-align: bottom;
						font-size: 25rpx;
						// text-decoration: line-through;
						color: rgba(153, 153, 153, 0.6);
						line-height: 60rpx;
						&::before{
							content: '￥';
							font-size: 22rpx;
							color: rgba(153, 153, 153, 0.6);
						}
					}
				}

				.ProgressBar {
					position: absolute;
					bottom: 0;
				}

				.loot {
					position: absolute;
					right: 0;
					bottom: 14rpx;
					background: $base-color;
					color: #fff;
					padding: 4upx 14upx;
					border-radius: 4upx;
					box-shadow: 2upx 2upx 8upx -2px #000;
					font-size: 32rpx;
				}

				.invalid {
					color: $base-color;
					position: absolute;
					right: 0;
					bottom: 0;
				}

				.yticon {
					position: absolute;
					right: 24rpx;
					top: 12rpx;
					font-size: 28rpx;
					color:  rgba(153, 153, 153, 0.6);
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>