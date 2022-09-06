<template>
  <div class="flex flex-col gap-4 h-full w-full">
    <div>
      <el-form label-position="top" size="large">
        
        <el-form-item>
          <el-button type="primary" @click="onExecute">执行</el-button>
          <el-button @click="onCancel" v-if="!executed">取消</el-button>
          <el-button @click="onClose" v-if="executed">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="response-content flex-grow border border-gray-200 rounded-md overflow-auto" v-if="responseContent">
      <pre>{{ responseContent }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";

const executed = ref(false);

const responseContent = ref<string>("");

enum PluginWidgetAction {
  Created = "Created",
  Cancel = "Cancel",
  Execute = "Execute",
  Close = "Close",
}

interface PluginWidgetResult {
  action: PluginWidgetAction;
  result?: any;
  handleResponse?: boolean;
  applyAccessTokenField?: string; // 定用户输入中申请添加access_token的字段
  reloadOnClose?: boolean; // 关闭部件后是否要刷新数据
}

// 调用插件的页面
const Caller = window.parent;
const message: PluginWidgetResult = { action: PluginWidgetAction.Created };
Caller.postMessage(message, "*");

let PluginName: string = "";

/**接收结果*/
window.addEventListener("message", (event) => {
  const { data } = event;
  const { response } = data;
  if (response) {
    if (typeof response === "string") responseContent.value = response;
    else if (typeof response === "object")
      responseContent.value = JSON.stringify(response, null, 2);
  }
});

function onExecute() {
  //如果有caller并且有文件内容
  // if (Caller && userInput.url) {
  //   const message: PluginWidgetResult = {
  //     action: PluginWidgetAction.Execute,
  //     result: toRaw(userInput),
  //     handleResponse: true,
  //     applyAccessTokenField: "url",
  //   };
  //   try {
  //     // 给调用方发送数据
  //     Caller.postMessage(message, "*");
  //     executed.value = true;
  //   } catch (e) {
  //     console.log("未知错误", e);
  //   }
  // }
}

function onCancel() {
  if (Caller) {
    const message: PluginWidgetResult = { action: PluginWidgetAction.Cancel };
    Caller.postMessage(message, "*");
  }
}

function onClose() {
  if (Caller) {
    const message: PluginWidgetResult = {
      action: PluginWidgetAction.Close,
      reloadOnClose: true,
    };
    Caller.postMessage(message, "*");
  }
}
</script>
