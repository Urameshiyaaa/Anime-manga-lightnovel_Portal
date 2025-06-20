let comments = JSON.parse(localStorage.getItem('comments')) || [];

function postComment() {
    const commentInput = document.getElementById('cmtInput');
    const commentText = commentInput.value.trim();

    if (commentText === '') {
        alert('Vui lòng nhập nội dung bình luận!');
        return;
    }

    const newComment = {
        id: Date.now(),
        username: 'Người dùng ẩn danh',
        text: commentText,
        time: new Date().toLocaleString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    commentInput.value = '';
    renderComments();
}

function deleteComment(id) {
    comments = comments.filter(comment => comment.id !== id);
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments();
}

function renderComments() {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'post';
        commentElement.style.marginTop = '10px';
        commentElement.innerHTML = `
            <div class="post-header">
                <img src="https://via.placeholder.com/40" alt="Avatar" class="avatar">
                <span class="username">${comment.username}</span>
                <span class="time">${comment.time}</span>
                <button class="delete-bt" onclick="deleteComment(${comment.id})">Xóa</button>
            </div>
            <div class="post-content">${comment.text}</div>
        `;
        commentList.appendChild(commentElement);
    });
}
document.addEventListener('DOMContentLoaded', renderComments);











