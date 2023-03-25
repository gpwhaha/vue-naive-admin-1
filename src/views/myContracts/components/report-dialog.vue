<template>
  <n-modal
    v-model:show="show"
    :closable="true"
    class="consultReportDialog"
    to="body"
    preset="dialog"
    :style="{ padding: 0 }"
    :show-icon="false"
    @after-enter="open"
    @after-leave="close"
  >
    <div class="contain-box">
      <div class="box">
        <n-image :src="lTopBg" class="img l-top" draggable="false" :img-props="{ style: 'width:12rem' }"></n-image>
        <n-image
          :src="midLongBg"
          class="mig-top"
          draggable="false"
          :img-props="{
            style: 'position: absolute;left: 50%;top: 0;transform: translateX(-50%);width: 75%;',
          }"
        ></n-image>
        <n-image :src="rTopBg" class="img r-top" draggable="false" :img-props="{ style: 'width:12rem' }"></n-image>
        <n-image :src="lSideBg" class="l-side" draggable="false"></n-image>
        <n-image :src="rSide" class="r-side" draggable="false"></n-image>
        <n-image
          :src="lBottomBg"
          class="img l-bottom"
          draggable="false"
          :img-props="{ style: 'width:12rem' }"
        ></n-image>
        <n-image
          :src="rBottomBg"
          class="img r-bottom"
          draggable="false"
          :img-props="{ style: 'width:12rem' }"
        ></n-image>
        <n-image
          :src="midLongBg"
          class="mig-bottom"
          draggable="false"
          :img-props="{
            style: 'position: absolute;left: 50%;bottom: 0;transform: translateX(-50%);width: 75%;',
          }"
        ></n-image>
        <n-image
          :src="bMidBg"
          class="mig-bottom-center"
          draggable="false"
          :img-props="{
            style: 'position: absolute;left: 50%;bottom: 7%;transform: translateX(-50%);width: 15%;',
          }"
        ></n-image>
        <n-image
          :src="docVa"
          class="docVa"
          draggable="false"
          :img-props="{
            style: 'position: absolute;right: 4%;top: 20%;width: 14rem;',
          }"
        ></n-image>
        <div class="wrapper">
          <div class="topBox">
            <div class="title">协商报告</div>
            <n-image
              :src="titleMid"
              class="titleMid"
              draggable="false"
              :img-props="{ style: 'width: 40%;margin-top: 1rem;' }"
            ></n-image>
          </div>
          <div class="midBox">
            <div class="midBox-item">
              <div class="item">
                <div class="label">合同名称</div>
                <div class="value">{{ consultData.title }}</div>
              </div>
              <div class="item">
                <div class="label">创建人</div>
                <div class="value">{{ consultData.creatorName }}</div>
              </div>
            </div>
            <div class="midBox-item">
              <div class="item">
                <div class="label">创建时间</div>
                <div class="value">{{ getDate(consultData.createDate) }}</div>
              </div>
              <div class="item">
                <div class="label">相对方名称</div>
                <div class="value">{{ relativeName }}</div>
              </div>
            </div>
            <div class="midBox-item">
              <div class="item">
                <div class="label">协商人数</div>
                <div class="value" style="text-indent: 2rem">
                  {{ consultData.consultationNNT }}
                </div>
              </div>
              <div class="item">
                <div class="label">协商情况</div>
                <div class="value flex">
                  <div class="comments flex">
                    <div class="name">协商评论</div>
                    <div class="count" style="color: #f66464">
                      {{ consultData.commentCount }}
                    </div>
                  </div>
                  <div class="comments flex">
                    <div class="name">已处理</div>
                    <div class="count" style="color: #4797fe">
                      {{ consultData.commentHandledCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottomBox">
              <div class="flex" style="justify-content: space-between">
                <div class="title">详细信息</div>
                <div v-if="tableCount > 4" class="pagination">
                  <n-pagination
                    v-model:page="search.pageNo"
                    v-model:page-size="search.pageSize"
                    :page-count="5"
                    show-size-picker
                    :page-sizes="[10, 20, 30, 40]"
                  />
                </div>
              </div>

              <n-data-table :columns="columns" :data="tableData" :bordered="false" />
            </div>
            <div style="height: 8rem"></div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import lTopBg from '@/assets/images/l-top.png'
import midLongBg from '@/assets/images/long-mid.png'
import titleMid from '@/assets/images/title-Top.png'
import rTopBg from '@/assets/images/r-top.png'
import lSideBg from '@/assets/images/l-side.png'
import rSide from '@/assets/images/r-side.png'
import lBottomBg from '@/assets/images/l-bottom.png'
import rBottomBg from '@/assets/images/r-bottom.png'
import bMidBg from '@/assets/images/b-mid-R.png'
import docVa from '@/assets/images/docVa.png'
import { getDate } from '@/utils'

const emit = defineEmits(['update:visible'])
const tableCount = ref(0)
const tableData = ref([])
const search = reactive({
  pageNo: 1,
  pageSize: 4,
})
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  consultData: {
    type: Object,
    default: () => {},
  },
})
const show = computed({
  get() {
    return props.visible
  },
  set(v) {
    emit('update:visible', v)
  },
})

const relativeName = computed(() => {
  if (Array.isArray(props.consultData.relativeName) && props.consultData.relativeName.length > 0) {
    return props.consultData.relativeName.toString()
  }
  return ''
})
const columns = [
  {
    title: '协商人',
    key: 'personName',
    width: 120,
    ellipsis: true,
  },
  {
    title: '评论时间',
    key: 'commentDate',
    width: 180,
    render(row) {
      return h(
        'span',
        {},
        {
          default: () => getDate(row.commentDate),
        }
      )
    },
  },
  {
    title: '评论内容',
    key: 'commentContent',
  },
  {
    title: '处理状态',
    key: 'commentHandledStatus',
    width: 100,
    ellipsis: true,
  },
  {
    title: '处理前文本',
    key: 'contentBefore',
    ellipsis: true,
  },
  {
    title: '处理后文本',
    key: 'contentAfter',
    ellipsis: true,
  },
]

watch(
  () => props.consultData,
  (val) => {
    tableData.value = val?.details?.data || []
    tableCount.value = val?.details?.total || 0
  },
  {
    immediate: true,
    deep: true,
  }
)

function open() {}

function close() {
  show.value = false
}
</script>

<style scoped lang="scss">
:deep(.n-dialog__content) {
  margin: 0 !important;
}
.contain-box {
  padding: 3.5rem;
  background-color: #f5f5f5;
}
.box {
  width: 100%;
  min-height: 70rem;
  background-color: #f5f5f5;
  position: relative;
  -webkit-user-drag: none;
  .wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 4rem;
    .topBox {
      text-align: center;
      .title {
        font-size: 2.2rem;
        font-weight: bolder;
      }
      .titleMid {
        display: inline-block;
      }
    }
    .midBox {
      margin-top: 4rem;
      .midBox-item {
        display: grid;
        grid-template-columns: 1fr 1fr 14rem;
        grid-gap: 4rem;
        margin-top: 4rem;
      }

      .item {
        display: flex;
        align-items: center;
        .label {
          font-size: 1.5rem;
          font-weight: bolder;
          color: #000;
          width: 10rem;
        }
        .value {
          margin-left: 2rem;
          width: 100%;
          border-bottom: #999999 1px solid;
          .comments {
            margin-right: 2rem;
            .name {
              font-size: 1.5rem;
            }
            .count {
              font-weight: bolder;
              margin-left: 0.5rem;
            }
          }
        }
      }
    }
  }
  .l-top {
    position: absolute;
    left: 0;
    top: 0;
  }
  .r-top {
    position: absolute;
    right: 0;
    top: 0;
  }
  .l-side {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
  }
  .r-side {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
  }
  .l-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .r-bottom {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
.bottomBox {
  margin-top: 4rem;
}
:deep(.n-data-table-table) {
  background-color: unset;
  transition: unset;
  .n-data-table-thead {
    background-color: unset;
    transition: unset;
    .n-data-table-th {
      background-color: unset;
      transition: unset;
    }
  }
  .n-data-table-td {
    background-color: unset;
    transition: unset;
  }
}
</style>
