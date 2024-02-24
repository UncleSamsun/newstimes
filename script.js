const API_KEY = ``
let newsList = []
let url = new URL(`https://newstimes-mj.netlify.app/top-headlines`)
let searchState = false
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize = 5


const navMenus = document.querySelectorAll(".nav-menus button")
navMenus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))

const menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))

const getNews = async () => {
    try {
        url.searchParams.set("page", page)
        url.searchParams.set("pageSize", pageSize)

        const response = await fetch(url)
        const data = await response.json()
        if(response.status === 200){
            if(data.articles.length === 0)
            {
                throw new Error("No matches for your search")
            }
            newsList = data.articles
            totalResults = data.totalResults
            // totalResults = 124
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

const searchToggle = () => {
    searchState = !searchState

    if(searchState == true)
    {
        document.getElementById('search-box').className = 'd-flex'
    }
    else
    {
        document.getElementById('search-box').className = 'search-none'
    }
}

const getLatestNews = async () => {
    url = new URL(`https://newstimes-mj.netlify.app/top-headlines`)
    getNews()
}

const resetCategoryClass = () => {
    navMenus.forEach(btn => {btn.className = ''})
    menus.forEach(btn => {btn.className = ''})
}

const getNewsByCategory = async (event) => {
    resetCategoryClass()
    event.target.className = "select-button"
    const category = event.target.textContent.toLowerCase()
    page = 1
    url = new URL(`https://newstimes-mj.netlify.app/top-headlines?category=${category}`)
    getNews()
}

const getNewsByKeyword = async () => {
    const keyword = document.getElementById("search-input").value
    page = 1
    url = new URL(`https://newstimes-mj.netlify.app/top-headlines?q=${keyword}`)
    getNews()
}

const imgError = (image) => {
	image.onerror = null
	image.src = "./images/no-image.jpg"
}

const descriptionCheck = (des) => {
    if(des == null || des == "")
    {
        return "내용없음"
    }
    else 
    {
        if(des.length >= 200)
        {
            return des.substring(0, 200) + "..."
        }
        else
        {
            return des
        }
    }
}

const sourceCheck = (name) => {
    if(name == null || name == "")
    {
        return "no source"
    }
    else
    {
        return name
    }
}

const render = () => {
    const newsHTML = newsList.map(item => `<div class="row news">
        <div class="col-lg-4 align-items-center">
        <img class="news-img-size" src="${item.urlToImage}" onerror="imgError(this)"/>
        </div>
        <div class="col-lg-8 d-flex flex-column">
            <div class="mb-auto">
                <h3>${item.title}</h3>
                <p>
                    ${descriptionCheck(item.description)}
                </p>
            </div>
            <div>
                ${sourceCheck(item.source.name)} * ${moment(item.publishedAt).fromNow()}
            </div>
        </div>
        </div>`).join('')

    document.getElementById("news-board").innerHTML = newsHTML
    paginationRender()

    window.scrollTo({left:0, top:0})
}

const errorRender = (errorMessage) => {

    const errorHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
    <div>
        ${errorMessage}
    </div>
    </div>`

    document.getElementById("news-board").innerHTML = errorHTML
    document.querySelector(".pagination").innerHTML = ''
}

const paginationRender = () => {
    const totalPages = Math.ceil(totalResults / pageSize)
    const pageGroup = Math.ceil(page / groupSize)
    let lastPage = pageGroup * groupSize

    if(lastPage > totalPages)
    {
        lastPage = totalPages
    }
    else if((totalPages % groupSize) !== 0)
    {

    }

    let firstPage = (lastPage - (groupSize - 1) <= 0? 1: lastPage - (groupSize - 1))
    let paginationHTML = ``

    if(page !== 1)
    {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${1})"><a class="page-link"><<</a></li>`
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link"><</a></li>`        
    }

    for(let i = firstPage; i <= lastPage; i++){
        paginationHTML += `<li class="page-item ${i===page ? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }

    if(page !== totalPages)
    {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link">></a></li>`
        paginationHTML += `<li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link">>></a></li>`
    }

    document.querySelector(".pagination").innerHTML = paginationHTML
}

const moveToPage = (pageNum) => {
    page = pageNum
    
    getNews()
}

getLatestNews()