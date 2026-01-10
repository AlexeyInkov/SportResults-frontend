// Функция форматирования даты
export const formatDate = (dateString) => {
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

export const formatResult = (result, discipline) => {
  if (!result) {
    return '-'
  }
  if (discipline.units === 'см') {
    return `${result / 100} м`
  }
  if (discipline.units === 'с') {
    if (result < 0) {
      return `-${new Date(-result * 1000).toISOString().substr(17, 5)} c`
    }
    if (result < 60) {
      return `${new Date(result * 1000).toISOString().substr(17, 5)} c`
    }
    return new Date(result * 1000).toISOString().substr(14, 8)
  }
}
