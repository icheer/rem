import Vue from 'vue'
import Router from 'vue-router'
import Blank from '@/pages/blank/blank'
import Wish from '@/pages/wish/wish'
import Help from '@/pages/help/help'
import Card from '@/pages/card/card'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: '首页',
			component: Blank
		},{
			path: '/wish',
			name: '发起页',
			component: Wish
		},{
			path: '/help',
			name: '助力页',
			component: Help
		},{
			path: '/card',
			name: '海报页',
			component: Card
		}
	]
})
