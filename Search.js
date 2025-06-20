document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const sections = [
        {class: 'love-grid', items: '.love-item'},
        {class: 'anime-grid', items: '.anime-item'},
        {class: 'ln-section .scroll', items: '.ln-item'}
    ];

    sections.forEach(section => {
        const items = document.querySelectorAll(`.${section.class} ${section.items}`);
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = title.includes(searchTerm) ? 'flex' : 'none';
        });
    });
});