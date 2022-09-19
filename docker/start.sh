# 指定环境变量

## mongodb
export TMW_MONGODB_HOST=mongodb
export TMW_MONGODB_PORT=27017
export TMW_MONGODB_USER=root
export TMW_MONGODB_PASSWORD=5RdHqf94AF

## JWT 认证方式的服务端私有密钥
export TMW_APP_AUTH_JWT_KEY=gahcms

## 否关闭验证码
export TMW_APP_AUTH_CAPTCHA_DISABLED=yes

## 后端服务端口
export TMW_APP_PORT=3000

## redis
export TMS_REDIS_DISABLED=yes

## 插件文件
export TMW_APP_PLUGIN_DIR=plugins/**,gah-plugins/**
## 插件配置
export TMW_PLUGIN_DOC_CALL_APIS_NAME='doc-flow-api,doc-schedule-api'
export TMW_PLUGIN_DOC_CALL_APIS_TITLE="调用接口,计划"
export TMW_PLUGIN_DOC_CALL_APIS_URL="http://192.168.102.74:8080/flow/,http://192.168.102.74:8080/schedule/"
export TMW_PLUGIN_DOC_CALL_APIS_METHOD="get,get"
export TMW_PLUGIN_DOC_CALL_APIS_DB=""
export TMW_PLUGIN_DOC_CALL_APIS_CL=""

#$ 指定控制器目录
export TMS_KOA_CONTROLLERS_DIR=./dist/controllers

nohup start_nginx.sh &>/dev/null &

# 启动服务
## DEBUG=* node dist/server
node dist/server

