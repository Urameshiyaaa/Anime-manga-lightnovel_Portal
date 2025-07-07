function showNotification() {
    const notif = document.createElement('div')
    notif.className = 'notif'
    notif.textContent = 'Ko có thông tin gì mới'
    document.body.append(notif)

    setTimeout( () => {notif.classList.add('show')}, 100)
    setTimeout( () => {notif.classList.remove('show')}, 2000)
}