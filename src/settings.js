module.exports = {
  title: '图书管理后台',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true, // 是否展示右边设置面板

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true, // 上方是否展示打开的页面

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false, // 头部组件是否固定

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false, // 左上方是否显示logo

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
