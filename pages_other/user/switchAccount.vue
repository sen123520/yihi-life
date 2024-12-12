<template>
	<view class="container">
		<view class="title">切换账号</view>
		<view class="small_title">可切换为同一手机号的账号</view>
		<view class="list">
			<view class="person_box" v-for="(item, index) in accounts" :key="index" @click="toLogin(item.id)">
				<div class="p_img">
					<image :src="item.avatar" mode="aspectFill"></image>
				</div>
				<div class="p_title">
					<view class="t1 clamp">账号：{{item.username}}</view>
					<view v-if="userInfo.id == item.id" class="nowaccount">当前登录</view>
				</div>
			</view>
		</view>

		<button class="add-btn" @click="register('register')">注册新的</button>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				accounts: []
			}
		},
		onLoad() {
			this.getAccount()
		},
		onShow() {

		},
		watch: {

		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {

			async getAccount() {
				let data = await this.$api.request('/user/getAllAccount');
				this.accounts = data
			},
			register(event) {
				uni.navigateTo({
					url: '/pages/public/register?event=' + event
				})
			},
			async toLogin(id) {
				if (id == this.userInfo.id) {
					return false;
				}
				return uni.showModal({
					mask: true,
					title: '请输入目标账号的密码',
					editable: true,
					content: '',
					placeholderText: '请输入密码',
					success: async (res) => {
						if (res.confirm && res.content) {
							console.log('GGGGG', res.content);
							let data = await this.$api.request('/user/loginById', 'POST', {
								user_id: id,
								password: res.content,
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

						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.container {
		padding: 20upx;
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
		content: "";
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
		padding: 0 10upx;
		margin-bottom: 30upx;

		.person_box {
			border-radius: 20upx;
			height: 150upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			background: #fff;
			padding: 20upx;
			margin-bottom: 20upx;

			.p_img {
				margin-top: 10upx;
				width: 90upx;

				image {
					width: 90upx;
					height: 90upx;
					border-radius: 50%;
					border: 2px solid #dddddd
				}
			}

			.p_title {
				//width:280upx;
				color: #333;
				font-size: $font-base;
				margin: 0 30upx;

				.t1 {
					line-height: 2;
				}
			}
		}
	}

	.nowaccount {
		background-color: $uni-color-success;
		color: #fff;
		width: 110upx;
		text-align: center;
		border-radius: 10upx;
		line-height: 2;
		font-size: 20upx;
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
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: $box_shadow;
	}
</style>