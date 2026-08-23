// Image URLs point at the full-resolution Wikimedia Commons originals
// rather than the on-demand "/thumb/.../NNNpx-..." resizing endpoint --
// that endpoint intermittently 503s under load, while the originals are
// served straight from stable storage. `.champion-photo` already does
// `object-fit: cover`, so no server-side resize is needed anyway.
const champions = [
  {
    id: 1,
    name: "championsList.steinitz",
    date: "(1886-1894)",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Wilhelm_Steinitz2.jpg",
    wiki: "https://en.wikipedia.org/wiki/Wilhelm_Steinitz",
  },
  {
    id: 2,
    name: "championsList.lasker",
    date: "(1894-1921)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Bundesarchiv_Bild_102-00457%2C_Emanuel_Lasker.jpg",
    wiki: "https://en.wikipedia.org/wiki/Emanuel_Lasker",
  },
  {
    id: 3,
    name: "championsList.capablanca",
    date: "(1921-1927)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Jos%C3%A9_Ra%C3%BAl_Capablanca_1931.jpg",
    wiki: "https://en.wikipedia.org/wiki/Jos%C3%A9_Ra%C3%BAl_Capablanca",
  },
  {
    id: 4,
    name: "championsList.alekhine",
    date: "(1927-1935, 1937-1946)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/AlexanderAlekhine.jpg",
    wiki: "https://en.wikipedia.org/wiki/Alexander_Alekhine",
  },
  {
    id: 5,
    name: "championsList.euwe",
    date: "(1935-1937)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/b/b5/Max_Euwe_%281945%29.jpg",
    wiki: "https://en.wikipedia.org/wiki/Max_Euwe",
  },
  {
    id: 6,
    name: "championsList.botvinnik",
    date: "(1948-1957, 1958-1960, 1961-1963)",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Botvinnik_72.jpg",
    wiki: "https://en.wikipedia.org/wiki/Mikhail_Botvinnik",
  },
  {
    id: 7,
    name: "championsList.smyslov",
    date: "(1957-1958)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/d/da/SmyslovAndAverbakh2002.jpg",
    wiki: "https://en.wikipedia.org/wiki/Vasily_Smyslov",
  },
  {
    id: 8,
    name: "championsList.tal",
    date: "(1960-1961)",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Mikhail_Tal_1982.jpg",
    wiki: "https://en.wikipedia.org/wiki/Mikhail_Tal",
  },
  {
    id: 9,
    name: "championsList.petrosian",
    date: "(1963-1969)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Tigran_Petrosjan_1961_Oberhausen.jpg",
    wiki: "https://en.wikipedia.org/wiki/Tigran_Petrosian",
  },
  {
    id: 10,
    name: "championsList.spassky",
    date: "(1969-1972)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Boris_Spasski_%281956%29_-_corrected.jpg",
    wiki: "https://en.wikipedia.org/wiki/Boris_Spassky",
  },
  {
    id: 11,
    name: "championsList.fischer",
    date: "(1972-1975)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Bobby_Fischer_1960_in_Leipzig_in_color.jpg",
    wiki: "https://en.wikipedia.org/wiki/Bobby_Fischer",
  },
  {
    id: 12,
    name: "championsList.karpov",
    date: "(1975-1985)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Karpov%2C_Anatoly_%28Flickr%29.jpg",
    wiki: "https://en.wikipedia.org/wiki/Anatoly_Karpov",
  },
  {
    id: 13,
    name: "championsList.kasparov",
    date: "(1985-2000)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/8/84/Garri_kasparow_20070318.jpg",
    wiki: "https://en.wikipedia.org/wiki/Garry_Kasparov",
  },
  {
    id: 14,
    name: "championsList.kramnik",
    date: "(2000-2007)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Vladimir_Kramnik_2005.jpg",
    wiki: "https://en.wikipedia.org/wiki/Vladimir_Kramnik",
  },
  {
    id: 15,
    name: "championsList.anand",
    date: "(2007-2013)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Viswanathan_Anand_08_14_2005.jpg",
    wiki: "https://en.wikipedia.org/wiki/Viswanathan_Anand",
  },
  {
    id: 16,
    name: "championsList.carlsen",
    date: "(2013-2023)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/Magnus_Carlsen_Tata_Steel_2013.jpg",
    wiki: "https://en.wikipedia.org/wiki/Magnus_Carlsen",
  },
  {
    id: 17,
    name: "championsList.dingLiren",
    date: "(2023-2024)",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/8a/DingLiren24a.jpg",
    wiki: "https://en.wikipedia.org/wiki/Ding_Liren",
  },
  {
    id: 18,
    name: "championsList.gukesh",
    date: "(2024-)",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Gukesh_in_2025_%28cropped%29.jpg",
    wiki: "https://en.wikipedia.org/wiki/Gukesh_Dommaraju",
  },
];

export default champions;
