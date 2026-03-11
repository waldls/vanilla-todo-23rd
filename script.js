const today = new Date()
let currentYear = today.getFullYear()
let currentMonth = today.getMonth()
let selectedDate = new Date(today)

const dateToKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatDateTitle = (date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`

const isSameDate = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const renderCalendarGrid = () => {
  const titleEl = document.getElementById('calendarTitle')
  const daysEl = document.getElementById('calendarDays')
  titleEl.textContent = `${currentYear}년 ${currentMonth + 1}월`
  daysEl.innerHTML = ''

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate()
  const prevLastDate = new Date(currentYear, currentMonth, 0).getDate()

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1, prevLastDate - i)
    daysEl.appendChild(createCalendarDayButton(d, true))
  }

  for (let i = 1; i <= lastDate; i++) {
    const d = new Date(currentYear, currentMonth, i)
    daysEl.appendChild(createCalendarDayButton(d, false))
  }

  const total = firstDay + lastDate
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7)
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(currentYear, currentMonth + 1, i)
    daysEl.appendChild(createCalendarDayButton(d, true))
  }
}

const createCalendarDayButton = (date, otherMonth) => {
  const btn = document.createElement('button')
  btn.className = 'day'
  btn.textContent = String(date.getDate())
  btn.dataset.date = dateToKey(date)

  if (otherMonth) btn.classList.add('other-month')
  if (isSameDate(date, today)) btn.classList.add('today')
  if (isSameDate(date, selectedDate)) btn.classList.add('selected')

  btn.addEventListener('click', () => {
    selectedDate = date
    if (otherMonth) {
      currentYear = date.getFullYear()
      currentMonth = date.getMonth()
      renderCalendarGrid()
    } else {
      document
        .querySelectorAll('.day')
        .forEach((el) => el.classList.remove('selected'))
      btn.classList.add('selected')
    }
    renderTodoListSection()
  })

  return btn
}

const renderTodoListSection = () => {
  const titleEl = document.getElementById('selectedDateTitle')
  titleEl.textContent = formatDateTitle(selectedDate)
}

const bindUIEvents = () => {
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    renderCalendarGrid()
  })

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    renderCalendarGrid()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  bindUIEvents()
  renderCalendarGrid()
  renderTodoListSection()
})
