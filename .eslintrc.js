module.exports = {
  extends: ['pyc/react', 'pyc/typescript'],

  rules: {
    // off"或0 -关闭规则 "warn" 或1 - 开启规则 "error"或2 - 开启规则
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref'],
      },
    ],
  }
}
