<template>
	<view class="content">

		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>


		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">

					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.team_list.length === 0"></empty>
					
					<view class="list">
<!-- 						<view class="person_box" v-for="(item, index) in tabItem.team_list" :key="index"  @click="$api.navTo('/pages_other/userinfo/otherteam?other_id='+item.user.id)"> -->
						<view class="person_box" v-for="(item, index) in tabItem.team_list" :key="index">	
							<div class="p_img">
								<image :src="item.user.avatar" mode="aspectFill"></image>
							</div>
							<div class="p_title">
								<view class="clamp">账号:{{item.user.username}}</view><view>手机号:{{item.user.mobile}}</view>
							</div>
							<div class="p_level">
								<view class="pin"><text class="iconfont level_icon">&#xe636;</text>{{item.level.rebate_level_text}}</view>
								<view class="pin" v-if="item.level.sgroup_level>0"><text class="iconfont level_icon">&#xe636;</text>{{item.level.sgroup_level_text}}</view>
								<view>
									{{item.updatetime_text}}
								</view>
							</div>
						</view>
					</view>
			
				</scroll-view>
			</swiper-item>
		</swiper>

		
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				extend_info:{
					level:{
						rebate_level_name:'',
						duty_level_name:'',
						rebate_level:''
					},
					wallet:{
						green_score:0,
						rebuy_score:0,
						dragon_score:0
					}
				},
				mobile: '',
				down_num:0,
				team_list:[],
				//page:1,
				pageSize:20,
				goOnLoad: true,
				
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '直推账号',
						loadingType: 'more',
						team_list: [],
						page: 1
					},
					{
						state: 1,
						text: '接点会员',
						loadingType: 'more',
						team_list: [],
						page: 1
					}
				],
				
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.loadData();
		},
		//加载更多
		onReachBottom(){
			this.loadData()
		},
		methods: {
			// async loadData() {
			// 	if (!this.goOnLoad) return; //已全部加载完成
			// 	let team_list_data = await this.$api.request("/user/getMyTeam");
			// 	if(team_list_data){
			// 		this.team_list = this.team_list.concat(team_list_data);
			// 		if(team_list_data.length < this.pagesize){
			// 			this.goOnLoad = false;
			// 			//this.$api.msg('没有更多数据');
			// 		}else{
			// 			this.page++;
			// 		}
			// 	}
			// },


			async loadData(source) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;

				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				if (navItem.loadingType == 'noMore') {
					//没有更多数据
					return;
				}

				navItem.loadingType = 'loading';

				let result = await this.$api.request('/user/getMyTeam', 'POST', {
					state: state,
					page: navItem.page,
					pagesize: this.pageSize
				});
				uni.stopPullDownRefresh();
				if (!result) {
					navItem.loadingType = 'more';
				} else {
					//console.log(result)
					if (result.length >= this.pageSize) {
						//判断是否还有数据， 有改为 more， 没有改为noMore
						navItem.loadingType = 'more';
					} else {
						navItem.loadingType = 'noMore';
					}
					// 页数加一
					navItem.page++;
					result.forEach(item => {
						navItem.team_list.push(item);
					});
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
				}
					console.log(this.navList[index])
			},

			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},




		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: d5d5d5;
		height: 100%;
	}
	
	.swiper-box {
		height: calc(100% - 40px);
		background-color: #f8f8f8;
	}
	
	.list-scroll-content {
		height: 100%;
	}
	
	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;
	
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
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
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
	
	.uni-swiper-item {
		height: auto;
	}
	
	
	
	.list{
		padding:0 30upx 60upx;
		margin:40upx 0;
		.person_box{
			border-radius: 14upx;
			height:150upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			background: #fff;
			padding:20upx;
			margin-bottom:20upx;
			box-shadow: 2px 2px 2px #ccc;
			.p_img{
				margin-top:10upx;
				width:90upx;
				image{
					width: 90upx;
					height: 90upx;
					border-radius: 50%;
					border:2px solid #fff;
				}
			}
			.p_title{
				width:280upx;
				color:#333;
				font-size:$font-base;
				margin:0 30upx;
			}
			.p_level{
				
				color:#333;
				font-size:$font-base;
				margin:0upx 30upx ;
				text-align: center;
			}
		}		
	}

	

	.pin{
		margin:4upx 0;
		background-image: linear-gradient(90deg, #fbae12, #edd18f);
		border-radius: 30upx;
		line-height: 40upx;
		height:40upx;
		font-size:22upx;
		padding:0 16upx;
		color:#fff;
		.iconfont{
			margin-right:7upx;
		}
	}
</style>
