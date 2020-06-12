/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Hacker News Clone`,
        short_name: `H N C`,
        start_url: `.`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: "src/images/y_icon.png",
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-seo",
      options: {
        siteName: "Hacker News Clone",
        defaultSiteImage: "src/images/y_icon.png",
        siteUrl: "https://hacker-news-clone-gatsby.netlify.app/",
        twitterCreator: "@twitterhandle",
        twitterSite: "@twitterhandle",
        globalSchema: `{
            "@type": "WebSite",
            "@id": "https://hacker-news-clone-gatsby.netlify.app/",
            "url": "https://hacker-news-clone-gatsby.netlify.app/",
            "name": "Hacker News Clone",
            "publisher": {
              "@id": "https://github.com/sushmitpalrishi"
            },
            "image": {
              "@type": "ImageObject",
              "@id": "https://github.com/sushmitpalrishi",
              "url": "src/images/y_icon.png",
              "caption": "Hacker News Clone Gatsby"
            }
          }`,
      },
    },
  ],
};
