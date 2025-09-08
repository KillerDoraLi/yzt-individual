module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    amd: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // 限制每行的最大属性个数
    "vue/max-attributes-per-line": [2, {
      "singleline": 10,
      "multiline": {
        "max": 2,
        "allowFirstLine": false
      }
    }],
    "vue/singleline-html-element-content-newline": "off", // 在单行元素的内容前后需要换行符
    "vue/multiline-html-element-content-newline":"off", // 在多行元素的内容之前和之后需要换行符
    "vue/html-closing-bracket-newline": [2, {
      "multiline": "always",
      "singleline": "never"
    }], // 在标签的右括号之前需要换行符
    "vue/name-property-casing": ["error", "PascalCase"], // 在Vue组件中使用驼峰式命名
    "vue/no-v-html": "off", // 在Vue组件中不允许使用v-html
    'accessor-pairs': 2, // 在对象中使用getter/setter
    'arrow-spacing': [2, {
      'before': true,
      'after': true
    }], // 强制箭头函数的箭头前后使用一致的空格
    'block-spacing': [2, 'always'], // 强制在代码块中使用一致的空格
    'brace-style': [2, '1tbs', {
      'allowSingleLine': true
    }], // 强制在代码块中使用一致的大括号风格
    'camelcase': [0, {
      'properties': 'always'
    }], // 强制使用骆驼拼写法命名约定
    'comma-dangle': [2, 'never'], // 对象字面量项尾不能有逗号
    'comma-spacing': [2, {
      'before': false,
      'after': true
    }], // 逗号前后的空格
    'comma-style': [2, 'last'], // 逗号风格
    'constructor-super': 2, // 要求在子类构造函数中有 'super' 调用
    'curly': [2, 'multi-line'], // 代码块嵌套风格
    'dot-location': [2, 'property'], // 对象访问符的位置
    'eol-last': 2, // 文件以单一的换行符结束
    'eqeqeq': ["error", "always", {"null": "ignore"}], // 要求使用 === 和 !==
    'generator-star-spacing': [2, {
      'before': true,
      'after': true
    }], // 强制 generator 函数中 * 号周围有空格
    'handle-callback-err': [2, '^(err|error)$'], // 要求回调函数中有 'err' 或 'error'
    'jsx-quotes': [2, 'prefer-single'], // 强制在 JSX 属性中一致地使用双引号或单引号
    'key-spacing': [2, {
      'beforeColon': false,
      'afterColon': true
    }], // 对象字面量中冒号的前后空格
    'keyword-spacing': [2, {
      'before': true,
      'after': true
    }], // 关键字前后的空格
    'new-cap': [2, {
      'newIsCap': true,
      'capIsNew': false
    }], // 要求构造函数首字母大写
    'new-parens': 2, // 要求调用无参构造函数时有括号
    'no-array-constructor': 2, // 禁止使用数组构造器
    'no-caller': 2, // 禁止使用 arguments.caller 或 arguments.callee
    'no-class-assign': 2, // 禁止给类赋值
    'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
    'no-const-assign': 2, // 禁止修改 const 声明的变量
    'no-control-regex': 0, // 禁止在正则表达式中使用控制字符
    'no-delete-var': 2, // 不能对 function 的参数进行重新赋值
    'no-dupe-args': 2, // 函数参数不能重复
    'no-dupe-class-members': 2, // 禁止类成员中出现重复的名称
    'no-dupe-keys': 2, // 在对象字面量中键的值不能重复
    'no-duplicate-case': 2,     // switch 语句中的 case 语句不能重复
    'no-empty-character-class': 2, // 正则表达式中的 [] 内不能有空格
    'no-empty-pattern': 2, // 禁止使用空解构
    'no-eval': 2, // 禁止使用 eval
    'no-ex-assign': 2, // 禁止给 catch 的参数重新赋值
    'no-extend-native': 2, // 禁止扩展原生对象
    'no-extra-bind': 2, // 禁止不必要的 .bind()
    'no-extra-boolean-cast': 2, // 禁止不必要的布尔类型转换
    'no-extra-parens': [2, 'functions'], // 禁止不必要的括号
    'no-fallthrough': 2, // 禁止 case 语句落空
    'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾的零
    'no-func-assign': 2, // 禁止重复的函数声明
    'no-implied-eval': 2, // 禁止使用类似 eval() 的方法
    'no-inner-declarations': [2, 'functions'], // 禁止在嵌套的块中出现变量声明或 function 声明
    'no-invalid-regexp': 2, // 禁止 RegExp 构造函数中无效的正则表达式
    'no-irregular-whitespace': 2, // 禁止不规则的空格
    'no-iterator': 2, // 禁止使用 __iterator__ 属性
    'no-label-var': 2, // 禁止标签与变量同名
    'no-labels': [2, {
      'allowLoop': false,
      'allowSwitch': false
    }], // 禁止标签语句
    'no-lone-blocks': 2, // 禁止混合使用不同的操作符
    'no-mixed-spaces-and-tabs': 2, // 禁止空格和 tab 的混合
    'no-multi-spaces': 2, // 禁止连续的空格
    'no-multi-str': 2, // 禁止使用多行字符串
    'no-multiple-empty-lines': [2, {
      'max': 1
    }], // 空行最多不能超过1行
    'no-native-reassign': 2, // 不能重写本地符号
    'no-negated-in-lhs': 2, // in 操作符的左边不能有 !
    'no-new-object': 2, // 禁止使用 Object.constractor
    'no-new-require': 2, // 禁止使用 new require
    'no-new-symbol': 2, // 禁止使用 Symbol 构造
    'no-new-wrappers': 2, // 禁止使用 new
    'no-obj-calls': 2, // 禁止把全局对象作为函数调用
    'no-octal': 2, // 禁止使用八进制数字
    'no-octal-escape': 2, // 禁止使用八进制转义序列
    'no-path-concat': 2, // 禁止对 __dirname 和 __filename 进行字符串连接
    'no-proto': 2, // 禁止使用 Object.setPrototypeOf
    'no-redeclare': 2, // 禁止重复声明变量
    'no-regex-spaces': 2, // 禁止在正则表达式字面量中出现多个空格
    'no-return-assign': [2, 'except-parens'], // return 语句中不能有赋值表达式
    'no-self-assign': 2, // 禁止自我赋值
    'no-self-compare': 2, // 不能比较自身
    'no-sequences': 2, // 禁止使用逗号运算符
    'no-shadow-restricted-names': 2, // 严格限制标识符的使用
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'no-sparse-arrays': 2, // 禁止稀疏数组
    'no-this-before-super': 2, // 在调用super()之前不能使用this或super
    'no-throw-literal': 2, // 禁止抛出字面量错误
    'no-trailing-spaces': 2, // 一行结束后面不要有空格
    'no-undef': 2, // 不能有未定义的变量
    'no-undef-init': 2, // 不能初始化变量为undefined
    'no-unexpected-multiline': 2, // 避免多行表达式
    'no-unmodified-loop-condition': 2, // 禁止在循环中使用一个变量后不赋值
    'no-unneeded-ternary': [2, {
      'defaultAssignment': false
    }], // 禁止可以表达为更简单的表达式
    'no-unreachable': 2, // 不能有无法执行的代码
    'no-unsafe-finally': 2, // 不能有无效的finally
    'no-unused-vars': [2, {
      'vars': 'all',
      'args': 'none'
    }], // 不能有声明后未被使用的变量或参数
    'no-useless-call': 2, // 禁止不必要的.call()
    'no-useless-computed-key': 2, // 禁止在对象中使用不必要的计算属性
    'no-useless-constructor': 2, // 禁止不必要的构造函数
    'no-useless-escape': 0, // 禁用不必要的转义字符
    'no-whitespace-before-property': 2, // 不能有属性前面的空
    'no-with': 2, // 禁用with
    'one-var': [2, {
      'initialized': 'never'
    }], // 连续声明
    'operator-linebreak': [2, 'after', {
      'overrides': {
        '?': 'before',
        ':': 'before'
      }
    }], // 对象字面量中冒号的前后禁止有空格
    'padded-blocks': [2, 'never'], // 块语句中的内容不能为空
    'quotes': [2, 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }], // 用单引号
    'semi': ["error", "always"], // 语句必须分号结尾
    'semi-spacing': [2, {
      'before': false,
      'after': true
    }], // 分号前后的空格
    'space-before-blocks': [2, 'always'], // 圆括号内前后的空格
    'space-before-function-paren': 0, // 函数括号前后的空格
    'space-in-parens': [2, 'never'], // 小括号里面不能有空格
    'space-infix-ops': 2, // 中缀操作符周围的空格
    'space-unary-ops': [2, {
      'words': true,
      'nonwords': false
    }], // 一元运算符的前/后要不要有空格
    'spaced-comment': [2, 'always', {
      'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
    }], // 注释风格要不要有空格
    'template-curly-spacing': [2, 'never'], // 模板字符串中的嵌套括号风格
    'use-isnan': 2, // 禁止比较时使用NaN,只能用isNaN
    'valid-typeof': 2, // 必须使用合法的typeof的值
    'wrap-iife': [2, 'any'], // 立即执行函数表达式的小括号风格
    'yield-star-spacing': [2, 'both'], // yiled * 前后空格
    'yoda': [2, 'never'], // 禁止在if条件中出现yoda表达式
    'prefer-const': 2, // 首选 const
    'array-bracket-spacing': [2, 'never'], // 是否允许非空数组里面有多余的空格
    'indent': ['off', 2], // 缩进风格
    "vue/html-indent": ["off", 2],
    'vue/require-prop-types': 'off',
    'vue/html-self-closing': 'off'
  }
}
