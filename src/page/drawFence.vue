<template>
  <div class="container-wraper">
    <div id="scale-contianer"></div>
  </div>
</template>

<script>
import Konva from "konva";
import {
  PATHSTYLE,
  VERTEXSTYLE,
  DRAWING_RECTANGLE,
  DRAWING_POLYGON
} from "./Type";

let stage = null,
  backgoroundLayer = null,
  shapLayer = null,
  backImg = null,
  shapeConfig = {};

const isNumber = num => {
  return num === +num;
};

const drawfence = (x, y, dbFlag) => {
  // ----------初始化图形图层-------

  let rectConfig = {
    x: shapeConfig.startX,
    y: shapeConfig.startY,
    width: x - shapeConfig.startX,
    height: y - shapeConfig.startY,

    fill: PATHSTYLE.fillStyle,
    stroke: PATHSTYLE.strokeStyle,
    strokeWidth: PATHSTYLE.lineWidth
  };
  // 绘制图形
  var rect1 = new Konva.Rect({
    ...rectConfig
  });
  // 清除图层
  shapLayer.destroyChildren();
  shapLayer.add(rect1);
  shapLayer.batchDraw();
  if (dbFlag) {
    //   backImg.remove
    stage.removeEventListener("click");
    stage.removeEventListener("dblclick");
    stage.removeEventListener("mousemove");
  }
};

const isInImageArea = (axVal, yxVal, imageConfig) => {
  // 判断是否在图片区域内
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  const { x, y, width, height } = imageConfig;
  const rect = new Path2D();
  rect.rect(x, y, width, height);
  return ctx.isPointInPath(rect, axVal, yxVal);
};

export default {
  data() {
    return {
      backImgConfig: {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: () => {
      const scaleContainer = document.getElementById("scale-contianer");
      const containerWidth = scaleContainer.clientWidth;
      const containerHeight = scaleContainer.clientHeight;
      const _self = this;

      stage = new Konva.Stage({
        container: "scale-contianer",
        width: containerWidth,
        height: containerHeight
      });

      //------初始化背景------------
      backgoroundLayer = new Konva.Layer({
        x: 0,
        y: 0,
        width: containerWidth,
        height: containerHeight
      });
      stage.add(backgoroundLayer);

      var image = new Image();
      image.onload = function() {
        // const x = (containerWidth - image.width * 0.8) / 2;
        // const y = (containerHeight - image.height * 0.8) / 2;

        _self.backImgConfig = {
          //   draggable: true, // 注释拖动
          x: 0,
          y: 0,
          image: image,
          width: image.width,
          height: image.height
        };
        backImg = new Konva.Image({
          ..._self.backImgConfig
        });
        backgoroundLayer.add(backImg);
        backgoroundLayer.batchDraw();

        shapLayer = new Konva.Layer({
          //   draggable: true
          x: 0,
          y: 0,
          width: containerWidth,
          height: containerHeight
        });
        stage.add(shapLayer);

        backgoroundLayer.setZIndex(0);
        shapLayer.setZIndex(1);

        // 图形添加鼠标事件绑定
        stage.on("click", function(e) {
          const ev = e.evt;
          const x = ev.layerX;
          const y = ev.layerY;
          if (!isInImageArea(x, y, _self.backImgConfig)) {
            return;
          }
          if (!isNumber(shapeConfig.startX) && !isNumber(shapeConfig.startY)) {
            // 第一次点击
            shapeConfig = {
              startX: x,
              startY: y
            };
            drawfence(x, y);
          } else {
            // 第二次点击
            drawfence(x, y, true);
          }
        });

        stage.on("mousemove", function(ev) {
          ev = ev.evt;
          const x = ev.layerX;
          const y = ev.layerY;
          if (isNumber(shapeConfig.startX) && isNumber(shapeConfig.startY)) {
            drawfence(x, y);
          }
        });

        // backImg.addEventListener("dblclick", function(ev) {
        //   const x = ev.layerX;
        //   const y = ev.layerY;
        //   if (isNumber(shapeConfig.startX) && isNumber(shapeConfig.startY)) {
        //     drawfence(_self.backImgConfig, x, y, true);
        //   }
        // });
      };
      image.src = "http://img.daimg.com/uploads/allimg/140903/3-140Z3161P0.jpg";
    }
  }
};
</script>

<style lang="less" scoped>
.container-wraper {
  position: relative;
  height: 100%;
  width: 100%;
  //   padding: 20px;
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