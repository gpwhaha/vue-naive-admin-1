<template>
  <CommonPage title="智能起草"
    ><template #action>
      <n-button type="primary"> <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新建空白文档 </n-button>
    </template>
    <div class="wrapper"></div>
  </CommonPage>
</template>

<script setup></script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .create {
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    margin: 1rem 0;

    .box-item {
      height: 100%;
      .content {
        display: grid;
        justify-items: center;
        grid-template-rows: 18rem 15rem 1fr;

        .head {
          width: 100%;
          display: grid;
          justify-items: center;

          .select {
            width: 90%;
            display: flex;
            margin-top: -3rem;

            .select-btn {
              margin-left: 1rem;
            }
          }

          .name {
            font-size: 1.7rem;
            font-weight: bolder;
            margin-top: 1rem;
          }
        }

        .bg-img {
          text-align: center;
          height: 14rem;
          cursor: pointer;
        }

        .foot {
          display: grid;
          justify-items: center;
          .description {
            color: #999999;
            font-size: 1.6rem;
            margin-top: 4rem;
          }

          .btn {
            margin-top: 2rem;
          }
        }
      }
    }
  }
}
</style>
