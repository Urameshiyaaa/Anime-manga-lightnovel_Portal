const animeList = [
  {
    img: "https://i1.sndcdn.com/artworks-000102584894-8rr4kl-t240x240.jpg",
    alt: "Lời nói dối tháng tư",
    link: "https://animevietsub.lol/phim/thang-tu-la-loi-noi-doi-cua-em-i1-a2432/",
    name: "Shigatsu kimi no uso (Lời nói dối tháng tư)",
    genres: "romcom, school life"
  },
  {
    img: "https://lede-admin.aftermath.site/wp-content/uploads/sites/55/2025/03/Solo-Leveling-Crunchyroll-Anime-A1-Pictures.jpg?resize=2880%2C1620",
    alt: "Tôi thăng cấp 1 mình",
    link: "https://animevietsub.lol/phim/solo-leveling-2nd-i6-a5381/",
    name: "Solo Leveling (Tôi thăng cấp một mình)",
    genres: "action, mystery"
  },
  {
    img: "https://static.minhtuanmobile.com/uploads/editer/2025-03/06/images/lich-chieu-thanh-guom-diet-quy-vo-han-thanh-tai-viet-nam-1.webp",
    alt: "Thanh gươm diệt quỷ",
    link: "https://animevietsub.lol/phim/thanh-guom-diet-quy-dai-tru-dac-huan-i4-a5257/",
    name: "Kimetsu no yaiba (Thanh gươm diệt quỷ)",
    genres: "action, shounen"
  },
  {
    img: "https://wibu.com.vn/wp-content/uploads/2024/09/one-piece.jpg",
    alt: "",
    link: "https://animevietsub.lol/phim/dao-hai-tac-one-piece-a1/",
    name: "One piece",
    genres: "action, shounen, mystery"
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/vi/4/4f/Dragon_Ball_Super_artwork.jpg",
    alt: "7 viên ngọc rồng siêu cấp",
    link: "https://animehay.tax/thong-tin-phim/dragon-ball-super-3.html",
    name: "Dragon Ball Super",
    genres: ""
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BMzcxNDU3NGYtZDNiNi00NDUwLWI4NDctNmJjZGVjMzFkNTI3XkEyXkFqcGc@._V1_.jpg",
    alt: "Bí mật tình yêu nơi công sở",
    link: "https://animevietsub.lol/phim/kono-kaisha-ni-suki-na-hito-ga-imasu-a5515/",
    name: "Kono Kaisha ni Suki na Hito ga Imasu (Bí mật tình yêu nơi công sở)",
    genres: "romcom"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BZjc4ZGZkNjMtZTRkYS00Mjk4LTgwMzAtMzg1MWZlZjcxNDRhXkEyXkFqcGc@._V1_.jpg",
    alt: "Khiên hiệp sĩ",
    link: "https://animevietsub.lol/phim/tate-no-yuusha-no-nariagari-season-3-a4901/",
    name: "Tate no yuusha no nariagari (Khiên hiệp sĩ)",
    genres: "action, isekai"
  },
  {
    img: "https://i.ebayimg.com/images/g/beIAAOSwUtdiT~ar/s-l1200.jpg",
    alt: "Từ tầm thường đến bất khả chiến bại",
    link: "https://animevietsub.lol/phim/arifureta-shokugyou-de-sekai-saikyou-3rd-season-a5382/",
    name: "Arifureta Shokugyou de Sekai Saikyou (Từ tầm thường đến bất khả chiến bại)",
    genres: "action, isekai"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BMjJlZTI4MzEtNTE3MS00ZTM4LWIwZTktMDg2ODc5MjcwYmQxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    alt: "Fairy tail: Nhiệm vụ 100 năm",
    link: "https://animevietsub.lol/phim/fairy-tail-100-nen-quest-a5268/",
    name: "Fairy Tail: 100 Years Quest (Fairy tail: Nhiệm vụ 100 năm)",
    genres: "action, shounen"
  },
  {
    img: "https://cdn.animenewsnetwork.com/hotlink/thumbnails/max600x600/cms/news.7/215183/keyvisual_englishlogo.jpg",
    alt: "Nhà có 5 nàng dâu",
    link: "https://animevietsub.lol/phim/5-toubun-no-hanayome-movie-a4247/",
    name: "Gotoubun no Hanayome (Nhà có 5 nàng dâu)",
    genres: "romcom, school life, harem"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BNTk3MDA1ZjAtNTRhYS00YzNiLTgwOGEtYWRmYTQ3NjA0NTAwXkEyXkFqcGc@._V1_.jpg",
    alt: "Naruto",
    link: "https://animevietsub.lol/phim/naruto-suc-manh-vi-thu-r2-a5/",
    name: "Naruto Shippuden",
    genres: "action, shounen"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BNzVjOWEwYjEtNDJhOC00YjUyLThjMWItMDQwZGY1ODM4YzI3XkEyXkFqcGc@._V1_.jpg",
    alt: "Attack on Titan",
    link: "https://animevietsub.lol/phim/attack-on-titan-the-last-attack-a5481/",
    name: "Shingeki no Kyojin (Attack on Titan)",
    genres: "action, shounen, mystery"
  },
  {
    img: "https://www.anmosugoi.com/wp-content/uploads/2025/01/Otonari-no-Tenshi-sama-ni-Itsunomanika-Dame-Ningen-ni-Sareteita-Ken-anime-visual.webp",
    alt: "Thiên sứ nhà bên",
    link: "https://animevietsub.lol/phim/otonari-no-tenshi-sama-ni-itsunomanika-dame-ningen-ni-sareteita-ken-a4662/",
    name: "Otonari no Tenshi-sama (Thiên sứ nhà bên)",
    genres: "romcom, school life, slice of life"
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_2VYSK3Wq4lhYjhsKqELZ9DgB_VzzuVI56Kr7qjk1uQ&s&ec=72940545",
    alt: "Arya bàn bên trêu ghẹo tôi bằng tiếng Nga",
    link: "https://animevietsub.lol/phim/tokidoki-bosotto-russia-go-de-dereru-tonari-no-alya-san-a4929/",
    name: "Tokidoki Bosotto Roshia-go de Dereru Tonari no Arya-san (Arya bàn bên trêu ghẹo tôi bằng tiếng Nga)",
    genres: "romcom, school life, slice of life"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BM2Q1NDI4ZjItOTkzNC00YzI2LTk0ODgtMTk2MjJhMjNjMjM0XkEyXkFqcGc@._V1_.jpg",
    alt: "Chú thuật hồi chiến",
    link: "https://animevietsub.lol/phim/jujutsu-kaisen-2nd-season-i5-a4467/",
    name: "Jujutsu Kaisen (Chú thuật hồi chiến)",
    genres: "action, shounen"
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png",
    alt: "Your name",
    link: "https://animevietsub.lol/phim/ten-cau-la-gi-a1493/",
    name: "Kimi no Na wa (Your name)",
    genres: "romcom, school life, slice of life"
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzvyjhWeL3E1W7lKLAPo5-WA5Y6L0HiSESyRdSAnuYWw&s&ec=72940545",
    alt: "Yamada và 7 phù thủy",
    link: "https://animevietsub.lol/phim/yamada-va-that-dai-ma-nu-a2021/",
    name: "Yamada kun to 7 nin no majo (Yamada và 7 phù thủy)",
    genres: "romcom, school life, mystery"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BNDA2MDRhNTEtMjU4NC00MzZjLWJjM2UtZDg4MWI5OWU3ZjEwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    alt: "",
    link: "https://animevietsub.lol/phim/wind-breaker-2nd-season-a5592/",
    name: "Wind Breaker",
    genres: "action, school life"
  },
  {
    img: "https://pics.filmaffinity.com/nisekoi-610804523-mmed.jpg",
    alt: "Tình yêu giả tạo",
    link: "https://animehay.tax/thong-tin-phim/nisekoi-ss1-223.html",
    name: "Nisekoi (Tình yêu giả tạo)",
    genres: "romcom, school life"
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/vi/c/c6/Koe_no_Katachi_Film_Poster.jpg",
    alt: "Dáng hình thanh âm",
    link: "https://animehay.tax/thong-tin-phim/koe-no-katachi-1562.html",
    name: "Koe no Katachi (Dáng hình thanh âm)",
    genres: "slice of life, school life"
  },
  {
    img: "https://pics.filmaffinity.com/kimi_no_suizo_wo_tabetai-287102864-large.jpg",
    alt: "Tớ muốn ăn tụy của cậu",
    link: "https://animehay.tax/thong-tin-phim/kimi-no-suizou-wo-tabetai-2707.html",
    name: "Kimi no Suizou wo Tabetai (Tớ muốn ăn tụy của cậu)",
    genres: "school life, slice of life"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BY2MzZGVhZTgtNWZlYi00NGI5LTk5N2QtYTkzMzNkMWM0NjBhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    alt: "Học viện ma vương",
    link: "https://animehay.tax/thong-tin-phim/maou-gakuin-no-futekigousha-shijou-saikyou-no-maou-no-shiso-tensei-shite-shison-tachi-no-gakkou-e-kayou-ii-3681.html",
    name: "Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e Kayou (Học viện ma vương)",
    genres: "action"
  },
  {
    img: "https://m.media-amazon.com/images/M/MV5BYjlhNGU3MjgtM2U0ZC00YTA1LTk1NWMtNzA1ODZjODRmZWVhXkEyXkFqcGc@._V1_.jpg",
    alt: "Lớp học điệp viên",
    link: "https://animehay.tax/thong-tin-phim/spy-kyoushitsu-3671.html",
    name: "Spy Kyoushitsu (Lớp học điệp viên)",
    genres: "action"
  },
  {
    img: "https://static2.vieon.vn/vieplay-image/poster_v4/2022/05/20/d4ppmz00_660x946-spyxfamily-demoa2731c005ce704ec40c7ff515b2b1afb.jpg",
    alt: "Gia đình điệp viên",
    link: "https://animehay.tax/thong-tin-phim/spy-x-family-3489.html",
    name: "Spy x Family (Gia đình điệp viên)",
    genres: "slice of life, school life"
  }
];