import { PluginBase } from 'tmw-kit/dist/model'

// 插件前端部件地址
const WidgetUrl = process.env.TMW_PLUGIN_DOC_IMPORT_JSON_WIDGET_URL || '/plugin/gah/#/import-json'
/**
 * 将集合中的文档数据导出为json文件的压缩包
 */
class ImportDocJsonPlugin extends PluginBase {
  modelDoc

  constructor(file: string) {
    super(file)
    this.name = 'doc-import-json'
    this.title = '导入文档(JSON)'
    this.description = '导入postman 等JSON文档'
    this.scope = 'document'
    this.amount = 'zero'
    this.someTags = ['doc-import-json']
    this.beforeWidget = { name: 'external', url: WidgetUrl, size: '40%' }
  }

  async execute(ctrl: any, tmwCl: any) {
    const [ok, docsOrCause] = await this.findRequestDocs(ctrl, tmwCl)

    if (ok === false) return { code: 10001, msg: docsOrCause }

    const fileBody = ctrl.request.body.widget.file
    if (!fileBody) {
      console.log(`文件上传失败...`)
      return
    }
    const wasnRes = await wasmExecFun(fileBody)
    console.log(`wasnRes [${wasnRes}]`)
    if (!wasnRes) return Promise.reject('上传数据格式错误')

    const iptBase = new ImportBase()
    return await iptBase.importDetail(ctrl, tmwCl, wasnRes)
  }
}

class ImportBase {
  async importDetail(ctrl, tmwCl, wasnRes) {
    let rst = await this.importToColl(ctrl.mongoClient, tmwCl, wasnRes)

    let result = null
    if (rst[0] === true) {
      result = {
        importAll: true,
        message: `导入成功`
      }
    } else {
      result = {
        importAll: false,
        message: `导入失败,${rst[1]}`
      }
    }
    return result
  }
  /**
   *  提取json数据到集合中
   */
  async importToColl(mongoClient, tmwCl, wasnRes) {
    const jsons = JSON.parse(wasnRes)

    try {
      const cl = await this.findSysCl(mongoClient, tmwCl)
      return await cl.insertMany(jsons)
        .then((rst) => {
          console.log('json insert rst--',rst)
          return [true, '导入成功']
        })
    } catch (err) {
      console.error('提取json数据到集合中', err)
      return [false, err]
    }
  }

  async findSysCl(mongoClient, tmwCl) {
    if (!mongoClient) {
      throw Error('数据库连接失败')
    }
    const dbName = tmwCl.db.name
    const clName = tmwCl.name

    const cl = await this.byName(mongoClient, dbName, clName)
    if (!cl)
      throw Error(`指定的集合[db=${dbName}][cl=${clName}]不可访问`)
      
    let sysCl = mongoClient.db(cl.db.sysname).collection(cl.sysname)

    return sysCl
  }

  async byName(mongoClient, db, clName) {
    const query: any = { name: clName, type: 'collection' }

    if (typeof db === 'object') query['db.sysname'] = db.sysname
    else if (typeof db === 'string') query['db.name'] = db

    const clMongoObj = mongoClient.db('tms_admin').collection('mongodb_object')

    const cl = await clMongoObj.findOne(query)

    return cl
  }
}

/**
 * wasm封装函数
 */
import { readFileSync } from 'fs'
import * as path from 'path'

async function wasmExecFun(fileBody) {
  // require(path.resolve(__dirname, '../../../config/wasm/wasm_exec'))
  require(path.resolve(process.cwd(), './config/plugin/wasm/wasm_exec'))
  const go = new globalThis.Go()
  // go.argv = process.argv.slice(2)
  // go.env = Object.assign({ TMPDIR: require("os").tmpdir() }, process.env)
  // go.exit = process.exit

  let promise = new Promise(function (resolve, reject) {
    WebAssembly.instantiate(
      readFileSync(path.resolve(process.cwd(), './config/plugin/wasm/postman.wasm')), 
      go.importObject
    ).then((result) => {
        go.run(result.instance)
        globalThis.postmanToHttpapis(fileBody, function(data) {
          console.log(`回调返回:[${JSON.stringify(data)}]`)
          resolve(data)
        })

      }).catch((err) => {
        console.error(`WebAssembly err: ${err}`)
        reject('WebAssembly 执行报错')
      })
  })
  promise.then(function (value) {
    return value
  })
  return promise

  // WebAssembly.instantiate(readFileSync(path.resolve(process.cwd(), '../plugins/config/wasm/module.wasm')), go.importObject)
  // .then((result) => {
  //   // process.on("exit", (code) => { // Node.js exits if no event handler is pending
  //   //   if (code === 0 && !go.exited) {
  //   //     // deadlock, make Go print error and stack traces
  //   //     go._pendingEvent = { id: 0 }
  //   //     go._resume()
  //   //   }
  //   // })
  //   go.run(result.instance)
  //   return globalThis.transString(fileBody, function(data) {
  //     console.log(`transString:执行回调[${data}]`)
  //     // return Promise.resolve(data)
  //     return data
  //   })

  // }).catch((err) => {
  //   console.error(`WebAssembly err: ${err}`)
  //   return Promise.reject('WebAssembly 执行报错')
  // })
}

export function createPlugin(file: string) {
  return new ImportDocJsonPlugin(file)
}
