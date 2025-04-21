import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "books.google.com",
      "https://external-preview.redd.it",
      "https://b.thumbs.redditmedia.com",
      "external-preview.redd.it",
      "en.wikipedia.org",
      "a.thumbs.redditmedia.com",
      "b.thumbs.redditmedia.com",
    ],
  },
};

export default nextConfig;
