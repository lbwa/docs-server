const chalk = require('chalk')

module.exports = {
  info (prefix: string = '[Info]', ...data: string[]) {
    console.log(chalk.green(prefix), ...data)
  },

  warn (prefix: string = '[Warn]', ...data: string[]) {
    console.warn(chalk.yellow(prefix), ...data)
  },

  error (prefix: string = '[Error]', ...data: string[]) {
    console.error(chalk.red(prefix), ...data)
  }
}

export {}
