const socket = io('http://localhost:4000'),
  messageForm = document.querySelector('.js-messageForm'),
  messageInput = messageForm.querySelector('input'),
  nicknameForm = document.querySelector('.js-nicknameForm'),
  nicknameInput = nicknameForm.querySelector('input'),
  messages = document.querySelector('ul')

const NICKNAME = 'nickname'
let nickName = localStorage.getItem(NICKNAME)

if (nickName) {
  messageForm.style.display = 'block'
} else {
  nicknameForm.style.display = 'block'
}

const handle = {
  sendMessage: event => {
    event.preventDefault()
    const message = messageInput.value
    socket.emit('new message', {
      message,
      creator: nickName
    })
    messageInput.value = ''
    handle.appendMessage(`${nickName}: ${message}`, true)
  },
  appendMessage: (message, isMine) => {
    const text = document.createElement('li')
    text.innerHTML = message
    text.classList.add(isMine ? 'mine' : 'yours')
    messages.appendChild(text)
  },
  submitNickname: event => {
    event.preventDefault()
    const nickNameFromInput = nicknameInput.value
    localStorage.setItem(NICKNAME, nickNameFromInput)
    nickName = nickNameFromInput
    nickNameFromInput.value = ''
    nicknameForm.style.display = 'none'
    messageForm.style.display = 'block'
  },
  getHistory: () => {
    fetch('/messages')
      .then(response => response.json())
      .then(data => {
        const { messages } = data
        messages.forEach(message => {
          handle.appendMessage(`${message.creator}: ${message.message}`, message.creator === nickName)
        })
      })
  }
}

handle.getHistory()
socket.on('new message notification', data => {
  const { message, creator } = data
  handle.appendMessage(`${creator}: ${message}`, false)
})

messageForm.addEventListener('submit', handle.sendMessage)
nicknameForm.addEventListener('submit', handle.submitNickname)
