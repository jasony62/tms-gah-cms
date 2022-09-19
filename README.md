# tms-gah-cms

tms-go-apihub 配套的数据管理系统，支持采用可视化方式管理 api 定义，flow 定义等。

`gah-cms`是`tms-mongodb-web`的控制器扩展项目（相当于tmw的back）。

`gah-plugins`是`tms-mongodb-web`的前端插件项目（相当于tmw的plugins）。

`ue_plugin`是`tms-mongodb-web`前端插件部件的项目（相当于tmw的ue_plugin）。


## 项目说明
将 `gah-cms` 作为  `tmw` 的一个node_modules包，方便实际业务的定制化开发。


将 `ue_plugin` 可以理解为单独的前端页面，与底层 `tmw` 的 `ue_admin` 中的 `Collection.vue` 进行交换数据。
从页面表现来看，是在 `ue_admin` 中用 `iframe` 的方式打开了插件部件。
因此，为了解决跨域的问题，需要将 `ue_plugin` 打包之后的静态页面与 `tmw` 镜像中的 `ue_admin` 放在同一目录下。