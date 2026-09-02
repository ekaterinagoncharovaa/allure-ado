# Webinar 1: Playwright With Allure 3

## 1. How to run the Playwright tests as is

```bash
npm install
npx playwright install chromium
npx playwright test --project=chromium
```

The command is expected to finish with failures because this is a reporting demo.

## 1.5. How to open the Playwright report

```bash
npx playwright show-report
```

## 2. How to install Allure

```bash
npm install --save-dev allure@latest allure-playwright@latest
```

## 3. How to integrate Allure

In `playwright.config.ts`, replace the regular reporter with the Allure reporter:

```ts
reporter: [['list'], ['allure-playwright']],
```

## 4. How to run the tests with Allure 3

```bash
npx allure run -- npx playwright test --project=chromium
```

The command is expected to finish with failures because this is a reporting demo.

## 5. How to open the Allure report

```bash
npx allure open
```

