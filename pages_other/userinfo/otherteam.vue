<template>
	<view>

		<view class="list">
			
			<view class="person_box" v-for="(item, index) in team_list" :key="index" @click="$api.navTo('/pages_other/userinfo/otherteam?other_id='+item.user.id)">
				
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
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	export default {
		data() {
			return {
				extend_info:{
					level:{
						rebate_level_name:'',
						duty_level_name:'',
						rebate_level:''
					},
					wallet:{
						real_money:0,
						cloud_money:0
					}
				},
				mobile: '',
				down_num:0,
				team_list:[],
				page:1,
				pagesize:20,
				goOnLoad: true,
				other_id:0
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(q) {
			this.other_id=q.other_id
			this.loadData();
		},
		//加载更多
		onReachBottom(){
			this.loadData()
		},
		methods: {
			async loadData() {

				if (!this.goOnLoad) return; //已全部加载完成
				let team_list_data = await this.$api.request("/user/getOtherTeam","post",{other_id:this.other_id});

				if(team_list_data){

					this.team_list = this.team_list.concat(team_list_data);
					if(team_list_data.length < this.pagesize){
						this.goOnLoad = false;
						//this.$api.msg('没有更多数据');
					}else{
						this.page++;
					}
				}
			},
			
			async submit() {
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}
	.list{
		padding:20upx 10upx 0;
		
		.person_box{
			border-radius: 80upx;
			height:170upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			background: #fff;
			padding:20upx;
			margin-bottom:20upx;
			.p_img{
				margin-top:10upx;
				width:110upx;
				image{
					width: 110upx;
					height: 110upx;
					border-radius: 50%;
				}
			}
			.p_title{
				width:270upx;
				color:#333;
				font-size:$font-base;
				margin:0 30upx;
			}
			.p_level{
				
				color:#333;
				font-size:$font-sm;
				margin:0upx 10upx ;
				text-align: center;
			}
		}		
	}

	
	

	.pin{
		background-image: linear-gradient(90deg, #fbae12, #edd18f);
		border-radius: 30upx;
		line-height: 40upx;
		height:40upx;
		font-size:26upx;
		padding:0 16upx;
		color:#fff;
		.iconfont{
			margin-right:7upx;
		}
	}
</style>
