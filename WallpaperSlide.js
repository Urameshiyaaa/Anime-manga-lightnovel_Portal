const slides = [
    "Illustration/anime_world.png",
    "Illustration/Kimi no suizo wo tabetai.jpg",
    "Illustration/kyoukai-no-kanata-mirai-kuriyama.jpg"
]
const slide = document.querySelector('.slide img')
s = 0
function showSlide(n){
    s = (n + slides.length) % slides.length
    slide.src = slides[s]
}
document.getElementById('prev').addEventListener('click', function(){
    showSlide(s-1)
    document.getElementById('prev').style.backgroundColor = "#d7d7d7"
    document.getElementById('next').style.backgroundColor = "#2a2a2a"
})
document.getElementById('next').addEventListener('click', function(){
    showSlide(s+1)
    document.getElementById('prev').style.backgroundColor = "#2a2a2a"
    document.getElementById('next').style.backgroundColor = "#d7d7d7"

})
showSlide(s)