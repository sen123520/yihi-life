import Vue from 'vue';
import store from './store';
import App from './App';
import {
	Encrypt
} from '@/utils/rsa'
import {
	aesEncrypt,
	aesDecrypt
} from '@/utils/aes'

//测试环境
// if(process.env.NODE_ENV === 'development'){
Vue.prototype.$unishow = 'https://manage.shouchuangtx.cn.cn/addons/unishop';
// Vue.prototype.$unishow = 'http://yihai.shouchuangtx.cn/addons/unishop';
Vue.prototype.$serverUrl = 'http://yihai.shouchuangtx.cn';
Vue.prototype.$ossUrl = 'https://imageoss.qicaihemei34.com';
// 秒杀接口
Vue.prototype.$seckill = 'http://seckill.shouchuangtx.cn';
Vue.prototype.$youyi99 = 'https://api.youyi99.cn';
Vue.prototype.$payweixin = 'https://manage.shouchuangtx.cn';
// }


//正式环境
// else{
// Vue.prototype.$unishow = 'https://manage.ybbio.cn/addons/unishop';
// Vue.prototype.$serverUrl = 'https://manage.ybbio.cn';
// Vue.prototype.$ossUrl = 'https://imageoss.qicaihemei34.com';
// }
// Vue.prototype.$unishow = 'https://manage.yibaozg.com/addons/unishop';

// 平台号
// #ifdef APP-PLUS
Vue.prototype.$platform = 'APP-PLUS';
// #endif
// #ifdef H5
Vue.prototype.$platform = 'H5';
// #endif
// #ifdef MP-WEIXIN
Vue.prototype.$platform = 'MP-WEIXIN';
// #endif
// #ifdef MP-ALIPAY
Vue.prototype.$platform = 'MP-ALIPAY';
// #endif
// #ifdef MP-BAIDU
Vue.prototype.$platform = 'MP-BAIDU';
// #endif
// #ifdef MP-TOUTIAO
Vue.prototype.$platform = 'MP-TOUTIAO';
// #endif



Vue.prototype.$appJumpMiniPro = function(url) {
	// 获取分享服务列表
	plus.share.getServices(
		res => {
			let sweixin = '';
			for (var i = 0; i < res.length; i++) {
				let t = res[i];
				console.log(`output->t`,t)
				if (t.id == 'weixin') {
					sweixin = t;
				}
			}
			if (sweixin) {
				sweixin.launchMiniProgram({
						id: 'gh_f5608d2b7dcb', // 要跳转小程序的原始ID
						path: url, //  可带参数
						type: 0 // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
					},
					// 目标小程序点击返回App后执行的回调，在此接收微信小程序传递的参数
					res2 => {
						console.log(typeof res2, res2)
						// res2是微信小程序传递回来的参数 类型为string 需转化为js对象使用
						let result = JSON.parse(res2)
						console.log(result, '微信操作res3...')
						// 拿到参数后执行你需要的逻辑
					},
					err2 => {
						console.log(err2)
						console.log(err2, '微信操作err2...')
					}
				);
			} else {
				// 没有获取到微信分享服务
				uni.showToast({
					icon: 'none',
					title: '当前环境不支持微信操作!'
				})
			}
		},
		err => {
			// 获取分享服务列表失败
			console.log(err)
		}
	)
}

// 提示
const msg = (title, duration = 5000, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
	setTimeout(function() {
		uni.hideToast();
	}, duration);
};

// 返回上一页
const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	console.log(prePage);
	return prePage.$vm;
};

// 检查有没有登录
const checkLogin = () => {
	return new Promise((resolve) => {
		if (Vue.prototype.$store.state.hasLogin == false) {
			uni.showModal({
				title: '温馨提示',
				content: '你还没，请先登录',
				success(res) {
					if (res.confirm) {
						// 账户秘密登录
						let url = '/pages/public/login';
						uni.navigateTo({
							url: url
						});
					}
					resolve(false);
				}
			});
		} else {
			resolve(true);
		}
	});
};

// 深拷贝
const deepCopy = (p, c) => {
	var c = c || {};
	for (var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = p[i].constructor === Array ? [] : {};
			deepCopy(p[i], c[i]);
		} else {
			c[i] = p[i];
		}
	}
	return c;
};


const generateRandomString = () => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < 16; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

// 同步网络请求
const request = async (url, method = 'GET', data = {}, showMsg = true, timeout = 5000) => {
	let header = {
		'content-type': 'application/x-www-form-urlencoded',
		lang: Vue.prototype.$store.state.lang,
		platform: Vue.prototype.$platform
	};
	if (Vue.prototype.$store.state.userInfo.token) {
		header.token = Vue.prototype.$store.state.userInfo.token;
	}
	let _time = new Date().getTime().toString().slice(0, 10)
	const _random = generateRandomString()
	const SecretKey = aesEncrypt((_random + _time + (header.token || '')), _random)
	header.SecretKey = SecretKey + _random
	// header.SecretKeys = aesDecrypt(SecretKey, _random)
	// header.SecretKeyss = _random + _time + (header.token || '')
	if (Vue.prototype.$store.state.cookie) {
		header.cookie = Vue.prototype.$store.state.cookie;
	}

	return new Promise((resolve, reject) => {
		let _url = ''
		if (url === '/flash/order') {
			_url = Vue.prototype.$seckill + url
			// header.AuthCode = Encrypt(Vue.prototype.$store.state.userInfo.user_id)
			header.AuthCode = Vue.prototype.$store.state.userInfo.user_id
			// header.AuthCode = Encrypt('18836')
			// header.token = 'eaee304788651c015fd559562674bd84f729ab13'
		} else if (url === '/api-yihai') {
			_url = Vue.prototype.$youyi99 + url
			// header['content-type'] = 'json'
		} else {
			_url = Vue.prototype.$unishow + url
		}
		// console.log(header, _url)
		uni.request({
			url: _url,
			method: method,
			header: header,
			data: data,
			timeout: timeout,
			success: (res) => {
				if (res.header.hasOwnProperty('Set-Cookie')) {
					let cookie = res.header['Set-Cookie'].replace('; path=/', '')
					Vue.prototype.$store.commit('setCookie', cookie)
				}
				if (res.data) {
					//未登录或者登录失效
					if (res.data.code === 401) {
						Vue.prototype.$store.commit('logout')
					}
					//获取成功
					if (res.data.code === 1) {
						showMsg && msg(res.data.msg)
						resolve(res.data.data)
					} else {

						showMsg && msg(res.data.msg || '参数错误')
						reject(res.data.msg)
					}
				} else {

					showMsg && msg('不能识别数据')
					reject(res.data.msg)
				}
				// resolve(res)
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => {
				// console.log('完成');
			}
		})
	})
};

// 跳转判断是否登录
const navTo = (url, check = true) => {
	if (check && !Vue.prototype.$store.state.hasLogin) {
		url = '/pages/public/login';
	}
	if (url == '/pages/index/index' || url == '/pages/category/category' || url == '/pages/category/itemize' ||
		url == '/pages/cart/cart' || url == '/pages/user/user') {
		uni.switchTab({
			url: url
		});
	} else {
		uni.navigateTo({
			url: url
		});
	}
};

const img_complete = (url) => {
	if (/^data:image\//.test(url)) {
		return url;
	} else if (/^(http|https):\/\/.+/.test(url)) {
		return url;
	} else {
		url = Vue.prototype.$ossUrl + url;
		return url;
	}
};

const multiple = (value, magnification = 1) => {
	return (value = value * magnification);
};

const maskUserName = (name) => {
	if (name.length < 4) {
		return name.slice(0, 1) + '*' + name.slice(-1);
	}
	return name.slice(0, 2) + '***' + name.slice(-2);
}

Vue.config.productionTip = false;
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$multiple = multiple;
Vue.prototype.$api = {
	msg,
	prePage,
	checkLogin,
	request,
	deepCopy,
	navTo,
	img_complete,
	maskUserName
};

// #ifdef MP-WEIXIN
// 微信小程序
// const wechatMiniLogin = async () => {
//   msg('登录中');
//   let [error, loginRes] = await uni.login({
//     provider: 'weixin'
//   });
//   if (loginRes.hasOwnProperty('code')) {
//     let data = await request('/user/authSession', 'GET', {
//       code: loginRes.code
//     });
//     if (data) {
//       if (data.hasOwnProperty('userInfo') && data.userInfo.token && data.userInfo.token != '') {
//         Vue.prototype.$store.commit('login', data.userInfo);
//         Vue.prototype.$store.mutations.login(data.userInfo)
//       }
//     }
//     return true;
//   } else {
//     msg('登录失败');
//     return false;
//   }
// };
// Vue.prototype.$wechatMiniLogin = wechatMiniLogin;
// #endif

App.mpType = 'app';

const app = new Vue({
	...App
});
app.$mount();