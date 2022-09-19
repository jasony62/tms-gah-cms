const {
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_NAME: Name,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_BUCKET: Bucket,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_DB: Db,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_CL: Cl,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_TITLE: Title,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_URL: Url,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_METHOD: Method,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_EXCLUDEID: ExcludeId,
  TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_WIDGET_URL,
} = process.env

module.exports = {
  widgetUrl: TMW_PLUGIN_CMS_BOT_SEND_MESSAGE_WIDGET_URL || '/plugin/cms-bot-send-message',
  name: Name ? Name.split(',') : ['cms-bot-send-message'],
  title: Title ? Title.split(',') : ['发送消息'],
  url: Url ? Url.split(',') : [],
  method: Method ? Method.split(',') : [],
  excludeId: ExcludeId ? ExcludeId.split(',') : [],
  bucket: Bucket ? Bucket.split(',') : [],
  db: Db ? Db.split(',') : [],
  cl: Cl ? Cl.split(',') : [],
}
