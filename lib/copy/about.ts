/*
 * The plain-language description of OpenRadio, in one place so the about page
 * and the llms.txt files can never drift apart. Each answer is written to stand
 * on its own, because an assistant may quote one section without the rest.
 */

export interface AboutSection {
  title: string;
  body: string;
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    title: "What it is",
    body: "OpenRadio is an open-source way to explore live internet radio from around the world. Tune by place, mood, language or genre, describe what you want to hear, or let it surprise you.",
  },
  {
    title: "Where the stations come from",
    body: "Station listings come from Radio Browser, a free, community-maintained directory. OpenRadio does not host, record or rebroadcast any audio: your browser connects directly to each station's own stream.",
  },
  {
    title: "Your privacy",
    body: "No accounts and no tracking. Favorites and listening history are stored only in your browser. When now playing information is shown, our server reads the station's public stream metadata for you. If a visit counter is switched on, it counts page views only, with no cookies and no personal data, and its numbers are public.",
  },
  {
    title: "Culture and faith",
    body: "Stations appear under faith, culture or language only when their broadcasters tag them that way. OpenRadio never infers religion or ethnicity from a country, language or name.",
  },
  {
    title: "AI, optionally",
    body: "Discovery works with plain keywords. If the site owner configures an AI model, it may help interpret requests, but stations and streams always come from the directory, never from AI.",
  },
];
