const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

let articles = [];

const getArticles = async () => {
  try {
    const response = await axios.get("https://kuenselonline.com/");
    const html = response.data;
    const $ = cheerio.load(html);

    $('div[class="col-md-3"]')
      .find("div > div > h5 > a", html)
      .each(async function () {
        const title = $(this).text().trim();
        const Url = $(this).attr("href");
        try {
          const response = await axios.get(Url);
          const html = response.data;
          const $ = cheerio.load(html);
          $('div[class="page-header-details"]')
            .find("span", html)
            .first()
            .each(function () {
              const date = $(this).text().trim();
              articles.push({
                title,
                date,
                Url,
              });
            });
        } catch (error) {
          console.log(error);
        }
      });
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.json("Top Stories of Kuensel");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

getArticles().then(() => {
  app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
});
