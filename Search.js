x = document.getElementById('searchBar')
x.addEventListener('input', function(a){
    const searchWord = a.target.value.toLowerCase()

    const sections = [
        {class: 'anime-grid', items: '.anime-item'},
        {class: 'scroll', items: '.ln-item'},
        {class: 'manga-grid', items: '.anime-item'}
    ]
    sections.forEach( section => {
        const b = document.querySelectorAll(`.${section.class} ${section.items}`)
        b.forEach( item => {
            const title = item.querySelector('h3').textContent.toLowerCase()
            if (title.includes(searchWord)) {
                item.style.display = 'flex'
            }
            else{
                item.style.display = 'none'
            }
        })
    })
})