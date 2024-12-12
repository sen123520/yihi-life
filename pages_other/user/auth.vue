<template>
	<view>
		
	</view>
</template>
<script>
	import {
	    mapState 
	} from 'vuex';  
	export default {
		data() {
			return {

			};
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		onLoad(option) {
				this.toLogin()
		},
		methods: {
			async toLogin(){
				let local = window.location.href; // 获取页面url
				let code = this.getUrlCode().code; // 截取code
				// 如果没有code，就去请求获取code
				if (code == null || code === '' || code == 'undefined') {
					let uri = encodeURIComponent(local); 
					let appid = "wxae22794045f9fad1";
					let user_id = this.userInfo.id;
					window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&state=${user_id}#wechat_redirect`
				} else {
					let uid = this.getUrlCode().state; // 截取state
					let data = await this.$api.request('/user/weixinOauth2', 'POST', {
						code: code,
						state:uid
					});
					if (data== "ok") {
						uni.switchTab({
						    url: '/pages/user/user'
						});
					}else{
						alert('登录失败');
					}
				}
			},
			getUrlCode() {
				// 截取url中的code方法
				var url = location.search;
				// this.winUrl = url;
				var theRequest = new Object();
				if (url.indexOf('?') != -1) {
					var str = url.substr(1);
					var strs = str.split('&');
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
					}
				}
				return theRequest;
			}
		}
	};
</script>

<style>

</style>
