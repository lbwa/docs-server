function formatDate (date: Date|string): string {
  const convert = [
    null,
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ]

  if (date instanceof Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate().toLocaleString('zh', { minimumIntegerDigits: 2, useGrouping: false })

    return `${year} ${convert[month]} ${day}` // 2018 AUG 1
  }

  // string type
  const reg = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/
  const format = reg.exec(date)
  if (format[0]) {
    return format[0] // 2018-8-1
  } else {
    console.warn('[Format date]: Formatting failed !')
    return date
  }
}

module.exports = formatDate
