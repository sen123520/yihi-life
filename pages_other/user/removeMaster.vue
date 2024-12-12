<template>
	<view class="main">
		<!-- <header class="header">
			<view class="header-right" @click="goback()">
				< 
			</view>
			<view class="header-center">
				解除从属关系
			</view>
			<view class="header-left">

			</view>
		</header> -->
		<view class="btn">
			<button type="primary" plain="true" @click="showmodals()">解除从属关系</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			showmodals(){
				uni.showModal({
					title: '提示',
					content: '确认解除从属关系吗？',
					success: (res) => {
						if (res.confirm) {
							this.removeMaster()
						} else if (res.cancel) {
							console.log('无事发生');
						}
					}
				});
			},
			// 解除从属关系
			async removeMaster(){
				try{
					const data = await this.$api.request('/user/copyAccountMaxNum', 'POST',{},true,10000)
					console.log(data);
				}catch(err){
					
				}finally{
					uni.showModal({
						title: '提示',
						content: '解除成功',
						success: (res) => {
							if (res.confirm) {

							} else if (res.cancel) {
								console.log('无事发生');
							}
						}
					});
				}
			},
			goback(){
				uni.switchTab({
					url:'/pages/user/user'
				});
			},
		}
	}
</script>

<style lang="scss">
.main {
	height: calc(100vh - 88rpx);
	background-color: #f8f8f8;
	padding-top: 2rpx;
		// header {
		// 	background-color: white;
		// 	display: flex;
		// 	justify-content: space-between;
		// 	align-items: center;
		// 	.header-right {
		// 		font-size: 56rpx;
		// 		font-weight: 400;
		// 		margin-left: 30rpx;
		// 	}
		
		// 	.header-center {
		// 		font-weight: 700;
		// 		font-size: 16px;
		// 		line-height: 30px;
		// 		text-align: center;
		// 		overflow: hidden;
		// 		white-space: nowrap;
		// 		text-overflow: ellipsis;
		// 	}
		
		// 	.header-left {
		// 		margin-left: 30rpx;
		// 		width: 40rpx;
		// 	}
		// }
	}
	.btn{
		padding: 0 40rpx;
		margin-top: 80rpx;
		button{
			border: 0;
			width: 50%;
			color: #fff;
			padding: 0 19px;
			margin: 0 auto;
			border-radius: 100px;
			height: 39px;
			line-height: 39px;
			font-size: 15px;
			background: #d34d68;
			box-shadow: 1px 2px 5px rgba(244, 67, 54, 0.4);
		}
	}
</style>
