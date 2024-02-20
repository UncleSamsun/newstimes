const API_KEY = ``
let newsList = []
let url = new URL(`https://newstimes-mj.netlify.app/top-headlines`)
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))

const getNews = async () => {
    try {
        const response = await fetch(url)
        const data = await response.json()
        if(response.status === 200){
            if(data.articles.length === 0)
            {
                throw new Error("No matches for your search")
            }
            newsList = data.articles
            render()
        }
        else {
            throw new Error(data.message)
        }
    }
    catch (error) {
        errorRender(error.message)
    }
}

const getLatestNews = async () => {
    url = new URL(`https://newstimes-mj.netlify.app/top-headlines`)
    getNews()
}

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase()
    url = new URL(`https://newstimes-mj.netlify.app/top-headlines?category=${category}`)
    getNews()
}

const getNewsByKeyword = async () => {
    const keyword = document.getElementById("search-input").value
    url = new URL(`https://newstimes-mj.netlify.app/top-headlines?q=${keyword}`)
    getNews()
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

const errorRender = (errorMessage) => {

    const errorHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
    <div>
        ${errorMessage}
    </div>
    </div>`

    document.getElementById("news-board").innerHTML = errorHTML

}

getLatestNews()