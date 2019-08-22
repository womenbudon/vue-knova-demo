<template>
  <div class="container-wraper">
    <div id="scale-contianer">
      <v-stage ref="stage" :config="stageSize" @wheel="handleWheel">
        <v-layer ref="layer" :config="layerConfig">
          <v-group
            ref="group"
            :config="{
              draggable: true,
               zIndex: 0,
          }"
          >
            <v-image
              ref="image"
              :config="{
                    image: image,
                    ...imageConfig,
                }"
              @mousemove="onmousemove"
              @click="onImageClick"
              @dblclick="onImageDbClick"
            />
          </v-group>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import {
  PATHSTYLE,
  VERTEXSTYLE,
  DRAWING_RECTANGLE,
  DRAWING_POLYGON
} from "./Type";
import { offsetXYFromParent } from "./utils";

let ctx = null,
  _self = null,
  group = null;
let drawConfig = {
  x: 0, // 图形起点
  y: 0, // 图形终点
  shapType: DRAWING_RECTANGLE, // 默认正方形
  rectConfig: {
    width: 0,
    height: 0
  }
};

export default {
  data() {
    return {
      stageSize: {
        draggable: true,
        width: 0,
        height: 0
      },
      layerConfig: {},
      shapeConfig: {},
      image: null,
      imageConfig: {
        zIndex: 0,
        id: "myImg",
        scaleX: 0.8,
        scaleY: 0.8,
        width: 0,
        height: 0,
        x: 0,
        y: 0
      }
    };
  },
  created() {
    const image = new window.Image();
    image.src = "http://img.daimg.com/uploads/allimg/140903/3-140Z3161P0.jpg";
    image.onload = () => {
      this.image = image;
      const { scaleX, scaleY } = this.imageConfig;

      const scaleContainer = document.getElementById("scale-contianer");
      const containerWidth = scaleContainer.clientWidth;
      const containerHeight = scaleContainer.clientHeight;
      this.stageSize = {
        width: containerWidth,
        height: containerHeight
      };

      // 设置图片位于中心点
      const x = (containerWidth - image.width * scaleX) / 2;
      const y = (containerHeight - image.height * scaleY) / 2;
      this.imageConfig.x = x < 0 ? 0 : x;
      this.imageConfig.y = y < 0 ? 0 : y;
      this.imageConfig.width = image.width;
      this.imageConfig.height = image.height;
    };
  },

  mounted() {
    // group = new Konva.Group({
    //   draggable: true
    // });
    // group.zIndex(1);
    // this.$refs.layer.getLayer().add(group);
  },
  methods: {
    init: () => {},
    handleWheel: function(e) {
      const shape = e.target;
      //   if (shape.attrs.id !== "myImg") {
      //     // 只允许在图片上点击滚轮缩放
      //     return;
      //   }
      let scale = this.imageConfig.scaleX;
      if (e.evt.deltaY > 0 && scale > 0.25) {
        scale = scale - 0.05;
      } else if (e.evt.deltaY < 0 && scale < 1.5) {
        scale = scale + 0.05;
      }
      this.imageConfig.scaleX = scale;
      this.imageConfig.scaleY = scale;
    },
    drawFence: (_self, oldShape) => {
      // 删除该图形
      // 添加该图形
      //   const shape = new Konva.Shape({
      //     fill: PATHSTYLE.fillStyle,
      //     stroke: PATHSTYLE.strokeStyle,
      //     strokeWidth: PATHSTYLE.lineWidth,
      //     sceneFunc: function(context, shape) {
      //       context.clearRect(
      //         _self.imageConfig.x,
      //         _self.imageConfig.y,
      //         _self.imageConfig.width * _self.imageConfig.scaleX,
      //         _self.imageConfig.height * _self.imageConfig.scaleY
      //       );
      //       context.rect(
      //         drawConfig.x,
      //         drawConfig.y,
      //         // drawConfig.rectConfig.width,
      //         // drawConfig.rectConfig.height
      //         100,
      //         100
      //       );
      //       context.stroke();
      //       context.fillStrokeShape(shape);
      //     }
      //   });

      var shape = new Konva.Rect({
        zIndex: 1,
        x: drawConfig.x,
        y: drawConfig.y,
        width: 100,
        height: 50,
        fill: "green",
        stroke: "black",
        strokeWidth: 4
      });
      const group = oldShape.getParent();
      //   group.zIndex(0);
      oldShape.getParent().add(shape);
      //   group.add(shape);
      oldShape.destroy();
      _self.$refs.layer.getStage().draw();
      //   _self.$refs.layer.add(shape);
    },
    onmousemove: function(ev) {
      const shape = ev.target;
      ctx = shape.getCanvas().getContext();
      if (shape.attrs.id !== "myImg") {
        // 只允许在图片上点击 绘制图形
        return;
      }
      const x = ev.evt.layerX;
      const y = ev.evt.layerY;
      drawConfig = {
        ...drawConfig,
        rectConfig: {
          width: x - drawConfig.x,
          height: y - drawConfig.y
        }
      };
      //   this.drawFence(this, shape);
    },
    onImageClick: function(ev) {
      const shape = ev.target;
      ctx = shape.getCanvas().getContext();
      if (shape.attrs.id !== "myImg") {
        // 只允许在图片上点击 绘制图形
        return;
      }
      const x = ev.evt.layerX;
      const y = ev.evt.layerY;
      drawConfig = {
        ...drawConfig,
        x,
        y
      };
      console.log("---------onImageClick", drawConfig);
      //   shape.zIndex(1);
      this.drawFence(this, shape);
    },
    onImageDbClick: function(ev) {}
  }
};
</script>

<style lang="less" scoped>
.container-wraper {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
#scale-contianer {
  height: 100%;
  width: 100%;
  background: #ccc;
  overflow: hidden;
  box-sizing: border-box;
}
</style>