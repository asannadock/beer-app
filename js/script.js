// variables
const urlBase = "https://api.punkapi.com/v2/beers?page="
const beersDiv = document.querySelector('.beers')
const filterABV = document.getElementById("filterABV")
const filterIBU = document.getElementById("filterIBU")
const pageText = document.getElementById("pageNumber")
const prevPage = document.getElementById("prevPage")
const nextPage = document.getElementById("nextPage")
let optionsABV = ''
let optionIBU = ''
let page = 1

// filters
filterABV.addEventListener('change', e => {
    // get the value of the radio button that is checked
    // abv_lt and abv_gt - params from the punkapi.com documentation
    // abv_lt - alcohol less than - Returns all beers with ABV less than the supplied number
    // abv_gt - alcohol grater than - Returns all beers with ABV greater than the supplied number
    const value = e.target.value //this will be the checked option value

    switch (value) {
        case "all":
            optionsABV = "";
            break
        case "weak":
            optionsABV = "&abv_lt=4.6"; //adding & for the correct url
            break
        case "medium":
            optionsABV = "&abv_gt=4.5&abv_lt=7.6"; //adding & for the correct url
            break
        case "strong":
            optionsABV = "&abv_gt=7.5"; //adding & for the correct url
            break
    }
    page = 1
    getBeers()
})

filterIBU.addEventListener('change', e => {
    // get the value of the radio button that is checked
    // abv_lt and abv_gt - params from the punkapi.com documentation
    // ibu_lt - hoppiness less than - Returns all beers with IBU less than the supplied number
    // ibu_gt - hoppiness grater than - Returns all beers with IBU greater than the supplied number
    const value = e.target.value //this will be the checked option value

    switch(value) {
        case "all":
            optionIBU = "";
            break
        case "weak":
            optionIBU = "&ibu_lt=35"; //adding & for the correct url
            break
        case "medium":
            optionIBU = "&ibu_gt=34&ibu_lt=75"; //adding & for the correct url
            break
        case "strong":
            optionIBU = "&ibu_gt=74"; //adding & for the correct url
            break
    }
    page = 1
    getBeers()
})

async function getBeers() {
    // We use this url because of filters. optionsABV will be different based on the filter we chose
    const url = urlBase + page + optionsABV + optionIBU;
    // fetch
    const beerPromise = await fetch(url)
    if (beerPromise.ok) {
        const beers = await beerPromise.json()

        // pagination
        pageText.innerText = page
        //disable/enable pagination buttons
        if(page === 1) {
            prevPage.disabled = true
        } else {
            prevPage.disabled = false
        }
        if(beers.length < 25) {
            nextPage.disabled = true
        } else {
            nextPage.disabled = false
        }

        // render data
        let beerHtml = ``
        // replace missing images with this placeholder
        const genericBottle = 'https://cdn.pixabay.com/photo/2014/12/22/00/04/bottle-576717_960_720.png'

        beers.forEach( beer => {           
            beerHtml += `
                <div class='beer-wrapper card'>
                    <div class='beer'>
                        <img class='beer-img' src='${beer.image_url ? beer.image_url : genericBottle}' />
                        <p>${beer.name}</p>
                        <span class='beer-info'>
                            <span>ABV: ${beer.abv}%</span>
                            <span>IBU: ${beer.ibu}</span>
                        </span>
                    </div>
                    <div class='beer-content'>
                        <div class='beer-name'>${beer.name}</div>
                        <div class='beer-tagline'>${beer.tagline}</div>
                        <div class='beer-description'>${beer.description}</div>
                        <div class='beer-food-pairing'>
                            Pair with: 
                            ${beer.food_pairing.join(', ')}
                        </div>                       
                    </div>
                </div>
            `
        })
        beersDiv.innerHTML = beerHtml        
    } else {
        console.error(beerPromise.status)
    }
}

// pagination
prevPage.addEventListener('click', () => {
    page--
    getBeers()
})
nextPage.addEventListener('click', () => {
    page++
    getBeers()
})

// initial beers results load (without filter)
getBeers()
