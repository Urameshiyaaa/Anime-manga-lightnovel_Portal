function showNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Ko có thông tin gì mới';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}