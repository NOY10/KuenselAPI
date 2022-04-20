const PORT = process.env.PORT ||8000;
const express = require('express');
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const articles = []

axios.get("https://kuenselonline.com/")
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('div[class="col-md-3"]').find('div > div > h5 > a', html).each(function () {
            const title =$(this).text().trim()
            const Url = $(this).attr('href')
            
            axios.get(Url).then(response =>{
                const html = response.data
                const $ = cheerio.load(html)
                $('div[class="page-header-details"]').find('span', html).first().each(function (){
                    const date =$(this).text().trim()
                    articles.push({
                        title,
                        date,
                        Url
                    })
                    
                })
            })
        })
    })


app.get('/', (req,res) => {
    res.json('Top Stories of Kuensel')
})

app.get('/news', (req,res) => {
  res.json(articles)
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))