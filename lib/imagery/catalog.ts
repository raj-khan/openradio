// Photos from Unsplash under the Unsplash License (https://unsplash.com/license).
// Stored locally in public/images. Generated during TASK-39; edit with care.

export interface ImageCredit {
  photographer: string;
  profileUrl: string;
  photoUrl: string;
}

export interface CatalogImage {
  src: string;
  alt: string;
  /** Dominant color, used as a placeholder while the photo loads. */
  color: string;
  credit: ImageCredit;
}

export interface Place {
  slug: string;
  countryCode: string;
  city: string;
  image: CatalogImage;
}

export interface Mood {
  slug: string;
  label: string;
  /** Radio Browser tag the mood links to. */
  primaryTag: string;
  /** Explicit station tags that belong to this mood. */
  tags: string[];
  blurb: string;
  image: CatalogImage;
}

export const HERO_IMAGE: CatalogImage = {
  src: "/images/moods/hero.webp",
  alt: "Brown and black radio on brown wooden table",
  color: "#400c0c",
  credit: {
    photographer: "Maximilian Hofer",
    profileUrl: "https://unsplash.com/@maxtypes",
    photoUrl: "https://unsplash.com/photos/brown-and-black-radio-on-brown-wooden-table-CbSIiGiK9sM",
  },
};

export const PLACES: Place[] = [
  {
    slug: "japan",
    countryCode: "JP",
    city: "Tokyo",
    image: {
      src: "/images/places/japan.webp",
      alt: "A narrow alleyway in tokyo at night with glowing red lanterns and illuminated signs",
      color: "#260c0c",
      credit: {
        photographer: "Denys Nevozhai",
        profileUrl: "https://unsplash.com/@dnevozhai",
        photoUrl: "https://unsplash.com/photos/alleyway-with-red-lanterns-in-tokyo-D68ADLeMh5Q",
      },
    },
  },
  {
    slug: "bangladesh",
    countryCode: "BD",
    city: "Dhaka",
    image: {
      src: "/images/places/bangladesh.webp",
      alt: "A busy street with cars and people",
      color: "#262626",
      credit: {
        photographer: "Towfiq islam",
        profileUrl: "https://unsplash.com/@filmsbytowfiq",
        photoUrl: "https://unsplash.com/photos/a-busy-street-with-cars-and-people-NFS5c0-0Bww",
      },
    },
  },
  {
    slug: "brazil",
    countryCode: "BR",
    city: "Rio de Janeiro",
    image: {
      src: "/images/places/brazil.webp",
      alt: "Aerial photography of cityscape near sea",
      color: "#f3f3f3",
      credit: {
        photographer: "Agustin Diaz Gargiulo",
        profileUrl: "https://unsplash.com/@agustindiazg",
        photoUrl:
          "https://unsplash.com/photos/aerial-photography-of-cityscape-near-sea-7F65HDP0-E0",
      },
    },
  },
  {
    slug: "france",
    countryCode: "FR",
    city: "Paris",
    image: {
      src: "/images/places/france.webp",
      alt: "Eiffel tower visible from a parisian street cafe",
      color: "#f3f3f3",
      credit: {
        photographer: "Lens by Benji",
        profileUrl: "https://unsplash.com/@lens_by_benji",
        photoUrl:
          "https://unsplash.com/photos/eiffel-tower-visible-from-a-parisian-street-cafe-SUPX5avakwA",
      },
    },
  },
  {
    slug: "nigeria",
    countryCode: "NG",
    city: "Lagos",
    image: {
      src: "/images/places/nigeria.webp",
      alt: "Aerial-photography of city",
      color: "#8ca6a6",
      credit: {
        photographer: "Namnso Ukpanah",
        profileUrl: "https://unsplash.com/@namnsoukpanah",
        photoUrl: "https://unsplash.com/photos/aerial-photography-of-city-6UqJTfoXIq8",
      },
    },
  },
  {
    slug: "india",
    countryCode: "IN",
    city: "Mumbai",
    image: {
      src: "/images/places/india.webp",
      alt: "A busy city street filled with lots of traffic",
      color: "#26260c",
      credit: {
        photographer: "Vidit Goswami",
        profileUrl: "https://unsplash.com/@viditgoswami",
        photoUrl:
          "https://unsplash.com/photos/a-busy-city-street-filled-with-lots-of-traffic-PY9LL6V-JnM",
      },
    },
  },
  {
    slug: "united-states",
    countryCode: "US",
    city: "New York",
    image: {
      src: "/images/places/united-states.webp",
      alt: "The williamsburg bridge illuminated at night with the new york city skyline behind",
      color: "#262626",
      credit: {
        photographer: "Matteo Catanese",
        profileUrl: "https://unsplash.com/@matteocatanese",
        photoUrl:
          "https://unsplash.com/photos/williamsburg-bridge-and-new-york-skyline-dVCGpKZB_E8",
      },
    },
  },
  {
    slug: "egypt",
    countryCode: "EG",
    city: "Cairo",
    image: {
      src: "/images/places/egypt.webp",
      alt: "Aerial photography of city beside body of water",
      color: "#405973",
      credit: {
        photographer: "Manuel Jim\u00e9nez",
        profileUrl: "https://unsplash.com/@mjphotovideo",
        photoUrl:
          "https://unsplash.com/photos/aerial-photography-of-city-beside-body-of-water-BiyR1kDQpoE",
      },
    },
  },
  {
    slug: "morocco",
    countryCode: "MA",
    city: "Marrakech",
    image: {
      src: "/images/places/morocco.webp",
      alt: "People walking on street during daytime",
      color: "#f3d9a6",
      credit: {
        photographer: "CALIN STAN",
        profileUrl: "https://unsplash.com/@calinstan",
        photoUrl: "https://unsplash.com/photos/people-walking-on-street-during-daytime-7a_PHX91su8",
      },
    },
  },
  {
    slug: "south-korea",
    countryCode: "KR",
    city: "Seoul",
    image: {
      src: "/images/places/south-korea.webp",
      alt: "Group of people walking on the street near buildings at night time",
      color: "#0c2640",
      credit: {
        photographer: "Ciaran O'Brien",
        profileUrl: "https://unsplash.com/@icidius",
        photoUrl:
          "https://unsplash.com/photos/group-of-people-walking-on-the-street-near-buildings-at-night-time-rHvBQyfLPjk",
      },
    },
  },
  {
    slug: "mexico",
    countryCode: "MX",
    city: "Mexico",
    image: {
      src: "/images/places/mexico.webp",
      alt: "Gray concrete road between brown concrete houses during daytime",
      color: "#a64026",
      credit: {
        photographer: "Jezael Melgoza",
        profileUrl: "https://unsplash.com/@jezar",
        photoUrl:
          "https://unsplash.com/photos/gray-concrete-road-between-brown-concrete-houses-during-daytime-QfBRBEKj76E",
      },
    },
  },
  {
    slug: "united-kingdom",
    countryCode: "GB",
    city: "London",
    image: {
      src: "/images/places/united-kingdom.webp",
      alt: "A bridge with a clock tower",
      color: "#0c2626",
      credit: {
        photographer: "Dan Lynn",
        profileUrl: "https://unsplash.com/@danlynn",
        photoUrl: "https://unsplash.com/photos/a-bridge-with-a-clock-tower-dXA0_iWubTM",
      },
    },
  },
  {
    slug: "germany",
    countryCode: "DE",
    city: "Berlin",
    image: {
      src: "/images/places/germany.webp",
      alt: "Time-lapse photography of vehicle at the road in between the building at nighttime aerial photography",
      color: "#0c2626",
      credit: {
        photographer: "Stephan Widua",
        profileUrl: "https://unsplash.com/@stewi",
        photoUrl:
          "https://unsplash.com/photos/time-lapse-photography-of-vehicle-at-the-road-in-between-the-building-at-nighttime-aerial-photography-iPOZf3tQfHA",
      },
    },
  },
  {
    slug: "turkey",
    countryCode: "TR",
    city: "Istanbul",
    image: {
      src: "/images/places/turkey.webp",
      alt: "A bridge over a river with a city in the background",
      color: "#c0c0d9",
      credit: {
        photographer: "Osman \u00d6zavc\u0131",
        profileUrl: "https://unsplash.com/@osman23",
        photoUrl:
          "https://unsplash.com/photos/a-bridge-over-a-river-with-a-city-in-the-background-OS4m30K7KeI",
      },
    },
  },
  {
    slug: "indonesia",
    countryCode: "ID",
    city: "Jakarta",
    image: {
      src: "/images/places/indonesia.webp",
      alt: "City with high-rise buildings during night time",
      color: "#f3c0a6",
      credit: {
        photographer: "Blunimo Digital",
        profileUrl: "https://unsplash.com/@blunimodigital",
        photoUrl:
          "https://unsplash.com/photos/city-with-high-rise-buildings-during-night-time-Qq0tmcUrOTM",
      },
    },
  },
  {
    slug: "cuba",
    countryCode: "CU",
    city: "Havana",
    image: {
      src: "/images/places/cuba.webp",
      alt: "A group of people standing around a red car",
      color: "#594026",
      credit: {
        photographer: "Dylan Shaw",
        profileUrl: "https://unsplash.com/@dylanshaw",
        photoUrl:
          "https://unsplash.com/photos/a-group-of-people-standing-around-a-red-car-wWS5L6a70Mg",
      },
    },
  },
];

export const MOODS: Mood[] = [
  {
    slug: "chill",
    label: "Chill",
    primaryTag: "lounge",
    tags: ["lounge", "chillout", "ambient", "chill"],
    blurb: "Slow mornings and soft sound",
    image: {
      src: "/images/moods/chill.webp",
      alt: "Mountain near body of water during daytime",
      color: "#d9d9d9",
      credit: {
        photographer: "Neil Thomas",
        profileUrl: "https://unsplash.com/@neilthomas",
        photoUrl:
          "https://unsplash.com/photos/mountain-near-body-of-water-during-daytime-dGyshquBzOc",
      },
    },
  },
  {
    slug: "jazz",
    label: "Jazz",
    primaryTag: "jazz",
    tags: ["jazz", "smooth jazz", "swing"],
    blurb: "Late night sets and smoky rooms",
    image: {
      src: "/images/moods/jazz.webp",
      alt: "A man playing a saxophone in a dark room",
      color: "#260c26",
      credit: {
        photographer: "Denny M\u00fcller",
        profileUrl: "https://unsplash.com/@redaquamedia",
        photoUrl:
          "https://unsplash.com/photos/a-man-playing-a-saxophone-in-a-dark-room-z_disLOcoKM",
      },
    },
  },
  {
    slug: "news-talk",
    label: "News & Talk",
    primaryTag: "news",
    tags: ["news", "talk", "public radio"],
    blurb: "Voices from around the world",
    image: {
      src: "/images/moods/news-talk.webp",
      alt: "Bokeh photography of condenser microphone",
      color: "#260c0c",
      credit: {
        photographer: "israel palacio",
        profileUrl: "https://unsplash.com/@othentikisra",
        photoUrl:
          "https://unsplash.com/photos/bokeh-photography-of-condenser-microphone-Y20JJ_ddy9M",
      },
    },
  },
  {
    slug: "classical",
    label: "Classical",
    primaryTag: "classical",
    tags: ["classical", "orchestra", "opera"],
    blurb: "Concert halls, live and local",
    image: {
      src: "/images/moods/classical.webp",
      alt: "People watching orchestra",
      color: "#260c0c",
      credit: {
        photographer: "Manuel N\u00e4geli",
        profileUrl: "https://unsplash.com/@gwundrig",
        photoUrl: "https://unsplash.com/photos/people-watching-orchestra-p60mNTW5glI",
      },
    },
  },
  {
    slug: "electronic",
    label: "Electronic",
    primaryTag: "electronic",
    tags: ["electronic", "dance", "house", "techno"],
    blurb: "Club nights on every continent",
    image: {
      src: "/images/moods/electronic.webp",
      alt: "People gathering in event during night time",
      color: "#260c73",
      credit: {
        photographer: "A J.",
        profileUrl: "https://unsplash.com/@antoinejulien",
        photoUrl:
          "https://unsplash.com/photos/people-gathering-in-event-during-night-time-FNieWqIDsJA",
      },
    },
  },
  {
    slug: "rock",
    label: "Rock",
    primaryTag: "rock",
    tags: ["rock", "classic rock", "alternative"],
    blurb: "Loud, live and unfiltered",
    image: {
      src: "/images/moods/rock.webp",
      alt: "Selective focus photography of man playing electric guitar on stage",
      color: "#0c2673",
      credit: {
        photographer: "Marcus Neto",
        profileUrl: "https://unsplash.com/@marcusneto",
        photoUrl:
          "https://unsplash.com/photos/selective-focus-photography-of-man-playing-electric-guitar-on-stage-gioH4gHo0-g",
      },
    },
  },
  {
    slug: "lofi",
    label: "Lo-fi",
    primaryTag: "lofi",
    tags: ["lofi", "lo-fi", "chillhop"],
    blurb: "Rain on the window, beats on repeat",
    image: {
      src: "/images/moods/lofi.webp",
      alt: "A window with rain drops on it at night",
      color: "#262626",
      credit: {
        photographer: "Max van den Oetelaar",
        profileUrl: "https://unsplash.com/@maxvdo",
        photoUrl: "https://unsplash.com/photos/a-window-with-rain-drops-on-it-at-night-1e60bqR1Ar0",
      },
    },
  },
  {
    slug: "hip-hop",
    label: "Hip Hop",
    primaryTag: "hiphop",
    tags: ["hiphop", "hip hop", "rap"],
    blurb: "Street sounds from every city",
    image: {
      src: "/images/moods/hip-hop.webp",
      alt: "Blue and multicolored graffitti wall",
      color: "#d9f3f3",
      credit: {
        photographer: "Char Beck",
        profileUrl: "https://unsplash.com/@charbeck",
        photoUrl: "https://unsplash.com/photos/blue-and-multicolored-graffitti-wall-AY8Rh-K5b4g",
      },
    },
  },
  {
    slug: "world",
    label: "Folk & Traditional",
    primaryTag: "folk",
    tags: ["folk", "traditional", "world music"],
    blurb: "Heritage sounds, local voices",
    image: {
      src: "/images/moods/world.webp",
      alt: "Person tapping on traditional drum instrument",
      color: "#c0a68c",
      credit: {
        photographer: "Caleb Toranzo",
        profileUrl: "https://unsplash.com/@toranzocaleb",
        photoUrl:
          "https://unsplash.com/photos/person-tapping-on-traditional-drum-instrument-xD8DPNDYG6E",
      },
    },
  },
  {
    slug: "faith",
    label: "Faith & Spirituality",
    primaryTag: "religious",
    tags: ["religious", "christian", "gospel", "islamic", "quran", "spiritual"],
    blurb: "Stations that tag themselves as faith radio",
    image: {
      src: "/images/moods/faith.webp",
      alt: "Sunset sky with clouds and rays",
      color: "#8ca6c0",
      credit: {
        photographer: "Diego PH",
        profileUrl: "https://unsplash.com/@jdiegoph",
        photoUrl: "https://unsplash.com/photos/sunset-sky-with-clouds-and-rays-vTitvl4O2kE",
      },
    },
  },
  {
    slug: "oldies",
    label: "Oldies",
    primaryTag: "oldies",
    tags: ["oldies", "80s", "70s", "60s", "retro"],
    blurb: "Decades that never went away",
    image: {
      src: "/images/moods/oldies.webp",
      alt: "Gray turntable playing",
      color: "#262626",
      credit: {
        photographer: "Travis Yewell",
        profileUrl: "https://unsplash.com/@shutters_guild",
        photoUrl: "https://unsplash.com/photos/gray-turntable-playing-F-B7kWlkxDQ",
      },
    },
  },
  {
    slug: "pop",
    label: "Pop",
    primaryTag: "pop",
    tags: ["pop", "top 40", "hits"],
    blurb: "The hits, in every language",
    image: {
      src: "/images/moods/pop.webp",
      alt: "Stage light front of audience",
      color: "#404040",
      credit: {
        photographer: "Yvette de Wit",
        profileUrl: "https://unsplash.com/@yvettedewit",
        photoUrl: "https://unsplash.com/photos/stage-light-front-of-audience-NYrVisodQ2M",
      },
    },
  },
  {
    slug: "latin",
    label: "Latin",
    primaryTag: "latin",
    tags: ["latin", "salsa", "reggaeton", "cumbia"],
    blurb: "Rhythm from the Americas and beyond",
    image: {
      src: "/images/moods/latin.webp",
      alt: "Women in green and brown dress dancing",
      color: "#260c0c",
      credit: {
        photographer: "Jennie Clavel",
        profileUrl: "https://unsplash.com/@ohpeach_33",
        photoUrl: "https://unsplash.com/photos/women-in-green-and-brown-dress-dancing-X7O48jBHzVI",
      },
    },
  },
];

export function placeForCountry(code?: string): Place | undefined {
  if (!code) return undefined;
  return PLACES.find((place) => place.countryCode === code.toUpperCase());
}

export function moodForTag(tag?: string): Mood | undefined {
  if (!tag) return undefined;
  const normalized = tag.toLowerCase();
  return MOODS.find((mood) => mood.tags.includes(normalized));
}

export function moodBySlug(slug: string): Mood | undefined {
  return MOODS.find((mood) => mood.slug === slug);
}

/** Every image with its credit, for the About page. */
export function allImages(): CatalogImage[] {
  return [HERO_IMAGE, ...PLACES.map((p) => p.image), ...MOODS.map((m) => m.image)];
}
