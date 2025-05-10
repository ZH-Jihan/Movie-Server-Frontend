// This is a mock service that would be replaced with actual API calls in a real application

export async function getFeaturedMedia() {
  // Simulate API call
  return [
    {
      id: "movie1",
      title: "The Dark Knight",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      backdropUrl: "/placeholder.svg?height=1080&width=1920",
      rating: 9.0,
      year: 2008,
      genres: ["Action", "Crime", "Drama"],
    },
    {
      id: "series1",
      title: "Breaking Bad",
      type: "series",
      posterUrl: "/placeholder.svg?height=600&width=400",
      backdropUrl: "/placeholder.svg?height=1080&width=1920",
      rating: 9.5,
      year: 2008,
      genres: ["Crime", "Drama", "Thriller"],
    },
    {
      id: "movie2",
      title: "Inception",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      backdropUrl: "/placeholder.svg?height=1080&width=1920",
      rating: 8.8,
      year: 2010,
      genres: ["Action", "Adventure", "Sci-Fi"],
    },
  ]
}

export async function getTopRatedMedia() {
  // Simulate API call
  return [
    {
      id: "movie1",
      title: "The Shawshank Redemption",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 9.3,
      year: 1994,
    },
    {
      id: "movie2",
      title: "The Godfather",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 9.2,
      year: 1972,
    },
    {
      id: "series1",
      title: "Game of Thrones",
      type: "series",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 9.2,
      year: 2011,
    },
    {
      id: "movie3",
      title: "The Dark Knight",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 9.0,
      year: 2008,
    },
    {
      id: "series2",
      title: "Breaking Bad",
      type: "series",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 9.5,
      year: 2008,
    },
    {
      id: "movie4",
      title: "Pulp Fiction",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.9,
      year: 1994,
    },
  ]
}

export async function getNewlyAddedMedia() {
  // Simulate API call
  return [
    {
      id: "movie5",
      title: "Dune",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.0,
      year: 2021,
    },
    {
      id: "series3",
      title: "Squid Game",
      type: "series",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.1,
      year: 2021,
    },
    {
      id: "movie6",
      title: "No Time to Die",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 7.3,
      year: 2021,
    },
    {
      id: "series4",
      title: "Loki",
      type: "series",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.2,
      year: 2021,
    },
    {
      id: "movie7",
      title: "The Suicide Squad",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 7.2,
      year: 2021,
    },
  ]
}

export async function getMovieById(id: string) {
  // Simulate API call
  return {
    id,
    title: "Inception",
    type: "movie",
    posterUrl: "/placeholder.svg?height=600&width=400",
    backdropUrl: "/placeholder.svg?height=1080&width=1920",
    rating: 8.8,
    year: 2010,
    duration: "2h 28m",
    releaseDate: "July 16, 2010",
    director: "Christopher Nolan",
    synopsis:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    streamingPlatforms: ["Netflix", "Amazon Prime", "HBO Max"],
    cast: [
      {
        id: "actor1",
        name: "Leonardo DiCaprio",
        character: "Cobb",
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "actor2",
        name: "Joseph Gordon-Levitt",
        character: "Arthur",
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "actor3",
        name: "Ellen Page",
        character: "Ariadne",
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "actor4",
        name: "Tom Hardy",
        character: "Eames",
        imageUrl: "/placeholder.svg?height=200&width=200",
      },
    ],
    purchaseOptions: {
      rent: {
        price: 3.99,
        duration: "48 hours",
      },
      buy: {
        price: 14.99,
      },
    },
  }
}

export async function getRelatedMovies(id: string) {
  // Simulate API call
  return [
    {
      id: "movie8",
      title: "Interstellar",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.6,
      year: 2014,
    },
    {
      id: "movie9",
      title: "The Prestige",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.5,
      year: 2006,
    },
    {
      id: "movie10",
      title: "Tenet",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 7.4,
      year: 2020,
    },
    {
      id: "movie11",
      title: "Memento",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.4,
      year: 2000,
    },
    {
      id: "movie12",
      title: "Shutter Island",
      type: "movie",
      posterUrl: "/placeholder.svg?height=600&width=400",
      rating: 8.2,
      year: 2010,
    },
  ]
}
