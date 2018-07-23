function formatDate (day: Date): string {
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

  const year = day.getFullYear()
  const month = day.getMonth() + 1
  const date = day.getDate().toLocaleString('zh', { minimumIntegerDigits: 2, useGrouping: false })

  return `${year} ${convert[month]} ${date}`
}

module.exports = formatDate
