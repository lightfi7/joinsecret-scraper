import axios from "axios";
import fs from 'fs'
import { load } from "cheerio";
import { parseNumber } from "./utils";
import { features } from "process";

async function main() {
    // GET DEALS
    // const response = await axios.get("https://www.joinsecret.com/offers");
    // const $ = load(response.data);

    // const deals = $("[data-target='offer-list'] > .grid > div").each((index, element)=>{
    //     console.log('======================')
    //     console.log($(element).html())
    //     console.log('======================')
    // })

    //
    // const response = await axios.get("https://www.joinsecret.com/aws-activate#aws-credits-startups");
    // const $ = load(response.data);

    // fs.writeFileSync('test.html', response.data)

    const html = fs.readFileSync('test.html')
    const $ = load(html)

    const deal = {}

    //#region HEADER

    let element = $('[data-controller="products--show"] > header > .container-with-aside > .container-left-aside')

    let tags = element.find('div:nth(0)').text().split('>').map(s => s.replace('\n', '').trim())
    let imageURL = element.find('div:nth(1) img[loading="lazy"]').attr('src')
    let title = element.find('div:nth(1) span.header-xl').text().trim()
    let subTitle = element.find('div:nth(1) span.header-xl').next().text().trim()
    let description = element.children('p:nth(0)').text().trim()

    let element2 = element.find('.grid').children('div:nth(0)').children('div:nth(0)').children('div:nth(1)')

    let reviews = {
        link: element2.children('div:nth(0)').children('a').attr('href'),
        score: element2.children('div:nth(0)').children('a').children('div').children('div:nth(1)').children('span:nth(0)').text().trim(),
        count: parseNumber(element2.children('div:nth(0)').children('a').children('div').children('div:nth(1)').children('span:nth(1)').text().trim())
    }
    let avaiableDealCount = parseNumber(element2.children('div:nth(1)').text().trim())
    let redeemedCount = parseNumber(element2.children('div:nth(2)').text().trim())

    console.log(tags)
    console.log(imageURL)
    console.log(title)
    console.log(subTitle)
    console.log(description)
    console.log(reviews)
    console.log(avaiableDealCount)
    console.log(redeemedCount)
    //#endregion

    //#region BODY
    element = $('[data-controller="products--show"] .container-with-aside > main')

    let tabs = element.find('div[data-target="tabs.tabContent"]')
    for (let tab of tabs) {
        console.log($(tab).attr('data-content'))
        let prop = $(tab).attr('data-content')
        switch (prop) {
            case 'infos':
                let infos = {
                    title: $(tab).children('h2').text().trim(),
                    description: $(tab).children('div:nth(0)').text().trim(),
                    faqs: $(tab).children('div:nth(1)').children('div:nth(0)').children('div:nth(1)').children('div').toArray().map((item) => ({
                        'q': $(item).children('span').text().trim(),
                        'a': $(item).children('p:nth(0)').text().trim()
                    }))
                }
                console.log(infos)
                break;
            case 'deals':
                let deals = $(tab).children('[data-controller="modal"]').children('div').toArray().map((item) => ({
                    title: $(item).children('h2:nth(0)').text().trim(),
                    description: $(item).children('p[data-target="products--show.seoDescription"]').text().trim()
                }))
                console.log(deals)

                //#region PRICING
                //#endregion

                let faqs = $(element).find('[data-controller="obfuscation"]').next().find('details').toArray().map(item => ({
                    'q': $(item).children('summary').text().trim(),
                    'a': $(item).children('p:nth(1)').text().trim(),
                }))

                console.log(faqs)

                //#region TESTIMONIALS
                let testimonials = $(element).find('[data-testimonial]').toArray().map(item => ({
                    title: $(item).children('h2').text().trim(),
                    description: $(item).children('p:nth(0)').text().trim(),
                    from: $(item).children('div:nth(0)').text().trim(),
                }))

                console.log(testimonials)
                //#endregion 
                break;
            case 'features':
                let features = {
                    title: $(tab).children('h2').text().trim(),
                    description: $(tab).children('p:nth(0)').text().trim(),
                    features: $(tab).children('ul:nth(0)').children('li').toArray().map(item => ({
                        title: $(item).children('div').children('h3:nth(0)').text().trim(),
                        description: $(item).children('div').children('p:nth(0)').text().trim(),
                    }))
                }
                console.log(features)
                break;
            case 'reviews':
                let reviews = {
                    title: $(tab).children('div:nth(0)').children('div:nth(0)').children('h2:nth(0)').text().trim(),
                    score: $(tab).children('div:nth(0)').children('div:nth(0)').children('div:nth(0)').children('div:nth(1)').children('span:nth(0)').text().trim(),
                    count: parseNumber($(tab).children('div:nth(0)').children('div:nth(0)').children('div:nth(0)').children('div:nth(1)').children('span:nth(0)').text().trim()),
                    reviewers: $(tab).children('ul:nth(0)').children('li').toArray().map(item => ({
                        name: $(item).children('div:nth(0)').children('div:nth(0)').children('h3:nth(0)').text().trim()
                    }))
                }
                console.log(reviews)
                break;
            case 'alternatives':
                break;
            case 'vs_pages':
                break;
            default:
                break;
        }
    }

    //#endregion




}

main(); 