<template>
	<view class="article-info-box">
		<view class="article-info-title out-row-2">
			{{article.title}}
		</view>
		<view class="article-info-tips">
			<view class="time">
				发布时间：{{article.createtime}}
			</view>
		</view>

		<view class="video_box" v-if="article.video_file">
			<video :src="article.video_file"></video>
		</view>

		<view class="article-info-content">
			<!-- <rich-text :nodes="article.content"></rich-text> -->
			<u-parse :content="article.content" @preview="preview" @navigate="navigate"></u-parse>
		</view>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				// 编号
				id: '',
				// 详情
				article: {
					title: '',
					createtime: '',
					content: ''
				},
			};
		},
		onLoad(q) {
			this.id = q.id
			this.getarticleInfo()

		},
		onShow() {
			// setTimeout(() => {
			// 	uni.setNavigationBarTitle({
			// 		title: this.article.title
			// 	});	
			// }, 240);				
		},
		onReady() {

		},
		methods: {
			getarticleInfo() {

				let that = this;
				//获取首页banner
				uni.request({
					url: that.$unishow + '/article/getarticleById',
					data: {
						id: that.id
					},
					success(res) {
						that.article = res.data.data;
						uni.setNavigationBarTitle({
							title: that.article.title
						});
					}
				});

			},
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			}
		}
	}
</script>

<style lang="less">
	@import url("@/components/u-parse/u-parse.css");

	page {
		background-color: #FFF;
	}

	.article-info-box {
		.article-info-title {
			width: 690rpx;
			margin: 20rpx auto;
			font-size: 36rpx;
			font-weight: 900;
			padding: 20rpx 0;
			text-align: center;
		}

		.article-info-tips {
			width: 690rpx;
			margin: 20rpx auto 40rpx;
			background-color: #a8a8a8;
			line-height: 3;

			.type {
				font-size: 28rpx;
				color: #333;
				margin: 8rpx 0;
			}

			.time {
				font-size: 24rpx;
				color: #ffffff;
				margin: 8rpx 0;
				text-align: center;
			}
		}

		.video_box {
			text-align: center;
		}

		.article-info-content {
			width: 690rpx;
			margin: 30rpx auto;
			font-size: 30rpx;
			color: #2d2d2d;
		}

	}
</style>