import axios from "axios";
import fs from 'fs'
import { load } from "cheerio";
import { parseNumber } from "./utils";
import { features } from "process";

async function main() {
    // GET DEALS
    // const response = await axios.get("https://www.joinsecret.com/offers");
    // const $ = load(response.data);
    // const deals = $("[data-target='offer-list'] > .grid > div").each((index, element) => {
    //     console.log('======================')
    //     console.log($(element).html())
    //     console.log('======================')
    // })

    // const response = await axios.get("https://www.joinsecret.com/aws-activate#aws-credits-startups");
    // const $ = load(response.data);
    // fs.writeFileSync('test.html', response.data)
    const html = fs.readFileSync('test.html')
    const $ = load(html)
    const deal = {}

    /**
     * 

    //#region First
    let element = $('[data-controller="products--show"] > header > .container-with-aside > .container-left-aside')
    let tags = element.find('div:nth(0)').text().split('>').map(s => s.replace('\n', '').trim())
    let imageURL = element.find('div:nth(1) img[loading="lazy"]').attr('src')
    let title = element.find('div:nth(1) span.header-xl').text().trim()
    let subtitle = element.find('div:nth(1) span.header-xl').next().text().trim()
    let description = element.children('p:nth(0)').text().trim()
    let element2 = element.find('.grid').children('div:nth(0)').children('div:nth(0)').children('div:nth(1)')
    let reviews = {
        href: element2.children('div:nth(0)').children('a').attr('href'),
        score: element2.children('div:nth(0)').children('a').children('div').children('div:nth(1)').children('span:nth(0)').text().trim(),
        count: parseNumber(element2.children('div:nth(0)').children('a').children('div').children('div:nth(1)').children('span:nth(1)').text().trim())
    }
    let avaiableDealCount = parseNumber(element2.children('div:nth(1)').text().trim())
    let redeemedCount = parseNumber(element2.children('div:nth(2)').text().trim())
    console.log(tags)
    console.log(imageURL)
    console.log(title)
    console.log(subtitle)
    console.log(description)
    console.log(reviews)
    console.log(avaiableDealCount)
    console.log(redeemedCount)
    //#endregion

    //#region Second
    element = $('[data-controller="products--show"] .container-with-aside > main')
    let tabs = element.find('div[data-target="tabs.tabContent"]')
    for (let tab of tabs) {
        console.log($(tab).attr('data-content'))
        let prop = $(tab).attr('data-content')
        switch (prop) {
            case 'infos':
                //#region General information
                let infos = {
                    title: $(tab).children('h2').text().trim(),
                    description: $(tab).children('div:nth(0)').text().trim(),
                    content: $(tab).children('div:nth(1)').children('div:nth(0)').children('div:nth(1)').children('div').toArray().map((item) => ({
                        'title': $(item).children('span').text().trim(),
                        'description': $(item).children('p:nth(0)').text().trim()
                    }))
                }
                console.log(infos)
                //#endregion
                break;
            case 'deals':
                //#region Deals
                let deals = $(tab).children('[data-controller="modal"]').children('div').toArray().map((item) => ({
                    title: $(item).children('h2:nth(0)').text().trim(),
                    description: $(item).children('p[data-target="products--show.seoDescription"]').text().trim()
                }))
                console.log(deals)
                //#endregion
                //#region Pricing
                let pricings = $('#pricings').children('div').toArray().map(item => ({
                    title: $(item).children('div:nth(0)').children('p:nth(0)').text().trim(),
                    price: parseNumber($(item).children('div:nth(0)').children('p:nth(1)').text().trim()),
                    type: $(item).children('div:nth(0)').children('p:nth(2)').text().trim().replace('/ ', ''), // monthly, yearly, one time
                }))
                console.log(pricings)
                //#endregion
                let faqs = $(element).find('[data-controller="obfuscation"]').next().find('details').toArray().map(item => ({
                    'q': $(item).children('summary').text().trim(),
                    'a': $(item).children('p:nth(1)').text().trim(),
                }))
                console.log(faqs)
                //#region Testimonials
                let testimonials = $(element).find('[data-testimonial]').toArray().map(item => ({
                    title: $(item).children('h2').text().trim(),
                    description: $(item).children('p:nth(0)').text().trim(),
                    from: $(item).children('div:nth(0)').text().trim(),
                }))
                console.log(testimonials)
                //#endregion
                break;
            case 'features':
                //#region Features
                let features = {
                    title: $(tab).children('h2').text().trim(),
                    description: $(tab).children('p:nth(0)').text().trim(),
                    features: $(tab).children('ul:nth(0)').children('li').toArray().map(item => ({
                        title: $(item).children('div').children('h3:nth(0)').text().trim(),
                        description: $(item).children('div').children('p:nth(0)').text().trim(),
                    }))
                }
                console.log(features)
                //#endregion
                break;
            case 'reviews':
                //#region Reviews
                let reviews = {
                    title: $(tab).children('div:nth(0)').children('div:nth(0)').children('h2:nth(0)').text().trim(),
                    score: $(tab).children('div:nth(0)').children('div:nth(0)').children('div:nth(0)').children('div:nth(1)').children('span:nth(0)').text().trim(),
                    count: parseNumber($(tab).children('div:nth(0)').children('div:nth(0)').children('div:nth(0)').children('div:nth(1)').children('span:nth(0)').text().trim()),
                    reviewers: $(tab).children('ul:nth(0)').children('li').toArray().map(item => ({
                        name: $(item).children('div:nth(0)').children('div:nth(0)').children('h3:nth(0)').text().trim()
                    }))
                }
                console.log(reviews)
                //#endregion
                //#region Pros & Cons
                // Check if pros or cons
                if ($(tab).next('div').children('h2:nth(0)').text().includes('Pros & Cons')) {
                    let prosList = $(tab).next('div').children('div:nth(0)').children('div:nth(0)').children('ul:nth(0)').children('li').toArray().map(item => $(item).text().trim())
                    let consList = $(tab).next('div').children('div:nth(0)').children('div:nth(1)').children('ul:nth(0)').children('li').toArray().map(item => $(item).text().trim())
                    let prosAndCons = {
                        pros: prosList,
                        cons: consList
                    }
                    console.log(prosAndCons)
                }
                //#endregion
                //#region Why is better?
                // Check if there is why
                if ($(tab).next('div').next('div').children('h2:nth(0)').text().includes('Why is')) {
                    let betterList = $(tab).next('div').next('div').children('div:nth(0)').children('p').toArray().map(item => $(item).text().trim())
                    console.log(betterList)
                }
                //#endregion
                break;
            case 'alternatives':
                //#region Alternatives
                let alternatives = {
                    title: $(tab).children('div:nth(0)').children('div:nth(0)').children('a:nth(0)').text().trim(),
                    href: $(tab).children('div:nth(0)').children('div:nth(0)').children('a:nth(0)').attr('href'),
                    alternatives: $(tab).children('div:nth(1)').children('div').toArray().map(item => ({
                        href: $(item).children('a').attr('href'),
                        imageURL: $(item).children('a').children('div:nth(0)').children('img').attr('src'),
                        title: $(item).children('a').children('div:nth(0)').children('div:nth(0)').children('h3').text().trim(),
                        subtitle: $(item).children('a').children('div:nth(0)').children('div:nth(0)').children('div:nth(0)').text().trim(),
                        score: 5,
                        avaiableDealCount: parseNumber($(item).children('a:nth(0)').children('div:nth(0)').children('div:nth(0)').children('div:nth(1)').children('p').text().trim())
                    }))
                }
                console.log(alternatives)
                //#endregion
                break;
            case 'vs_pages':
                //#region VS Pages
                let compares = {
                    title: $(tab).children('div:nth(0)').children('h2:nth(0)').text().trim(),
                    href: $(tab).children('div:nth(0)').children('div:nth(0)').children('a:nth(0)').attr('href'),
                    contents: $(tab).children('div:nth(1)').children('div').toArray().map(item => ({
                        href: $(item).children('a').attr('href'),
                        items: $(item).children('div.relative').children('div:nth(0)').children('div').toArray().map(element => ({
                            imageURL: $(element).children('div:nth(0)').children('img').attr('src'),
                            title: $(element).children('div:nth(1)').text().trim(),
                        }))
                    }))
                }
                console.log(compares)
                //#endregion
                //#region Promos
                let promos = $(tab).next().children('div:nth(0)').children('a').toArray().map(item => ({
                    href: $(item).attr('href'),
                    title: $(item).text().trim(),
                }))
                console.log(promos)
                //#endregion
                break;
            default:
                break;
        }
    }
    //#endregion
    
    */

    //#region Reviews
    let description = $('div[data-controller="scroll-into-doc"]').children('header:nth(0)').children('div:nth(0)').children('div:nth(1)').children('p:nth(0)').text().trim()
    console.log(description)

    //#region Pro & cons    
    let prosList = $('#pro_and_cons').children('ul:nth(0)').children('li').toArray().map(item => $(item).text().trim())
    let consList = $('#pro_and_cons').children('ul:nth(1)').children('li').toArray().map(item => $(item).text().trim())

    console.log({
        pros: prosList,
        cons: consList,
    })
    //#endregion

    //#region Features
    let features = $('#main-features').children('div:nth(0)').children('div:nth(1)').children('div').toArray().map(item => {
        let title = $(item).children('p:nth(0)').text().trim()
        let description = $(item).children('p:nth(1)').text().trim()
        if ($(item).children('div:nth(0)').length != 0)
            description = $(item).children('div:nth(0)').text().trim()
        if ($(item).children('p:nth(1)').children('i:nth(0)').length != 0) {
            description = $(item).children('p:nth(1)').children('i:nth(0)').attr('class')?.includes('fa-check') ? 'Yes' : 'No'
        }
        return {
            title,
            description
        }
    })

    console.log(features)
    //#endregion

    //#region What-is-review
    let review = $('#what-is-review').children('div:nth(0)').text().trim()
    
    console.log(review)
    //#endregion

    //#endregion
}

main(); 