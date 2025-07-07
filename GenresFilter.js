x = document.querySelectorAll('#category-list li')
x.forEach( function(li){
    li.addEventListener('click', function(a){
        const genres = this.getAttribute('data-genre').toLowerCase()

        b = ['.anime-item', '.ln-item']
        b.forEach( items => {
            c = document.querySelectorAll(items)
            c.forEach( item => {
                const genre = item.getAttribute('data-genres').toLowerCase()
                if (genre.includes(genres)){
                    item.style.display = ''
                }
                else{
                    item.style.display = 'none'
                }
            })
        })
    })
})