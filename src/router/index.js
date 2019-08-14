import Vue from 'vue'
import Router from 'vue-router'
import VueKonva from 'vue-konva'

Vue.use(Router)
Vue.use(VueKonva);

const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const coding = r => require.ensure([], () => r(require('@/page/coding')), 'coding');
const drag = r => require.ensure([], () => r(require('@/page/drag')), 'drag');
const scale = r => require.ensure([], () => r(require('@/page/scale')), 'scale');

const routes = [
	{
		path: '/',
		component: manage,
		name: '',
		children: [
		{
			path: '/drag',
			component: drag,
			meta: ['定位组件demo', '拖动'],
		},{
			path: '/scale',
			component: scale,
			meta: ['定位组件demo', '缩放'],
		},
		{
			path: '/position_list',
			component: coding,
			meta: ['定位组件demo', '定位点分布'],
		},
		{
			path: '/position_tooltip',
			component: coding,
			meta: ['定位组件demo', '定位点弹窗'],
		},
		{
			path: '/draw_fence',
			component: coding,
			meta: ['定位组件demo', '绘制围栏'],
		}
		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
