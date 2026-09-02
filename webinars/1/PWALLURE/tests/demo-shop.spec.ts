import { expect, type Page, test } from '@playwright/test';

async function openDemoShop(page: Page) {
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Webinar Demo Shop</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #202124;
            background: #f6f7f9;
          }
          main {
            max-width: 880px;
            margin: 32px auto;
            padding: 24px;
            background: white;
            border: 1px solid #d7dce2;
          }
          header {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: center;
            border-bottom: 1px solid #d7dce2;
            padding-bottom: 16px;
          }
          label, input, button {
            font-size: 14px;
          }
          input {
            padding: 8px;
            border: 1px solid #aeb6c2;
          }
          button {
            padding: 9px 12px;
            border: 0;
            color: white;
            background: #1f6feb;
            cursor: pointer;
          }
          section {
            margin-top: 20px;
          }
          .product {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: center;
            padding: 14px 0;
            border-bottom: 1px solid #edf0f4;
          }
          .muted {
            color: #667085;
          }
          .error {
            color: #b42318;
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <div>
              <h1>Webinar Demo Shop</h1>
              <p class="muted">A tiny checkout flow for reporting examples.</p>
            </div>
            <strong data-testid="session-state">Guest</strong>
          </header>

          <section aria-label="Sign in">
            <label for="email">Email</label>
            <input id="email" data-testid="email" value="sasha@example.com" />
            <button data-testid="sign-in">Sign in</button>
          </section>

          <section aria-label="Catalog">
            <label for="search">Search catalog</label>
            <input id="search" data-testid="search" placeholder="Search products" />
            <p data-testid="search-result" class="muted">Showing all products</p>
            <div class="product" data-product-name="Travel Backpack">
              <span>Travel Backpack</span>
              <button data-testid="add-backpack">Add to cart</button>
            </div>
            <div class="product" data-product-name="Noise Canceling Headphones">
              <span>Noise Canceling Headphones</span>
              <button data-testid="add-headphones">Add to cart</button>
            </div>
          </section>

          <section aria-label="Cart">
            <h2>Cart</h2>
            <p data-testid="cart-count">0 items</p>
            <p data-testid="cart-total">$0.00</p>
            <label for="promo">Promo code</label>
            <input id="promo" data-testid="promo-code" />
            <button data-testid="apply-promo">Apply promo</button>
            <p data-testid="promo-message" class="error" hidden>Promo code expired</p>
          </section>
        </main>

        <script>
          const sessionState = document.querySelector('[data-testid="session-state"]');
          const email = document.querySelector('[data-testid="email"]');
          const search = document.querySelector('[data-testid="search"]');
          const searchResult = document.querySelector('[data-testid="search-result"]');
          const cartCount = document.querySelector('[data-testid="cart-count"]');
          const cartTotal = document.querySelector('[data-testid="cart-total"]');
          const promoCode = document.querySelector('[data-testid="promo-code"]');
          const promoMessage = document.querySelector('[data-testid="promo-message"]');

          let items = 0;
          let total = 0;

          document.querySelector('[data-testid="sign-in"]').addEventListener('click', () => {
            sessionState.textContent = 'Signed in as ' + email.value;
          });

          search.addEventListener('input', () => {
            const value = search.value.trim();
            searchResult.textContent = value
              ? 'Showing results for "' + value + '"'
              : 'Showing all products';
          });

          document.querySelector('[data-testid="add-backpack"]').addEventListener('click', () => {
            items += 1;
            total += 79;
            cartCount.textContent = items + (items === 1 ? ' item' : ' items');
            cartTotal.textContent = '$' + total.toFixed(2);
          });

          document.querySelector('[data-testid="add-headphones"]').addEventListener('click', () => {
            items += 1;
            total += 129;
            cartCount.textContent = items + (items === 1 ? ' item' : ' items');
            cartTotal.textContent = '$' + total.toFixed(2);
          });

          document.querySelector('[data-testid="apply-promo"]').addEventListener('click', () => {
            promoMessage.hidden = promoCode.value !== 'EXPIRED10';
          });
        </script>
      </body>
    </html>
  `);
}

test.beforeEach(async ({ page }) => {
  await openDemoShop(page);
});

test('returning shopper can sign in', async ({ page }) => {
  await page.getByTestId('sign-in').click();

  await expect(page.getByTestId('session-state')).toHaveText(
    'Signed in as sasha@example.com',
  );
});

test('shopper can search the catalog', async ({ page }) => {
  await page.getByTestId('search').fill('backpack');

  await expect(page.getByTestId('search-result')).toHaveText(
    'Showing results for "backpack"',
  );
});

test('shopper can add a backpack to the cart', async ({ page }) => {
  await page.getByTestId('add-backpack').click();

  await expect(page.getByTestId('cart-count')).toHaveText('1 item');
  await expect(page.getByTestId('cart-total')).toHaveText('$79.00');
});

test('checkout total includes the selected headphones discount', async ({ page }) => {
  await page.getByTestId('add-headphones').click();

  await expect(page.getByTestId('cart-total')).toHaveText('$99.00');
});

test('expired promo code is accepted for loyal shoppers', async ({ page }) => {
  await page.getByTestId('promo-code').fill('EXPIRED10');
  await page.getByTestId('apply-promo').click();

  await expect(page.getByTestId('promo-message')).toBeHidden();
});

test('payment service returns a valid approval contract', async ({ page }) => {
  await page.getByTestId('add-backpack').click();

  throw new Error('Payment service response is missing approvalCode.');
});
