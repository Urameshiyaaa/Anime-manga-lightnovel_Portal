document.querySelectorAll('#category-list li').forEach(function(li) {
    li.addEventListener('click', function(e) {
        e.preventDefault();
        const genre = this.getAttribute('data-genre').toLowerCase();

        ['.anime-item', '.ln-item'].forEach(selector => {
        document.querySelectorAll(selector).forEach(item => {
            const genres = (item.getAttribute('data-genres') || '').toLowerCase();
            if (genres.includes(genre)) {
            item.style.display = '';
            } 
            else {
            item.style.display = 'none';
            }
        });
        });
    });
    });