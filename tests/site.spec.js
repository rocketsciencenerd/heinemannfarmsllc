const { test, expect } = require('@playwright/test');

// ── Navigation ────────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test('logo is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.nav-logo')).toBeVisible();
    await expect(page.locator('.nav-logo')).toContainText('Heinemann Farms');
  });

  test('desktop nav links are visible on wide viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const links = page.locator('.nav-links a');
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toContainText('About');
    await expect(links.nth(1)).toContainText('Services');
    await expect(links.nth(2)).toContainText('Portfolio');
    await expect(links.nth(3)).toContainText('Contact');
  });

  test('hamburger is hidden on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('.hamburger')).toBeHidden();
  });

  test('hamburger is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.hamburger')).toBeVisible();
  });

  test('mobile nav opens and closes on hamburger click', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).toBeHidden();
    await page.locator('.hamburger').click();
    await expect(navLinks).toBeVisible();
    await page.locator('.hamburger').click();
    await expect(navLinks).toBeHidden();
  });

  test('mobile nav links are clickable and close menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('.hamburger').click();
    await expect(page.locator('.nav-links')).toBeVisible();
    await page.locator('.nav-links a[href="#services"]').click();
    await expect(page.locator('.nav-links')).toBeHidden();
  });

  test('nav becomes opaque after scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(400);
    await expect(page.locator('nav')).toHaveClass(/scrolled/);
  });
});

// ── Hero ──────────────────────────────────────────────────────────────────────

test.describe('Hero', () => {
  test('main heading is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('View Services CTA links to #services', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a.btn-primary[href="#services"]')).toBeVisible();
  });

  test('Get in Touch CTA links to #contact', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a.btn-outline[href="#contact"]')).toBeVisible();
  });
});

// ── About ─────────────────────────────────────────────────────────────────────

test.describe('About', () => {
  test('about section exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#about')).toBeAttached();
  });

  test('section heading is correct', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#about .section-title')).toContainText('Wood, Grain');
  });
});

// ── Services ──────────────────────────────────────────────────────────────────

test.describe('Services', () => {
  const SERVICE_TITLES = [
    'Jewelry & Keepsake Boxes',
    'Heirloom Chests',
    'Custom Furniture',
    'Gift & Occasion Pieces',
    'Home Décor & Signs',
    'Custom Commissions',
    'Camper & RV Interiors',
    'Countertops & Cutting Boards',
    'Custom Shelving',
  ];

  test('section heading says Nine Specialties', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#services .section-title')).toContainText('Nine Specialties');
  });

  test('all 9 service cards are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.service-card')).toHaveCount(9);
  });

  for (const title of SERVICE_TITLES) {
    test(`service card "${title}" is present`, async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.service-card h3', { hasText: title })).toBeVisible();
    });
  }

  test('each service card has an image', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.service-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('.svc-icon img')).toBeAttached();
    }
  });

  test('service card images load without error', async ({ page }) => {
    const brokenImages = [];
    page.on('response', res => {
      if (res.request().resourceType() === 'image' && !res.ok()) {
        brokenImages.push(res.url());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(brokenImages).toHaveLength(0);
  });
});

// ── Portfolio ─────────────────────────────────────────────────────────────────

test.describe('Portfolio', () => {
  test('portfolio section exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portfolio')).toBeAttached();
  });

  test('section heading is correct', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portfolio .section-title')).toContainText('Portfolio');
  });

  test('has 20 portfolio items', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.port-item')).toHaveCount(20);
  });

  test('all portfolio items have an image', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.port-item');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i).locator('img')).toBeAttached();
    }
  });

  test('clicking a portfolio item opens the lightbox', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
    await page.locator('.port-item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
    await expect(page.locator('#lightbox-img')).toBeVisible();
  });

  test('lightbox closes on close button click', async ({ page }) => {
    await page.goto('/');
    await page.locator('.port-item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
    await page.locator('#lightbox-close').click();
    await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
  });

  test('lightbox closes on Escape key', async ({ page }) => {
    await page.goto('/');
    await page.locator('.port-item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
  });

  test('lightbox closes on backdrop click', async ({ page }) => {
    await page.goto('/');
    await page.locator('.port-item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
    await page.locator('#lightbox').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
  });

  test('Start a Project button links to #contact', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.port-btn[href="#contact"]')).toBeVisible();
  });
});

// ── Contact Form ──────────────────────────────────────────────────────────────

test.describe('Contact Form', () => {
  test('contact section exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('form has all required fields', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[name="first_name"]')).toBeAttached();
    await expect(page.locator('input[name="last_name"]')).toBeAttached();
    await expect(page.locator('input[name="email"]')).toBeAttached();
    await expect(page.locator('select[name="service"]')).toBeAttached();
    await expect(page.locator('textarea[name="message"]')).toBeAttached();
  });

  test('all required fields have required attribute', async ({ page }) => {
    await page.goto('/');
    for (const sel of ['input[name="first_name"]', 'input[name="last_name"]', 'input[name="email"]', 'select[name="service"]', 'textarea[name="message"]']) {
      const el = page.locator(sel);
      await expect(el).toHaveAttribute('required', '');
    }
  });

  test('email field rejects non-email input', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[name="email"]').fill('notanemail');
    await page.locator('input[name="first_name"]').fill('Jane');
    await page.locator('input[name="last_name"]').fill('Smith');
    // Try to submit — browser validation should block it
    const isValid = await page.locator('input[name="email"]').evaluate(el => el.checkValidity());
    expect(isValid).toBe(false);
  });
});

// ── Images ────────────────────────────────────────────────────────────────────

test.describe('Images', () => {
  test('no broken images on page load', async ({ page }) => {
    const broken = [];
    page.on('response', res => {
      if (res.request().resourceType() === 'image' && !res.ok()) {
        broken.push(res.url());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(broken, `Broken images: ${broken.join(', ')}`).toHaveLength(0);
  });

  test('about section image loads', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('#about img').first();
    await expect(img).toBeAttached();
    const natural = await img.evaluate(el => el.naturalWidth);
    expect(natural).toBeGreaterThan(0);
  });
});

// ── Fade animations ───────────────────────────────────────────────────────────

test.describe('Animations', () => {
  test('fade-up elements become visible when scrolled into view', async ({ page }) => {
    await page.goto('/');
    // Scroll to services section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const visibleCards = page.locator('#services .service-card.visible');
    await expect(visibleCards.first()).toBeAttached();
  });
});

// ── Page metadata ─────────────────────────────────────────────────────────────

test.describe('Page metadata', () => {
  test('page has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Heinemann Farms/);
  });

  test('meta description is set', async ({ page }) => {
    await page.goto('/');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc.length).toBeGreaterThan(20);
  });

  test('canonical URL is set', async ({ page }) => {
    await page.goto('/');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('heinemannfarmsllc.com');
  });
});
