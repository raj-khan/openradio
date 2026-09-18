/*
 * Questions people actually ask, with answers written to survive being quoted
 * on their own: an assistant will lift one answer without the page around it,
 * so each says who it is about and never leans on the question or its
 * neighbours for context. This is the single source for both the rendered page
 * and its FAQPage structured data, so the two cannot disagree.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is OpenRadio free?",
    answer:
      "Yes. OpenRadio is free to use, has no account, no signup and no ads, and the source is MIT licensed on GitHub. There is no paid tier and nothing is held back.",
  },
  {
    question: "How many radio stations can I listen to?",
    answer:
      "More than 50,000 live stations from over 200 countries and territories. OpenRadio plays whatever is in the Radio Browser directory, so the catalogue grows as broadcasters add themselves.",
  },
  {
    question: "Where do the stations come from?",
    answer:
      "Station listings come from Radio Browser, a free directory maintained by the community. OpenRadio does not host, record or rebroadcast any audio: your browser connects directly to each station's own stream, exactly as if you had opened the station's website.",
  },
  {
    question: "Does OpenRadio track me?",
    answer:
      "No. OpenRadio has no accounts and sets no advertising or tracking cookies. Your favorites and listening history are stored in your own browser and never sent anywhere, so they stay on that device.",
  },
  {
    question: "Do I need to install an app?",
    answer:
      "No. OpenRadio runs in any modern web browser on phones, tablets and computers. It can also be installed as a progressive web app if you want it on your home screen, but that is optional.",
  },
  {
    question: "Why did a station stop playing or fail to start?",
    answer:
      "Internet radio stations go off the air, change their stream address, limit how many people can listen at once, or block listeners in some countries, and a community directory cannot always keep up. When OpenRadio picks a station for you it checks the stream first and moves on to another if that one is not answering.",
  },
  {
    question: "Can I listen offline?",
    answer:
      "No. Radio streams are live, so listening always needs a connection. OpenRadio does keep its pages and station details available offline once you have visited them, so you can still browse what you found earlier.",
  },
  {
    question: "How do I add a station, or fix one that is wrong?",
    answer:
      "Station details are edited at Radio Browser rather than in OpenRadio, because that is the directory OpenRadio reads from. Adding or correcting a station there means every app using the directory gets the fix, not just this one.",
  },
  {
    question: "What licence is OpenRadio released under?",
    answer:
      "The MIT licence. You can read the source, run your own copy, and reuse the code in your own projects, including commercially, as long as you keep the copyright notice.",
  },
];
