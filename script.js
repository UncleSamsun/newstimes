const API_KEY = ``
let newsList = []
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))

const getLatestNews = async () => {
    const url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`)
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
    render()
    console.log("newsList: ", newsList)
}

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase()
    console.log(category)
    const url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?category=${category}`)
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
    render()
    console.log("Category newsList: ", newsList)
}

const getNewsByKeyword = async () => {
    const keyword = document.getElementById("search-input").value
    console.log(keyword)
    const url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?q=${keyword}`)
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
    render()
    console.log("Category newsList: ", newsList)
}

const render = () => {
    const newsHTML = newsList.map(item => `<div class="row news">
        <div class="col-lg-4">
        <img class="news-img-size" src="${item.urlToImage}"/>
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.description}
            </p>
            <div>
                ${item.source.name} * ${item.publishedAt}
            </div>
        </div>
        </div>`).join('')

    document.getElementById("news-board").innerHTML = newsHTML
}

getLatestNews()