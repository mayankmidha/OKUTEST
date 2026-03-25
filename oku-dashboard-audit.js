/**
 * OKU THERAPY — DASHBOARD AUDIT SCRIPT
 * 
 * SETUP (run once):
 *   npm install playwright
 *   npx playwright install chromium
 * 
 * RUN:
 *   node oku-dashboard-audit.js --email YOUR_EMAIL --password YOUR_PASSWORD
 * 
 * OUTPUT:
 *   ./audit-results/report.json   — full error + status report
 *   ./audit-results/screenshots/  — one screenshot per route
 *   ./audit-results/console-logs/ — browser console errors per route
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:3000';

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
};

const CREDENTIALS = {
  email: getArg('email') || 'client@demo.com',
  password: getArg('password') || 'demo123',
};

// All routes to test after login
const ROUTES_TO_TEST = [
  // ── Public pages ──
  { url: '/',             label: 'Homepage',          auth: false },
  { url: '/services',     label: 'Services',          auth: false },
  { url: '/therapists',   label: 'Therapists',        auth: false },
  { url: '/people',       label: 'People (alt)',       auth: false },
  { url: '/about-us',     label: 'About Us',          auth: false },
  { url: '/contact',      label: 'Contact',           auth: false },
  { url: '/blog',         label: 'Blog',              auth: false },

  // ── Auth pages ──
  { url: '/auth/login',               label: 'Login',              auth: false },
  { url: '/auth/signup',              label: 'Sign Up',            auth: false },
  { url: '/auth/practitioner-signup', label: 'Practitioner Signup',auth: false },

  // ── Client dashboard ──
  { url: '/dashboard/client',                    label: 'Client — Home',           auth: true },
  { url: '/dashboard/client/therapists',         label: 'Client — Browse Therapists', auth: true },
  { url: '/dashboard/client/sessions',           label: 'Client — Sessions',       auth: true },
  { url: '/dashboard/client/assessments',        label: 'Client — Assessments',    auth: true },
  { url: '/dashboard/client/book',               label: 'Client — Book',           auth: true },
  { url: '/dashboard/client/mood',              label: 'Client — Mood',           auth: true },
  { url: '/dashboard/client/messages',           label: 'Client — Messages',       auth: true },
  { url: '/dashboard/client/profile',            label: 'Client — Profile',        auth: true },

  // ── Provider/practitioner dashboard ──
  { url: '/practitioner/dashboard',              label: 'Practitioner — Home',      auth: true },
  { url: '/practitioner/clients',              label: 'Practitioner — Clients',   auth: true },
  { url: '/practitioner/appointments',         label: 'Practitioner — Sessions', auth: true },
  { url: '/practitioner/availability',         label: 'Practitioner — Availability', auth: true },
  { url: '/practitioner/messages',             label: 'Practitioner — Messages', auth: true },
  { url: '/practitioner/assessments',          label: 'Practitioner — Assessments',  auth: true },
  { url: '/practitioner/profile',              label: 'Practitioner — Profile',   auth: true },

  // ── Admin dashboard ──
  { url: '/admin/dashboard',                     label: 'Admin — Home',            auth: true },
  { url: '/admin/users',               label: 'Admin — Users',           auth: true },
  { url: '/admin/practitioners',       label: 'Admin — Practitioners',   auth: true },
  { url: '/admin/sessions',            label: 'Admin — Sessions',        auth: true },
];

// ─── SETUP OUTPUT DIRS ────────────────────────────────────────────────
const OUT_DIR       = path.join(__dirname, 'audit-results');
const SHOT_DIR      = path.join(OUT_DIR, 'screenshots');
const CONSOLE_DIR   = path.join(OUT_DIR, 'console-logs');

[OUT_DIR, SHOT_DIR, CONSOLE_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const slug = (str) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase();

const STATUS = { OK: '✅ OK', REDIRECT: '🔀 Redirect', NOT_FOUND: '❌ 404', ERROR: '🔴 Error', AUTH_WALL: '🔒 Auth Wall', LOADING: '⏳ JS-only' };

async function testRoute(page, route, consoleErrors) {
  const result = {
    url: route.url,
    label: route.label,
    fullUrl: `${BASE_URL}${route.url}`,
    requiresAuth: route.auth,
    finalUrl: null,
    httpStatus: null,
    status: null,
    pageTitle: null,
    h1Text: null,
    visibleText: null,
    consoleErrors: [],
    networkErrors: [],
    screenshotFile: null,
    loadTimeMs: null,
    notes: [],
  };

  const errors = [];
  const networkFails = [];

  page.removeAllListeners('console');
  page.removeAllListeners('requestfailed');

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  page.on('requestfailed', req => {
    networkFails.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });

  const t0 = Date.now();
  let httpStatus = null;

  try {
    const response = await page.goto(`${BASE_URL}${route.url}`, {
      waitUntil: 'networkidle',
      timeout: 20000,
    });

    httpStatus = response?.status();
    result.httpStatus = httpStatus;
    result.finalUrl = page.url();
    result.loadTimeMs = Date.now() - t0;

    // Check redirect
    const wasRedirected = result.finalUrl !== `${BASE_URL}${route.url}`;

    // Grab content
    result.pageTitle = await page.title().catch(() => null);
    result.h1Text = await page.$eval('h1', el => el.textContent?.trim()).catch(() => null);
    result.visibleText = await page.evaluate(() => document.body.innerText?.slice(0, 300)).catch(() => null);

    // Classify status
    if (httpStatus === 404) {
      result.status = STATUS.NOT_FOUND;
    } else if (wasRedirected && result.finalUrl.includes('/auth/login')) {
      result.status = STATUS.AUTH_WALL;
      result.notes.push(`Redirected to login from ${route.url}`);
    } else if (wasRedirected) {
      result.status = STATUS.REDIRECT;
      result.notes.push(`Redirected to: ${result.finalUrl}`);
    } else if (result.visibleText?.includes('Loading...') && !result.h1Text) {
      result.status = STATUS.LOADING;
      result.notes.push('Page renders only "Loading..." — JS-only, no SSR');
    } else if (httpStatus >= 500) {
      result.status = STATUS.ERROR;
    } else {
      result.status = STATUS.OK;
    }

    // Screenshot
    const shotName = `${slug(route.label)}.png`;
    const shotPath = path.join(SHOT_DIR, shotName);
    await page.screenshot({ path: shotPath, fullPage: true });
    result.screenshotFile = shotName;

  } catch (err) {
    result.status = STATUS.ERROR;
    result.notes.push(`Exception: ${err.message}`);
    result.loadTimeMs = Date.now() - t0;
    try {
      const shotName = `${slug(route.label)}-error.png`;
      await page.screenshot({ path: path.join(SHOT_DIR, shotName), fullPage: true });
      result.screenshotFile = shotName;
    } catch (_) {}
  }

  result.consoleErrors = errors;
  result.networkErrors = networkFails;

  // Save console log
  if (errors.length || networkFails.length) {
    const logPath = path.join(CONSOLE_DIR, `${slug(route.label)}.txt`);
    fs.writeFileSync(logPath, [
      `Route: ${route.url}`,
      `Label: ${route.label}`,
      `Status: ${result.status}`,
      '',
      '── Console Errors ──',
      ...errors,
      '',
      '── Network Failures ──',
      ...networkFails,
    ].join('\n'));
  }

  return result;
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
async function login(page) {
  console.log('\n🔐 Attempting login...');
  await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle', timeout: 20000 });

  // Wait for JS to render form
  await page.waitForTimeout(3000);

  const pageText = await page.evaluate(() => document.body.innerText);

  // Try to find email + password fields
  const emailField = await page.$('input[type="email"], input[name="email"], input[placeholder*="mail" i]');
  const passField  = await page.$('input[type="password"]');

  if (!emailField || !passField) {
    console.log('⚠  Could not find login form fields. Page text:');
    console.log(pageText.slice(0, 500));
    console.log('\n  The login page may be JS-only and failed to render, or uses a different form structure.');
    return false;
  }

  await emailField.fill(CREDENTIALS.email);
  await passField.fill(CREDENTIALS.password);

  // Take screenshot of filled form
  await page.screenshot({ path: path.join(SHOT_DIR, '00-login-filled.png') });

  // Submit
  const submitBtn = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Sign In")');
  if (submitBtn) {
    await submitBtn.click();
  } else {
    await passField.press('Enter');
  }

  await page.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2000);

  const afterUrl = page.url();
  const loggedIn = !afterUrl.includes('/auth/login');

  await page.screenshot({ path: path.join(SHOT_DIR, '00-login-result.png') });

  if (loggedIn) {
    console.log(`✅ Logged in — now at: ${afterUrl}`);
  } else {
    console.log(`❌ Login failed — still at login page`);
    console.log('   Check credentials or login form structure');
  }

  return loggedIn;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  OKU THERAPY — DASHBOARD AUDIT');
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Routes: ${ROUTES_TO_TEST.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });
  const page = await context.newPage();

  // Login first
  const isLoggedIn = await login(page);
  if (!isLoggedIn) {
    console.log('\n⚠  Proceeding without auth — dashboard routes will show auth walls\n');
  }

  // Test all routes
  const results = [];
  let passed = 0, failed = 0, authWalled = 0, redirected = 0, jsOnly = 0;

  for (const route of ROUTES_TO_TEST) {
    process.stdout.write(`  Testing ${route.label.padEnd(35)} `);
    const result = await testRoute(page, route, []);
    results.push(result);

    console.log(`${result.status}  (${result.loadTimeMs}ms)`);

    if (result.status === STATUS.OK) passed++;
    else if (result.status === STATUS.AUTH_WALL) authWalled++;
    else if (result.status === STATUS.REDIRECT) redirected++;
    else if (result.status === STATUS.LOADING) { jsOnly++; failed++; }
    else failed++;

    if (result.consoleErrors.length) {
      console.log(`    ⚠  ${result.consoleErrors.length} console error(s)`);
    }
    if (result.notes.length) {
      result.notes.forEach(n => console.log(`    → ${n}`));
    }
  }

  await browser.close();

  // ─── REPORT ────────────────────────────────────────────────────────────────
  const report = {
    meta: {
      auditDate: new Date().toISOString(),
      target: BASE_URL,
      loginSuccess: isLoggedIn,
      totalRoutes: ROUTES_TO_TEST.length,
      summary: { passed, failed, authWalled, redirected, jsOnly },
    },
    results,
  };

  const reportPath = path.join(OUT_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Human-readable summary
  const summaryLines = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '  AUDIT SUMMARY',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `  Login success : ${isLoggedIn ? 'YES' : 'NO'}`,
    `  Total routes  : ${ROUTES_TO_TEST.length}`,
    `  ✅ OK          : ${passed}`,
    `  🔒 Auth wall  : ${authWalled}`,
    `  🔀 Redirect   : ${redirected}`,
    `  ❌ Failed     : ${failed}`,
    '',
    '  FAILED / AUTH-WALLED ROUTES:',
    ...results
      .filter(r => r.status !== STATUS.OK)
      .map(r => `  ${r.status}  ${r.url}  →  ${r.notes[0] || r.h1Text || ''}`),
    '',
    `  Screenshots → ${SHOT_DIR}`,
    `  Full report → ${reportPath}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ];

  const summaryText = summaryLines.join('\n');
  console.log('\n' + summaryText);
  fs.writeFileSync(path.join(OUT_DIR, 'summary.txt'), summaryText);

  console.log('\n✅ Audit complete. Share audit-results/summary.txt and report.json back here.\n');
})();
