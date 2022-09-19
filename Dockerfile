# 基础镜像
FROM jasony62/tmw-aio_dev:latest AS builder

# gah-cms(与业务相关的controller)
## 复制源代码
COPY ./packages/gah-cms/package.json /usr/src/gah-cms/package.json
COPY ./packages/gah-cms/tsconfig.json /usr/src/gah-cms/tsconfig.json
COPY ./packages/gah-cms/src /usr/src/gah-cms/src
## 安装依赖包并编译
WORKDIR /usr/src/gah-cms
# RUN pnpm i --strict-peer-dependencies=false && pnpm build
## 清除不需要的包，准备生成版本
RUN rm -rf /usr/src/gah-cms/node_modules
# RUN pnpm i --production --strict-peer-dependencies=false

## gah-plugins(与业务相关的前端插件)
COPY ./packages/gah-plugins /usr/src/gah-plugins
COPY ./packages/gah-plugins/package.json /usr/src/gah-plugins/package.json
RUN cd /usr/src/gah-plugins && pnpm i --strict-peer-dependencies=false && pnpm build

## ue_plugin(与业务相关的前端插件部件)
COPY ./packages/ue_plugin/package.json /usr/src/ue_plugin/package.json
RUN cd /usr/src/ue_plugin && pnpm i --strict-peer-dependencies=false
COPY ./packages/ue_plugin /usr/src/ue_plugin
ARG vite_plugin_base_url
RUN echo VITE_BASE_URL=$vite_plugin_base_url >> /usr/src/ue_plugin/.env
RUN cd /usr/src/ue_plugin && pnpm i && pnpm build

# 生成运行镜像
FROM jasony62/tmw-aio:latest 

WORKDIR /usr/app/tmw

# COPY --from=builder /usr/src/gah-cms/node_modules /usr/app/tmw/node_modules/gah-cms/node_modules
# COPY --from=builder /usr/src/gah-cms/dist /usr/app/tmw/node_modules/gah-cms/dist
# COPY --from=builder /usr/src/gah-cms/package.json /usr/app/tmw/node_modules/gah-cms/package.json

## 部署gah-cms的配置文件
COPY ./packages/gah-cms/tms-koa_ctrl-plugin.json /usr/app/tmw/ctrl_plugin_config/gah-cms.json

## 部署gah-plugins
COPY --from=builder /usr/src/gah-plugins/dist /usr/app/tmw/gah-plugins
# COPY ./packages/gah-plugins/config /usr/app/tmw/gah-plugins/config

## 部署ue_plugin
COPY --from=builder /usr/src/ue_plugin/dist/plugin /usr/share/nginx/html/plugin

## nginx代理配置
COPY ./docker/nginx.conf.template /etc/nginx/nginx.conf.template
# COPY ./docker/gah-nginx.conf /etc/nginx/conf.d/gah-nginx.conf
RUN sed -i '52,68 s/^/#/g' /etc/nginx/nginx.conf.template
RUN sed -i '68a\    include http.d\/gah-aio.conf;' /etc/nginx/nginx.conf.template

COPY ./docker/start_nginx.sh /usr/app/tmw/start_nginx.sh
RUN chmod +x /usr/app/tmw/start_nginx.sh

# 启动服务
COPY ./docker/start.sh /usr/app/tmw/start.sh 

# 配置文件
COPY ./docker/back/config /usr/app/tmw/config

ENTRYPOINT ["sh", "start.sh"]