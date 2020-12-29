export default {
  dynamicImport: {},
  title: 'form',
  resolve: {
    includes: [
      'src'
    ]
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ]
  ]
}