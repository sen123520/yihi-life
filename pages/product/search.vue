<template>
	<view class="content">
		<view class="navbar">
			<view class="top-view top_nav_bg">
				<view class="thestatus-bar"></view>
				<view class="search-view">
					<view class="search">
						<view class="iconfont" @click="search()">&#xe60a;</view>
						<input class="input" type="text" v-model="searchword" placeholder="输入产品标题"
							@confirm="search()" />
					</view>
				</view>
			</view>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.image" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<view class="price-box">
					<text class="price">{{item.sales_price}}</text>
					<text> 已售{{item.sales}}件</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				goodsList: [],
				page: 1,
				searchword: ''
			};
		},
		computed: {

		},
		onLoad(options) {
			// #ifdef H5
			// this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.searchword = options.searchword;
			this.loadData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}

				let by = this.filterIndex == 0 ? 'weigh' : (this.filterIndex == 1 ? 'sales' : 'sales_price');
				let desc = 'desc';
				if (this.filterIndex == 2) {
					desc = this.priceOrder === 1 ? 'desc' : 'asc';
				}

				if (type === 'refresh') {
					this.goodsList = [];
					this.page = 1;
				}

				let goodsList = await this.$api.request('/product/lists', 'GET', {
					searchword: this.searchword,
					page: this.page,
					by: by,
					desc: desc
				});
				uni.stopPullDownRefresh();
				if (!goodsList) {
					this.loadingType = 'nomore';
					return;
				}

				this.goodsList = this.goodsList.concat(goodsList);
				console.log(goodsList);
				//判断是否还有下一页，有是more  没有是nomore
				this.loadingType = goodsList.length > 20 ? 'nomore' : 'more';
				if (goodsList.length < 20) {
					this.loadingType = 'nomore';
				} else {
					this.loadingType = 'more';
					this.page++;
				}

				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading()
					} else {
						uni.stopPullDownRefresh();
					}
				}
			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			navToDetailPage(item) {
				uni.navigateTo({
					url: `/pages/product/product?id=${item.product_id}`
				});
			},
			stopPrevent() {},
			search() {
				this.loadData('refresh');
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: #f2f2f2;
	}

	.content {

		padding-top: 124rpx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 100upx;

		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 28upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 24rpx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}





	.top-view {
		width: 100%;
		//background:  $uni-color-primary;
		background: #f2f4f7;
		z-index: 10;

		.thestatus-bar {
			width: 100%;
			/* #ifdef APP-PLUS */
			// height: var(--status-bar-height);
			/* #endif */
		}

		.search-view {
			position: relative;
			width: 100%;
			padding: 20upx 26upx 20upx 26upx;
			box-sizing: border-box;
			display: flex;
			font-size: 24rpx;
			background-color: #f2f4f7;

			.search {
				flex: 1;
				height: 60upx;
				background-color: rgba(255, 255, 255, 0.5);
				border-radius: 106rpx;
				box-sizing: border-box;
				border: 1rpx solid #FF2A00 ;
				color: rgba(50,50,51,0.6);
				position: relative;
				line-height: 56upx;
				padding: 0 0 0 24upx;
				
				.input {
					line-height: 56upx;
					height: 56upx;
					border: none;
					margin-left: 40rpx;
				}

				.iconfont {
					position: absolute;
					top: 0;
					color: #333;
					left: 0rpx;
					height: 60upx;
					width: 50upx;
					line-height: 56upx;
					font-size: 28upx;
					font-weight: bold;
					text-align: right;
				}
			}
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: center;
		padding: 24rpx;
		// padding: 30rpx;
		background: #fff;
		border-radius: 16rpx;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 49%;
			padding: 15rpx 10rpx;
			background-color: #fff;
			margin-bottom: 20rpx;
			border-radius: 16rpx;

			&:nth-child(2n+1) {
				margin-right: 2%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330rpx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 24rpx;
			}
		}
	}
</style>