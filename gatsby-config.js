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
  ],
};
