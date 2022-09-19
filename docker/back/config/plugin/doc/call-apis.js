const {
  TMW_PLUGIN_DOC_CALL_APIS_NAME: Name,
  TMW_PLUGIN_DOC_CALL_APIS_BUCKET: Bucket,
  TMW_PLUGIN_DOC_CALL_APIS_DB: Db,
  TMW_PLUGIN_DOC_CALL_APIS_CL: Cl,
  TMW_PLUGIN_DOC_CALL_APIS_TITLE: Title,
  TMW_PLUGIN_DOC_CALL_APIS_URL: Url,
  TMW_PLUGIN_DOC_CALL_APIS_METHOD: Method,
  TMW_PLUGIN_DOC_CALL_APIS_EXCLUDEID: ExcludeId,
  TMW_PLUGIN_DOC_CALL_APIS_WIDGET_URL,
} = process.env

module.exports = {
  widgetUrl:
  TMW_PLUGIN_DOC_CALL_APIS_WIDGET_URL ||
  '/plugin/gah/#/call-apis',
  name: Name ? Name.split(',') : ['doc-http-send'],
  title: Title ? Title.split(',') : ['发送数据'],
  url: Url ? Url.split(',') : [],
  method: Method ? Method.split(',') : [],
  excludeId: ExcludeId ? ExcludeId.split(',') : [],
  bucket: Bucket ? Bucket.split(',') : [],
  db: Db ? Db.split(',') : [],
  cl: Cl ? Cl.split(',') : [],
}
