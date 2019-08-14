<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
						<el-menu-item index="drag">拖动</el-menu-item>
						<el-menu-item index="scale">缩放</el-menu-item>
						<el-menu-item index="position_list">定位点分布</el-menu-item>
						<el-menu-item index="position_tooltip">定位点弹窗</el-menu-item>
						<el-menu-item index="draw_fence">绘制围栏</el-menu-item>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{
		
	}
</style>
