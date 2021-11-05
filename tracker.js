const puppeteer = require('puppeteer');

const fs = require("fs");

const filePath = "F:\\@Perso\\@Dev\\AAVE_APY_Tracker\\apy.json"

let date_ob = new Date();

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://aave.com');

    //Find and press avax network btn
    await page.waitForSelector('button[class="MarketSelectButton"]');
    const btnHandles = await page.$$('button[class="MarketSelectButton"]');
    await btnHandles[3].evaluate(b => b.click());

    //Get apy from the third card (usdt)
    await page.waitForSelector('p[class="APRValue"]');
    const apys = await page.$$('p[class="APRValue"]');
    let apysvalue = [
        (await page.evaluate(el => el.textContent, apys[8])).split(" ")[0], //apy of desposit
        (await page.evaluate(el => el.textContent, apys[9])).split(" ")[0], //bonus of desposit
        (await page.evaluate(el => el.textContent, apys[10])).split(" ")[0], //apy of borrowing
        (await page.evaluate(el => el.textContent, apys[11])).split(" ")[0]]; //bonus of borrowing
    
    //Manage JSON file 
    // {
    //  date:[despositapy,despositbonus,borrowingapy,borrowingbonus]
    // }
    fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        let apyData = JSON.parse(data);
        apyData[("0" + date_ob.getDate()).slice(-2) + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + date_ob.getFullYear() + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds()] = apysvalue;
        //console.log(apyData);
        let datafinal = JSON.stringify(apyData, null, 2);
        fs.writeFile(filePath, datafinal, (err) => {
            if (err) throw err;
        });
    });

    await browser.close();
})();