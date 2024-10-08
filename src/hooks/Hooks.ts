import { BeforeAll, After, Before, AfterAll, Status, AfterStep } from "@cucumber/cucumber";
import { chromium, Browser, Page, BrowserContext } from "@playwright/test";
import { pageFixture } from "./PageFixture";

let browser: Browser;
let context: BrowserContext;

BeforeAll (async function () {
    // Para ejecutar los test en segundo plano... browser = await chromium.launch({ headless: !false });
    browser = await chromium.launch({ headless: !false });
});

Before (async function () {
    context = await browser.newContext();
    const page = await browser.newPage();
    pageFixture.page = page;
});

/*
// Screenshot whit failed
After (async function ({ pickle, result }) {
    console.log(result?.status);
    // Screenshot
    if(result?.status == Status.FAILED) {
        const img = await pageFixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png"});
        await this.attach(img, "image/png");
    }

    await pageFixture.page.close();
    await context.close();
});

// Screenshot fof step
AfterStep (async function ({ pickle, result }) {
    const img = await pageFixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png"});
    await this.attach(img, "image/png");
})
*/

After (async function ({ pickle }) {
    // Screenshot
    const img = await pageFixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png"});
    await this.attach(img, "image/png");
    await pageFixture.page.close();
    await context.close();
});

AfterAll (async function () {
    await browser.close();
});