const slides = [
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6e8e5494-02de-4297-a5a0-25e0942701b0/d6lwrak-ec59173e-5d85-4a47-a795-2b6ce5c49dfd.png/v1/fill/w_1192,h_670/anime_world_by_manga_ar_d6lwrak-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4MCIsInBhdGgiOiJcL2ZcLzZlOGU1NDk0LTAyZGUtNDI5Ny1hNWEwLTI1ZTA5NDI3MDFiMFwvZDZsd3Jhay1lYzU5MTczZS01ZDg1LTRhNDctYTc5NS0yYjZjZTVjNDlkZmQucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.U4o4G1_7HAM79FgCVeOjprsP2cLTU41RvZd1qOj3Ih4",
    "https://wallpaperaccess.com/full/2444471.jpg",
    "https://img.goodfon.com/wallpaper/big/3/1b/ochki-za-graniu-devushka-forma-anime-kuriyama-mirai-kyoukai.webp"
];
const slide = document.querySelector('.slide img')
s = 0;
function showSlide(n){
    s = (n + slides.length) % slides.length;
    slide.src = slides[s];
}
document.getElementById('prev').addEventListener('click', function(){
    showSlide(s-1)
    document.getElementById('prev').style.backgroundColor = "#d7d7d7";
    document.getElementById('next').style.backgroundColor = "#2a2a2a";
});
document.getElementById('next').addEventListener('click', function(){
    showSlide(s+1)
    document.getElementById('prev').style.backgroundColor = "#2a2a2a";
    document.getElementById('next').style.backgroundColor = "#d7d7d7";

});
showSlide(s);