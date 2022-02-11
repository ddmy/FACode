function getArgv () {
  // 检查启动参数
  const argv = {
    mode: 'JS',
    speed: 200,
    type: 'PNG',
    path: './',
    out: './',
    loading: true,
    minify: false
  }

  process.argv.filter(item => item.includes('=')).forEach(item => {
    const arr = item.split('=')
    argv[arr[0]] = arr[1]
  })

  if (argv.loading === 'true') {
    argv.loading = true
  }
  if (argv.loading === 'false') {
    argv.loading = false
  }

  if (argv.minify === 'true') {
    argv.minify = true
  }
  if (argv.minify === 'false') {
    argv.minify = false
  }
  return argv
}

module.exports = getArgv
