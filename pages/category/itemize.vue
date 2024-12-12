<template>
	<view class="content">
		<view class="blank" :style="{ paddingTop:paddingTop +'rpx'} ">
			<view class="search">			
				<uni-icons class="input-uni-icon" type="search" :size="20" color="#999" />
				<input type="text" placeholder="输入关键词搜索" v-model="searchword" @confirm="search" />
			</view>
		</view>

		<view class="page-main">
			<view class="sr-aside">
				<view class="s-content">
					<view class="s-item" v-for="(item, index) in flist" :key="item.id"
						:class="{active: item.id === currentId}" @click="tabtap(item)">{{ item.name }}</view>
				</view>
			</view>
			<view class="top-sort">
				<view class="sort">
					<view class="sort-item" :class="{'sort-item-active':this.sortBy==='weigh'}" @click="changeSort(0)">
						综合排序
					</view>
					<view class="sort-item" :class="{'sort-item-active':this.sortBy==='sales'}" @click="changeSort(1)">
						销量优先
					</view>
					<view class="sort-item" :class="{'sort-item-active':this.sortBy==='sales_price'}"
						@click="changeSort(2)">
						价格
					</view>
				</view>
				<view class="other">
					<image src="../../static/other.png" mode="aspectFill"></image>
				</view>
			</view>
			<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll">
				<view class="guess-section">
					<view v-for="(item, index) in catGoodsList" :key="index" class="guess-item-info"
						@click="navToDetailPage(item)">
						<!-- <view class="cate_name"></view> -->
						<view class="image-wrapper">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="text-wrapper">
							<view class="title clamp">{{ item.title }}</view>
							<view class="bottom-text">
								<text class="text1">PV:{{item.pv_score}}</text>
								<text class="text2">贡献值:{{item.contribute}}</text>
							</view>

							<view class="price">
								<text class="symbol">￥</text>
								{{ item.sales_price }}
							</view>
						</view>
					</view>
				</view>
				<!-- 底部提示 -->
				<uni-load-more :status="status" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				childId: 0,
				flist: [],
				slist: [],
				catGoodsList: [],
				current_page: 1, //当前页码
				status: 'loading',
				throttleTimeout: '',
				scrollValue: '',
				clist: [],
				searchword: '',
				sortBy: 'weigh', //weigh-综合排序  sales-销量  sales_price价格
				paddingTop: 0,
			}
		},
		computed: {

		},
		onShareAppMessage(e) {

		},
		onLoad() {
			this.loadData('upper');
			const system = uni.getSystemInfoSync()
			console.log(system);
			this.paddingTop = system.safeArea.top
		},
		methods: {
			async changeSort(id) {
				let by
				switch (id) {
					case 0:
						by = 'weigh'
						break;
					case 1:
						by = 'sales'
						break;
					case 2:
						by = 'sales_price'
						break;
					default:
						by = ''
						break;
				}
				console.log(by);
				this.sortBy = by
				let goodsList = await this.$api.request('/product/lists', 'GET', {
					page: 1,
					fid: this.currentId,
					by: by
				});
				this.catGoodsList = goodsList
				console.log(goodsList);
			},
			search() {
				let t_url = '/pages/product/search?searchword=' + this.searchword;
				uni.navigateTo({
					url: t_url
				});
			},
			async toggleKinds(item) {
				this.childId = item.id;
				// this.sId = item.id;
				console.log(item.id);
				// let by = this.filterIndex == 0 ? 'weigh' : this.filterIndex == 1 ? 'sales' : 'sales_price';
				// let desc = 'desc';
				// if (this.filterIndex == 2) {
				//   desc = this.priceOrder === 1 ? 'desc' : 'asc';
				// }
				// const res = await this.$api.request('/product/lists', 'GET', { fid: this.fId, sid: this.sId, page: this.page, by: by, desc: desc });
				// console.log('----', res);
			},
			async loadData(type) {
				//this.status = 'loading';
				if (type === 'upper' || type === 'refresh') {
					this.current_page = 1;
				} else if (type === 'lower') {
					if (this.status != 'noMore') {
						this.current_page += 1;
					} else {
						return false;
					}
				}
				var that = this;
				if (type === 'upper') {
					let list = await this.$api.request('/category/all');
					// list.sort((a, b) => a.id - b.id)
					if (list) {
						uni.stopPullDownRefresh();
						list.forEach(item => {
							if (item.pid == 0) {
								if (that.currentId == 0) {
									that.currentId = item.id;
								}
								this.flist.push(item); //pid为父级id, 没有pid或者pid=0是一级分类
							} else {
								this.slist.push(item); //没有图的是2级分类
							}
						})
					}
				}
				if (that.status == 'more' || that.status == "loading") {
					let goodsList = await this.$api.request('/product/lists', 'GET', {
						page: that.current_page,
						fid: that.currentId
					});
					if (goodsList) {
						if (goodsList.length > 0) {
							goodsList.forEach(item => {
								that.catGoodsList.push(item);
							});
							// that.current_page++;
							that.status = 'more';
						} else {
							that.status = 'noMore';
						}
					} else {
						that.status = 'noMore';
					}
				}
				// let clist = await this.$api.request('/product/catelists', 'get', { fid: this.currentId });
				// this.clist = clist;
				// console.log(clist);
			},
			//一级分类点击
			tabtap(item) {
				// if(!this.sizeCalcState){
				// 	this.calcSize();
				// }

				// this.currentId = item.id;
				// let index = this.flist.findIndex(fitem=>fitem.id === item.id);
				// this.tabScrollTop = this.flist[index].top;

				if (this.currentId == item.id) {
					return false;
				} else {
					// console.log(item.id);
					if (item.id >= 2) {
						this.scrollValue = 92 * (item.id - 2)
					}
					this.currentId = item.id;
				}
				this.catGoodsList = [];
				this.status = 'loading';
				this.loadData('refresh');
			},
			//右侧栏滚动
			asideScroll(e) {
				this.throttleScroll()
				// this.loadData('lower');
				// if(!this.sizeCalcState){
				// 	this.calcSize();
				// }
				// let scrollTop = e.detail.scrollTop;
				// let tabs = this.flist.filter(item=>item.top <= scrollTop).reverse();
				// if(tabs.length > 0){
				// 	this.currentId = tabs[0].id;
				// }
			},
			// 节流
			throttleScroll() {
				if (!this.throttleTimeout) {
					this.loadData('lower');
					this.throttleTimeout = setTimeout(() => {
						this.throttleTimeout = null;
					}, 200);
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.flist.forEach(item => {
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(fid, sid) {
				uni.navigateTo({
					url: `/pages/product/list?fid=${fid}&sid=${sid}`
				});
			},
			//详情
			navToDetailPage(item) {
				uni.navigateTo({
					url: `/pages/product/product?id=${item.product_id}&category_id=${item.category_id}`
				});
			},
		}
	}
</script>

<style lang='scss' scoped>
	page,
	.content {
		height: 100%;
		background-color: #F2F4F7;
	}

	.content {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.blank {
		width: 100%;
		height: 140rpx;
		/* background-color: #F2F4F7; */
		display: flex;
		align-items: center;
		position: relative;
		
		/* #ifdef H5 */
			height: 120rpx;
		/* #endif */
	}

	.search {
		width: 690rpx;
		height: 68rpx;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 106rpx;
		display: flex;
		align-items: center;
		padding:  0 24rpx;
		font-size: 24rpx;
		input {
			width: 580rpx;
			margin-left: 12rpx;
			font-size: 24rpx;
		}
	}


	.page-main {
		display: flex;
		height: calc(100vh - 150rpx);
		justify-content: space-between;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		overflow: hidden;
		position: relative;
	}


	.top-sort {
		width: 586rpx;
		height: 56rpx;
		position: absolute;
		z-index: 999;
		top: 0rpx;
		left: 164rpx;
		background-color: #fff;
		border-radius: 0 16rpx 0 0;
		font-size: 24rpx;
		color: #323233;
		font-weight: 300;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.sort {
			display: flex;

			.sort-item {
				width: 140rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
			}

			.sort-item-active {
				color: #FF5040;
			}
		}

		.other {
			width: 24rpx;
			height: 24rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.right-aside {
		width: 586rpx;
		overflow: hidden;
		margin-top: 56rpx;
		background-color: #fff;

		.guess-item {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 48%;
			margin: 2% 1%;
			padding: 20upx;
			background-color: #fff;
			border-radius: 14rpx;
			z-index: 98;
		}
	}

	.sr-aside {
		width: 164rpx;
		/* height: 81rpx; */
		position: relative;
		.s-content {
			/* height: 810rpx; */
			width: 164rpx;
			text-align: center;
			/* position: fixed; */
			background: #FFF;
			border-radius: 16rpx 0 0 0;

			.s-item {
				font-size: 28rpx;
				color: #323233;
				height: 90rpx;
				line-height: 90rpx;
				position: relative;

				&.active {
					color: $base-color;

					&:before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						height: 36upx;
						width: 8upx;
						background-color: $base-color;
						border-radius: 0 4px 4px 0;
						opacity: 0.8;
					}
				}
			}
		}

	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}

	.product_item {
		padding: 20rpx;
		margin: 10rpx;
		display: flex;
		justify-content: space-around;
		position: relative;
		background-color: #fff;
		border-radius: 20rpx;

		.product_image {
			width: 40%;
			height: 200rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}

		.product_detail {
			width: 60%;
			padding-left: 20rpx;

			.title {
				font-size: $font-xlg;
				color: $font-color-dark;
				line-height: 50upx;
			}

			.share_desc {
				font-size: $font-sm;
				color: $font-color-light;
				line-height: 50upx;
			}

			.price {
				font-size: $font-xlg;
				line-height: 60upx;
				color: $uni-color-primary;
				line-height: 1;

				.symbol {
					font-size: 24upx;
				}
			}
		}
	}




	.guess-section {
		position: relative;
		padding: 0rpx 24rpx 40rpx 24rpx;

		.guess-item-info {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 138rpx;
			margin-top: 24rpx;
			padding: 4rpx;
			background-color: #fff;
			border-radius: 20rpx;
			z-index: 98;

		}

		.partition {
			color: white;
			width: 60rpx;
			font-size: 20rpx;
			padding: 4rpx;
			background-color: red;
			border-radius: 6rpx;
			margin-right: 10rpx;
			line-height: 16rpx;
		}

		.image-wrapper {
			width: 138rpx;
			height: 138rpx;
			overflow: hidden;
			border-radius: 16rpx;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.text-wrapper {
			width: 364rpx;
			height: 138rpx;
			/* border: #333 solid 1rpx; */
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		}

		.title {

			font-size: 28rpx;
			color: #323233;
			font-weight: 600;
			overflow: hidden;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
		}

		.shop_tag {
			width: 50%;
			background-image: url('/static/small_1.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			color: red;
			font-size: 24rpx;
			padding: 8rpx;
			text-align: center;
		}

		.market_price {
			margin-left: 6rpx;
			font-size: 20rpx;
			text-decoration: line-through;
			color: #cecece;
		}

		.bottom-text {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			line-height: 24rpx;

			text {
				color: #323233;
				font-weight: 300;
				display: flex;
				justify-content: flex-start;
				margin-right: 2rpx;
				padding: 4rpx 0rpx 4rpx 6rpx;
				white-space: nowrap;
			}

			.text1 {
				width: 45%;
			}

			.text2 {
				width: 55%;
			}
		}

		.price {
			font-size: 36rpx;
			color: #FF5040;
			line-height: 1;

			.symbol {
				font-size: 24rpx;
			}
		}
	}
</style>