module.exports = {
  // 基本格式设置
  printWidth: 100,        // 每行代码最大长度
  tabWidth: 2,            // 一个tab代表几个空格数
  useTabs: false,         // 是否使用tab进行缩进
  semi: true,             // 行尾是否使用分号
  singleQuote: true,      // 是否使用单引号
  quoteProps: 'as-needed', // 对象的key仅在需要时使用引号
  jsxSingleQuote: false,  // jsx中是否使用单引号
  
  // 间距相关
  trailingComma: 'none',  // 对象、数组等末尾是否需要逗号
  bracketSpacing: true,   // 对象大括号直接是否有空格，效果：{ foo: bar }
  bracketSameLine: false, // 多行JSX中的>是否另起一行
  
  // 缩进相关
  arrowParens: 'avoid',   // 箭头函数只有一个参数时是否省略括号
  endOfLine: 'auto',      // 结尾是 \n \r \n\r auto
  
  // Vue特定配置
  vueIndentScriptAndStyle: false, // 是否缩进Vue文件中的script和style标签
  
  // HTML相关配置
  htmlWhitespaceSensitivity: 'css', // HTML空格敏感度
  
  // 其他配置
  embeddedLanguageFormatting: 'auto', // 是否格式化嵌入的代码块
}; 