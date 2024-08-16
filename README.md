
# Playwright-Cucumber-PO-Rerun-Parallel

Proyecto de Playwright integrando Cucumber, compartir Page Object, reporte HTML y HTML con gráficos y con captura de pantalla, rerun de casos fallidos y ejecución paralela

## Pasos para replicar el proyecto

Seguir el paso a paso

```bash
  Crear la carpeta del proyecto
```

En la ubicación del proyecto abrir una ventana de comando

```bash
  cmd
```

Instalar el paquete de Playwright

```bash
  npm init playwright@latest
```

Abrir el proyecto en Visual Studio Code

```bash
  code .
```

Eliminar la carpeta test y el archivo playwright.config.ts. Abrir una terminal e instalar el paquete de cucumber, ts-node, cucumber html reporter y fs-extra

```bash
  npm i @cucumber/cucumber -D
  npm i ts-node -D
  npm install multiple-cucumber-html-reporter --save-dev
  npm i fs-extra -D
```

crear las nuevas carpetas

```bash
  src/test/features
  src/test/steps
  src/hooks
  src/helper
```

Crear el archivo cucumber.json con la siguiente estructura

```bash
{
    "default": {
        "formatOptions": {
            "snippetInterface": "async-await"
        },
        "paths": [
            "src/test/features/*.feature"
        ],
        "dryRun": false,
        "require": [
            "src/test/steps/*.ts",
            "src/hooks/Hooks.ts"
        ],
        "requireModule": [
            "ts-node/register"
        ],
        "format": [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/report.json",
            "rerun:@rerun.txt"
        ],
        "parallel": 2
    },
    "rerun": {
        "formatOptions": {
            "snippetInterface": "async-await"
        },
        "dryRun": false,
        "require": [
            "src/test/steps/*.ts",
            "src/hooks/Hooks.ts"
        ],
        "requireModule": [
            "ts-node/register"
        ],
        "format": [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/report.json",
            "rerun:@rerun.txt"
        ],
        "parallel": 2
    }
}
```

Para la ejecución en paralelo añadimos la siguiente linea en el archivo cucumber.json, despues de format

```bash
"parallel": 2
```

Modificar el archivo package.json en la sesión de scripts

```bash
"scripts": {
    "pretest": "npx ts-node src/helper/init.ts",
    "test": "cucumber-js test || (exit 0)",
    "posttest": "npx ts-node src/helper/report.ts",
    "test:failed": "cucumber-js -p rerun @rerun.txt"
  },
```

Si no se ha configurado el glue, hacer lo siguiente

```bash
  Control + ,
```

En search settings escribir cucumber y dar clic en Edit in settings.json y agregar lo siguiente

```bash
    "cucumber.glue": [
        "src/test/steps/*.ts"
    ],
```

En la carpeta hooks crear el archivo PageFixture.ts con la siguiente estructura

```bash
import { Page } from "@playwright/test";

export const pageFixture = {
    // @ts-ignore
    page: undefined as Page
}   
```

En la carpeta hooks crear el archivo Hooks.ts con la siguiente estructura

```bash
import { BeforeAll, After, Before, AfterAll, Status, AfterStep } from "@cucumber/cucumber";
import { chromium, Browser, Page, BrowserContext } from "@playwright/test";
import { pageFixture } from "./PageFixture";

let browser: Browser;
let context: BrowserContext;

BeforeAll (async function () {
    browser = await chromium.launch({ headless: false });
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
        const img = await pageFixture.page.screenshot({ path: `./test-result/screenshots/${pickle.name}.png`, type: "png"});
        await this.attach(img, "image/png");
    }

    await pageFixture.page.close();
    await context.close();
});

// Screenshot fof step
AfterStep (async function ({ pickle, result }) {
    const img = await pageFixture.page.screenshot({ path: `./test-result/screenshots/${pickle.name}.png`, type: "png"});
    await this.attach(img, "image/png");
})
*/

After (async function ({ pickle }) {
    // Screenshot
    const img = await pageFixture.page.screenshot({ path: `./test-result/screenshots/${pickle.name}.png`, type: "png"});
    await this.attach(img, "image/png");
    await pageFixture.page.close();
    await context.close();
});

AfterAll (async function () {
    await browser.close();
});
```

En la carpeta helper crear el archivo report.ts con la siguiente estructura y según el proyecto

```bash
const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "test-results",
  reportPath: "test-results",
  reportName: "Playwright Automation Report",
  pageTitle: "Guru99",
  displayDuration: false,
  metadata: {
    browser: {
      name: "chrome",
      version: "127",
    },
    device: "JFT",
    platform: {
      name: "Windows",
      version: "10",
    },
  },
  customData: {
    title: "Test info",
    data: [
      { label: "Project", value: "Guru99 project" },
      { label: "Release", value: "1.2.3" },
      { label: "Cycle", value: "Smoke-1" }
    ],
  },
});
```
En la carpeta helper crear el archivo init.ts con la siguiente estructura

```bash
const fs = require ("fs-extra");

try {
    fs.ensureDir("test-results");
    fs.emptyDir("test-results");
} catch (error) {
    console.log ("Folder not created!" + error);
}
```

Crear los features y los steps según el proyecto.

## Ejecutar Tests

Para ejecutar los casos de prueba, abrir una terminal y copiar el comando

```bash
  npm run test
```

## Ejecutar Tests Fallidos

Para ejecutar los casos de prueba fallidos (rerun), abrir una terminal y copiar el comando

```bash
  npm run test:failed
```

## Generar Reporte con Gráficos

Para general el reporte HTML con gráficos, abrir una terminal y copiar el comando

```bash
  npm run report
```

## Authors

- Jorge Franco