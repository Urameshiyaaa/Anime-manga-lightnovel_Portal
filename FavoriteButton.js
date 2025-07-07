function jsFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]')
}
function jsonFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites))
}


function Information(item) {
    const h3 = item.querySelector('h3')
    const a = h3.querySelector('a')
    return {
        name: a.textContent.trim(),
        link: a.href,
        img: item.querySelector('img').src,
        type: item.classList.contains('ln-item') ? 'ln'
            : item.closest('.manga-section') ? 'manga'
            : 'anime'
    }
}


function statusButtons() {
    const calljsF = jsFavorites()
    document.querySelectorAll('.add-button').forEach( bt => {
        const item = bt.closest('.anime-item, .ln-item')
        const info = Information(item)
        
        const existFavorite = calljsF.some( favorite => favorite.name === info.name && favorite.type === info.type)
        if (existFavorite) {
            bt.textContent = 'Gỡ'
            bt.classList.add('remove')
        } 
        else {
            bt.textContent = 'Yêu thích'
            bt.classList.remove('remove')
        }
    })
}


document.addEventListener('click', function(b) {
    if (b.target.classList.contains('add-button')) {
        const item = b.target.closest('.anime-item, .ln-item')
        const info = Information(item)

        let calljsF = jsFavorites()
        const position = calljsF.findIndex( favorite => favorite.name === info.name && favorite.type === info.type)
        if (position !== -1) {
            calljsF.splice(position, 1)
        } 
        else{
            calljsF.push(info)
        }
        jsonFavorites(calljsF)
        statusButtons()
    }
})

document.addEventListener('DOMContentLoaded', statusButtons)