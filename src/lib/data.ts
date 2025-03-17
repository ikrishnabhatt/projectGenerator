
export interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  genre: string;
  duration: string;
  year: number;
  rating: string;
}

export interface Category {
  id: string;
  name: string;
  movies: Movie[];
}

export const featuredMovie: Movie = {
  id: "featured-1",
  title: "Stranger Things",
  description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
  imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2812&auto=format&fit=crop",
  thumbnailUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=500&auto=format&fit=crop", 
  genre: "Sci-Fi & Fantasy",
  duration: "50m",
  year: 2016,
  rating: "TV-14"
};

export const categories: Category[] = [
  {
    id: "trending",
    name: "Trending Now",
    movies: [
      {
        id: "movie-1",
        title: "The Crown",
        description: "This drama follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
        imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=250&auto=format&fit=crop",
        genre: "Drama",
        duration: "58m",
        year: 2016,
        rating: "TV-MA"
      },
      {
        id: "movie-2",
        title: "Money Heist",
        description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
        imageUrl: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=250&auto=format&fit=crop",
        genre: "Crime",
        duration: "45m",
        year: 2017,
        rating: "TV-MA"
      },
      {
        id: "movie-3",
        title: "The Queen's Gambit",
        description: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
        imageUrl: "https://images.unsplash.com/photo-1637419375714-378ff573b842?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1637419375714-378ff573b842?q=80&w=250&auto=format&fit=crop",
        genre: "Drama",
        duration: "1h",
        year: 2020,
        rating: "TV-MA"
      },
      {
        id: "movie-4",
        title: "Ozark",
        description: "A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.",
        imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=250&auto=format&fit=crop",
        genre: "Crime",
        duration: "1h",
        year: 2017,
        rating: "TV-MA"
      },
      {
        id: "movie-5",
        title: "Dark",
        description: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
        imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=250&auto=format&fit=crop",
        genre: "Sci-Fi & Fantasy",
        duration: "52m",
        year: 2017,
        rating: "TV-MA"
      }
    ]
  },
  {
    id: "popular",
    name: "Popular on Netflix",
    movies: [
      {
        id: "movie-6",
        title: "Breaking Bad",
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
        imageUrl: "https://images.unsplash.com/photo-1482164565953-04b62dcac1cd?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1482164565953-04b62dcac1cd?q=80&w=250&auto=format&fit=crop",
        genre: "Crime",
        duration: "45m",
        year: 2008,
        rating: "TV-MA"
      },
      {
        id: "movie-7",
        title: "Narcos",
        description: "The true story of Colombia's infamously violent and powerful drug cartels fuels this gritty gangster drama series.",
        imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=250&auto=format&fit=crop",
        genre: "Crime",
        duration: "50m",
        year: 2015,
        rating: "TV-MA"
      },
      {
        id: "movie-8",
        title: "Peaky Blinders",
        description: "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost.",
        imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=250&auto=format&fit=crop",
        genre: "Drama",
        duration: "1h",
        year: 2013,
        rating: "TV-MA"
      },
      {
        id: "movie-9",
        title: "Black Mirror",
        description: "This anthology series explores a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
        imageUrl: "https://images.unsplash.com/photo-1601406878693-b6db00bc3dac?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1601406878693-b6db00bc3dac?q=80&w=250&auto=format&fit=crop",
        genre: "Sci-Fi & Fantasy",
        duration: "1h",
        year: 2011,
        rating: "TV-MA"
      },
      {
        id: "movie-10",
        title: "The Witcher",
        description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
        imageUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=250&auto=format&fit=crop",
        genre: "Sci-Fi & Fantasy",
        duration: "1h",
        year: 2019,
        rating: "TV-MA"
      }
    ]
  },
  {
    id: "mylist",
    name: "My List",
    movies: [
      {
        id: "movie-11",
        title: "Mindhunter",
        description: "In the late 1970s, two FBI agents expand criminal science by delving into the psychology of murder and getting uneasily close to all-too-real monsters.",
        imageUrl: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=250&auto=format&fit=crop",
        genre: "Crime",
        duration: "50m",
        year: 2017,
        rating: "TV-MA"
      },
      {
        id: "movie-12",
        title: "Bodyguard",
        description: "After helping thwart a terrorist attack, a war veteran is assigned to protect a politician who was a main proponent of the conflict he fought in.",
        imageUrl: "https://images.unsplash.com/photo-1626195830080-2a8ee68b3831?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1626195830080-2a8ee68b3831?q=80&w=250&auto=format&fit=crop",
        genre: "Thriller",
        duration: "1h",
        year: 2018,
        rating: "TV-MA"
      },
      {
        id: "movie-13",
        title: "The Umbrella Academy",
        description: "A dysfunctional family of adopted superhero siblings reunite to solve the mystery of their father's death and the threat of an impending apocalypse.",
        imageUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=250&auto=format&fit=crop",
        genre: "Sci-Fi & Fantasy",
        duration: "1h",
        year: 2019,
        rating: "TV-14"
      },
      {
        id: "movie-14",
        title: "You",
        description: "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by.",
        imageUrl: "https://images.unsplash.com/photo-1600508098941-e9e5890917b6?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1600508098941-e9e5890917b6?q=80&w=250&auto=format&fit=crop",
        genre: "Crime",
        duration: "45m",
        year: 2018,
        rating: "TV-MA"
      },
      {
        id: "movie-15",
        title: "Altered Carbon",
        description: "After 250 years on ice, a prisoner returns to life in a new body with one chance to win his freedom: by solving a mind-bending murder.",
        imageUrl: "https://images.unsplash.com/photo-1530509297302-566e78a082a5?q=80&w=500&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1530509297302-566e78a082a5?q=80&w=250&auto=format&fit=crop",
        genre: "Sci-Fi & Fantasy",
        duration: "1h",
        year: 2018,
        rating: "TV-MA"
      }
    ]
  }
];
