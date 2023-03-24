<template>
  <div flex-1 w-auto p-4 rounded-2 bg-white>
    <div flex w-full justify-between>
      <div font-700 text-7>智能起草</div>
      <div cursor-pointer text-5 color-gray @click="toMore">查看更多专业范本</div>
    </div>
    <n-spin :show="loading">
      <div class="list">
        <div class="item-box">
          <div class="item" @click="toCreate">
            <TheIcon icon="ep:plus" :size="50" color="#999999"></TheIcon>
          </div>
          <div text-center text-5 my-3 font-700>在线起草合同</div>
        </div>
        <div v-for="(item, index) in fileList.slice(0, 9)" :key="index" class="item-box">
          <div class="item">
            <div class="ribbon" :style="tagStyle(item)">
              <span>{{ tagName(item) }}</span>
            </div>
            <div class="img">
              <img v-if="item.url" w-full h-full :src="item.url" />
              <img v-else w-full :src="fileLoadFail" />
            </div>
            <div class="monolayer" @click.self="handleSuccessTemplate(item)">
              <div></div>
              <div class="preview-box" @click.stop="handleSuccessTemplate(item)">立即使用</div>
              <div class="bottom-text" @click.stop="handleDetail(item)">
                <i class="el-icon-search"></i> <span>预览</span>
              </div>
            </div>
          </div>
          <div text-center text-5 my-3>
            <n-ellipsis style="max-width: 18rem"> {{ item.templateName }}</n-ellipsis>
          </div>
        </div>
      </div>
    </n-spin>
  </div>
</template>
<script setup>
import fileLoadFail from '@/assets/images/seal-load-fail.png'
import { useCreate } from './useCreate'
const { loading, fileList, load, tagStyle, tagName, toMore, toCreate, handleDetail, handleSuccessTemplate } =
  useCreate()
onMounted(load)
</script>
<style lang="scss">
.list {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  // grid-gap: 6rem;
  grid-column-gap: 3rem;
  padding: 1rem;

  .item-box {
    .item {
      width: 100%;
      height: 26rem;
      border: #cacaca 1px solid;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      .monolayer {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: -1;
      }

      &:hover {
        .monolayer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.6);
          z-index: 99;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .preview-box {
            color: #0a79fa;
            font-size: 1.6rem;
            & span {
              margin-left: 1rem;
            }
          }
          .bottom-text {
            width: 100%;
            height: 5rem;
            line-height: 5rem;
            color: #0a79fa;
            font-size: 1.6rem;
            text-align: center;
            background-color: rgba(40, 120, 255, 0.2);
          }
        }
      }
      .add-icon {
        font-size: 5rem;
        color: #cacaca;
      }
      .ribbon {
        /* 右上角飘带 */
        background-color: #dbb255; /* 左上角飘带的背景颜色 */
        background-image: linear-gradient(#f4d177, #dbb255);
        overflow: hidden;
        white-space: nowrap; /* 文字不换行*/
        position: absolute; /* 绝对定位 */
        right: -40px;
        top: 10px;
        transform: rotate(45deg); /* 旋转45°*/
        z-index: 999;
      }

      .ribbon span {
        //border: 1px solid #54cbff;
        color: #fff;
        display: block;
        font: bold 100% 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 1.5rem;
        margin: 1px 0;
        padding: 2px 50px;
        text-align: center;
        text-shadow: 0 0 5px #aba4a4;
      }

      .img {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .file-name {
      width: 18rem;
      text-align: center;
      margin: 1rem 0;
      font-size: 1.4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
