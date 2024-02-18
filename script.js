const API_KEY = `bc0ec150736a41bbb9de6afd7e2d10d0`
let news = []

const getLatestNews = async () => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
    const response = await fetch(url)
    const data = await response.json()
    news = data.articles
    console.log(news)
}

getLatestNews()