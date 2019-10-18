const ora = require('ora');
const jsFire = require('js-fire');
const axios = require('axios');
const cheerio = require('cheerio');

const delay = ms => {
    return new Promise((resolve, ms) => {
        setInterval(() => resolve(), ms);
    }); 
}

async function main() {
    const spinner = ora(' => Cargando datos de la Devday').start();

    await delay(4000);
    const response = await axios.get('https://devday-ar.com/')
    const html = response.data;

    const $ = cheerio.load(html)
    const talk = $('#talk')

    const roomRobleTalks = talk.find('td[data-column]')
    const data = [];

    roomRobleTalks.each((index, talk) => {
        const speakerName = $(talk)
            .find('h4')
            .text()
        const talkTitle = $(talk)
            .find('p')
            .text()
        const talkData = {
            title: talkTitle,
            speaker: speakerName
        }
        data.push(talkData)
    });

    spinner.stop();
    console.table(data);
    
    const devdayCli = {
        speakers: speaker => {
            const talkFound = data.find(talk => {
                return talk.speaker === speaker
            });
            if(talkFound) {
                console.log('charla encontrada', talkFound);
            } else {
                console.log('charla no encontrada');
            }
        }
    }
    
    jsFire(devdayCli);

}


main();