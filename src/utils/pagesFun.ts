import Taro from "@tarojs/taro";
// import { LOGIN_INFO } from "../config/constant";

/**
 * @description 获取当前页url
 */
export const getCurrentPageUrl = () => {
	let pages = Taro.getCurrentPages();
	let currentPage = pages[pages.length - 1];
	let url = currentPage.route;
	return url;
};

// 跳转到登录页面
export function goLoginPage() {
	let path = getCurrentPageUrl();
	if (!path?.includes("loginPage")) {
		Taro.navigateTo({
			url: "/pages/common/loginPage/index",
		});
	}
}

export const errPage = () => {
	Taro.navigateTo({ url: "/pages/common/error/index" });
};
