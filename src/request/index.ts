import Taro from "@tarojs/taro";
import { goLoginPage, errPage } from "../utils/pagesFun";
import { STORE_TOKEN } from "../config/constant";

interface ParamsInterface {
	data?: any;
	url: string;
	method: keyof Taro.request.Method;
	quiet?: boolean; // 错误时是否，刨出错误信息，默认true不抛出
	type?: string;
	header?: object;
	noLoginPage?: boolean; // 是否跳转到登录页面
	option: any
}

export function request(
	baseUrl: string
): (conf: ParamsInterface) => Promise<any> {
	return function (conf) {
		Taro.showLoading({
			title: "加载中...",
		});
		if (conf.data) {
			// 微信的get请求，无法过滤掉undefine, null
			for (let i in conf.data) {
				if (!conf.data[i] && conf.data[i] !== 0) delete conf.data[i];
			}
		}
		return new Promise(async (resolve, reject) => {
			let token;
			try {
				token = await Taro.getStorageSync(STORE_TOKEN);
			} finally {
				Taro.request({
					url: baseUrl + conf.url,
					method: conf.method,
					data: conf.data,
					enableHttp2: true, // 开启http2
					header: Object.assign(
						{
							"Content-Type": "application/json",
							token: token,
						},
						conf.header || {}
					),
					success(response) {
						// 登录成功
						if (
							[200, "200"].includes(response.data?.respCode) ||
							[200, "200"].includes(response.statusCode)
						) {
							if (
								response.data.hasOwnProperty("success") &&
								!response.data.success
							) {
								conf?.quiet ? reject(response.data) : errPage();
							}
							if (response.data.hasOwnProperty("data")) {
								resolve(response.data.data); // 成功返回
							} else {
								resolve(response.data); // 成功返回
							}

							// 没有登录或token超时
						} else if ([403, "403", 401, "401"].includes(response.statusCode)) {
							Taro.clearStorageSync();
							!conf?.noLoginPage && goLoginPage(); // 是否跳转到登录页面
						} else {
							conf?.quiet ? reject(response.data) : errPage();
						}
					},
					fail(error) {
						conf?.quiet ? reject(error) : errPage();
					},
					complete() {
						Taro.hideLoading();
					},
					...conf?.option
				});
			}
		});
	};
}
