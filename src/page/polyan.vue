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
  shapeConfig = {
    path: []
  },
  dbFlag = false;

const isNumber = num => {
  return num === +num;
};

const drawfence = () => {
  let tempPath = [];
  tempPath = [...shapeConfig.path, [shapeConfig.endX, shapeConfig.endY]];
  let path = [];
  // 数组去重
  tempPath.map(item => {
    if (path.length === 0) {
      path.push(item);
    } else if (!path.find(p => p[0] === item[0] && p[1] === item[1])) {
      path.push(item);
    }
  });
  path.push(path[0]); // 添加起始点和终点连线

  // 构造端点
  let dotArr = [];
  path.map(item => {
    let dot = new Konva.Circle({
      x: item[0],
      y: item[1],
      radius: VERTEXSTYLE.radius,
      fill: VERTEXSTYLE.fillStyle,
      stroke: VERTEXSTYLE.strokeStyle,
      strokeWidth: VERTEXSTYLE.strokeWidth
    });
    dotArr.push(dot);
  });

  //------绘制不规则图形--------
  var ploygon = new Konva.Shape({
    sceneFunc: function(context, shape) {
      context.beginPath();
      path.map((item, index) => {
        if (index === 0) {
          context.moveTo(item[0], item[1]);
        } else {
          context.lineTo(item[0], item[1]);
        }
      });
      context.closePath();
      context.fillStrokeShape(shape);
    },
    fill: PATHSTYLE.fillStyle,
    stroke: PATHSTYLE.strokeStyle,
    strokeWidth: PATHSTYLE.lineWidth
  });

  // 清除图层
  shapLayer.destroyChildren();
  shapLayer.add(ploygon); // 绘制围栏
  dotArr.map(item => shapLayer.add(item)); // 绘制端点
  shapLayer.batchDraw();

  if (dbFlag) {
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
        _self.backImgConfig = {
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
        let clicktag = 0;
        stage.on("click", function(e) {
          const ev = e.evt;
          const x = ev.layerX;
          const y = ev.layerY;
          if (!isInImageArea(x, y, _self.backImgConfig)) {
            return;
          }
          // 点击过快则为双击
          if (clicktag === 0) {
            clicktag = 1;
            setTimeout(function() {
              clicktag = 0;
            }, 500);
          } else {
            dbFlag = true;
          }
          shapeConfig.path.push([x, y]);
          drawfence();
        });

        stage.on("mousemove", function(ev) {
          ev = ev.evt;
          const x = ev.layerX;
          const y = ev.layerY;
          shapeConfig = {
            ...shapeConfig,
            endX: x,
            endY: y
          };
          drawfence();
        });

        // stage.on("dblclick", function(ev) {
        //   console.log("dblclick--------");
        //   const x = ev.layerX;
        //   const y = ev.layerY;
        //   if (isNumber(shapeConfig.startX) && isNumber(shapeConfig.startY)) {
        //     shapeConfig = {
        //       ...shapeConfig,
        //       endX: x,
        //       endY: y
        //     };
        //     drawfence(true);
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