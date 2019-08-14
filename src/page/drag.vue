<template>
 <div class="drag-contianer">
   <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-image :config="{
            image: image,
            draggable: true,
          }"/>
    </v-layer>
  </v-stage>
 </div>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;

export default {
    data() {
        return {
        stageSize: {
            width: width,
            height: height
        },
        image: null
        };
    },
   created() {
    const image = new window.Image();
    image.src = "https://konvajs.org/assets/yoda.jpg";
    image.onload = () => {
      // set image only when it is loaded
      this.image = image;
    };
  }
};
</script>

<style lang="less" scoped>
    @import '../style/mixin';
    .drag-contianer{
        padding: 20px;
        height: 100%;
        width: 100%;
    }
</style>