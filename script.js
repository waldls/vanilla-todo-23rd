// 상태
const today = new Date()
let currentYear = today.getFullYear()
let currentMonth = today.getMonth()
let selectedDate = new Date(today)
let store = loadStoreFromStorage()

// 유틸
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

const getTodosByDate = (date) => store[dateToKey(date)] ?? []

// 스토리지
function loadStoreFromStorage() {
  try {
    const raw = localStorage.getItem('todo-store')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const saveStoreToStorage = () => {
  localStorage.setItem('todo-store', JSON.stringify(store))
}

// 렌더링
const renderTodayStatsSection = () => {
  const textEl = document.getElementById('todayStatsText')
  const percentEl = document.getElementById('todayStatsPercent')
  const fillEl = document.getElementById('todayProgressBarFill')
  const trackEl = document.getElementById('todayProgressBarTrack')
  const todos = getTodosByDate(today)
  const total = todos.length
  const done = todos.filter((t) => t.done).length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  textEl.textContent =
    total === 0 ? '오늘 할 일이 없어요' : `오늘 ${done} / ${total} 개 완료`
  percentEl.textContent = total === 0 ? '' : `${percent}%`
  fillEl.style.width = `${percent}%`
  trackEl.setAttribute('aria-valuenow', percent)
}

const renderMonthStatsSection = () => {
  const statsEl = document.getElementById('statsText')
  const fillEl = document.getElementById('progressBarFill')
  const percentEl = document.getElementById('statsPercent')
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  let total = 0
  let done = 0

  for (let i = 1; i <= daysInMonth; i++) {
    const todos = getTodosByDate(new Date(currentYear, currentMonth, i))
    total += todos.length
    done += todos.filter((t) => t.done).length
  }

  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  statsEl.textContent =
    total === 0 ? '이번 달 할일이 없어요' : `이번 달 ${done} / ${total} 개 완료`
  percentEl.textContent = total === 0 ? '' : `${percent}%`
  fillEl.style.width = `${percent}%`
}

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

  renderTodayStatsSection()
  renderMonthStatsSection()
}

const createCalendarDayButton = (date, otherMonth) => {
  const btn = document.createElement('button')
  btn.className = 'day'
  btn.textContent = String(date.getDate())
  btn.dataset.date = dateToKey(date)

  if (otherMonth) btn.classList.add('other-month')
  if (isSameDate(date, today)) btn.classList.add('today')
  if (isSameDate(date, selectedDate)) btn.classList.add('selected')
  if (getTodosByDate(date).length > 0) btn.classList.add('has-todos')

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
  const listEl = document.getElementById('todoList')
  titleEl.textContent = formatDateTitle(selectedDate)
  listEl.innerHTML = ''

  const todos = getTodosByDate(selectedDate)

  todos.forEach((todo) => {
    const li = document.createElement('li')
    li.className = 'todoItem' + (todo.done ? ' done' : '')
    li.dataset.id = String(todo.id)

    const textEl = document.createElement('p')
    textEl.className = 'todoText'
    textEl.textContent = todo.text

    const actions = document.createElement('div')
    actions.className = 'todoActions'

    const doneBtn = document.createElement('button')
    doneBtn.className = 'doneBtn'
    doneBtn.textContent = todo.done ? '취소' : '완료'
    doneBtn.addEventListener('click', () => toggleTodoDone(todo.id))

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'deleteBtn'
    deleteBtn.textContent = '삭제'
    deleteBtn.addEventListener('click', () => deleteTodoItem(todo.id))

    actions.appendChild(doneBtn)
    actions.appendChild(deleteBtn)
    li.appendChild(textEl)
    li.appendChild(actions)
    listEl.appendChild(li)
  })
}

// CRUD
const addTodoItem = (text) => {
  const key = dateToKey(selectedDate)
  if (!store[key]) store[key] = []
  store[key].push({ id: Date.now(), text: text.trim(), done: false })
  saveStoreToStorage()
  renderTodoListSection()
  renderCalendarGrid()
}

const toggleTodoDone = (id) => {
  const key = dateToKey(selectedDate)
  const todo = store[key]?.find((t) => t.id === id)
  if (todo) {
    todo.done = !todo.done
    saveStoreToStorage()
    renderTodoListSection()
    renderTodayStatsSection()
    renderMonthStatsSection()
  }
}

const deleteTodoItem = (id) => {
  const key = dateToKey(selectedDate)
  if (!store[key]) return
  store[key] = store[key].filter((t) => t.id !== id)
  if (store[key].length === 0) delete store[key]
  saveStoreToStorage()
  renderTodoListSection()
  renderCalendarGrid()
}

// 이벤트
const handleTodoAdd = () => {
  const input = document.getElementById('todoInput')
  const text = input.value.trim()
  if (!text) return
  addTodoItem(text)
  input.value = ''
  input.focus()
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

  document.getElementById('todoAddBtn').addEventListener('click', handleTodoAdd)

  document.getElementById('todoInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) handleTodoAdd()
  })
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  bindUIEvents()
  renderCalendarGrid()
  renderTodoListSection()
})
