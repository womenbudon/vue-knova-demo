<template>
<div class="container-wraper">
 <div id="scale-contianer">
   <v-stage ref="stage" :config="stageSize" @wheel="handleWheel">
    <v-layer ref="layer">
      <v-image :config="{
            image: image,
            ...imageConfig,
          }"
          />
    </v-layer>
  </v-stage>
 </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            stageSize: {
                width: 0,
                height: 0,
            },
            image: null,
            imageConfig: {
                id: 'myImg',
                draggable: true,
                scaleX: 0.8,
                scaleY: 0.8,
                x: 0,
                y: 0,
            }
        };
    },
    computed: {
    },
   created() {
    const image = new window.Image();
    image.src = "http://img.daimg.com/uploads/allimg/140903/3-140Z3161P0.jpg";
    image.onload = () => {
        this.image = image;
        const { scaleX,scaleY } = this.imageConfig;

        const scaleContainer = document.getElementById("scale-contianer");
        const containerWidth = scaleContainer.clientWidth;
        const containerHeight = scaleContainer.clientHeight;
        this.stageSize = {
            width: containerWidth,
            height: containerHeight,
        }

        // 设置图片位于中心点
        const x = (containerWidth-image.width*scaleX)/2;
        const y = (containerHeight-image.height*scaleY)/2;
        this.imageConfig.x = x < 0 ? 0 : x;
        this.imageConfig.y = y < 0 ? 0 : y;
    };
  },
  methods: {
      handleWheel: function(e) {
            const shape = e.target;
            if(shape.attrs.id !== 'myImg') { // 只允许在图片上点击滚轮缩放
                return;
            }
            let scale = this.imageConfig.scaleX;
            if(e.evt.deltaY > 0 && scale > 0.25) {
                scale= scale - 0.05;
            }else if(e.evt.deltaY < 0 && scale < 1.5) {
                scale = scale + 0.05;
            }
            this.imageConfig.scaleX = scale;
            this.imageConfig.scaleY = scale;
      }
  }
};
</script>

<style lang="less" scoped>
    @import '../style/mixin';
    .container-wraper{
        height: 100%;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    #scale-contianer{
        height: 100%;
        width: 100%;
        background: #ccc;
        overflow: hidden;
        box-sizing: border-box;
    }
</style>