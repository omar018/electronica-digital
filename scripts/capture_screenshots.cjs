const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const OUT_DIR = path.join(__dirname, '..', 'docs', 'images');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Simple static HTTP server for dist/
function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.png': 'image/png',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading ' + filePath);
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });

    server.listen(port, () => {
      resolve(server);
    });
    server.on('error', reject);
  });
}

async function capture() {
  const PORT = 4173;
  console.log('Iniciando servidor local en puerto', PORT);
  const server = await startServer(PORT);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  console.log('Lanzando Chrome desde:', chromePath);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 950, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const url = `http://localhost:${PORT}/`;
  console.log('Navegando a:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('1. Capturando vista general...');
  await page.screenshot({ path: path.join(OUT_DIR, '01_general_overview.png') });

  console.log('2. Capturando Double Dabble Binario a BCD...');
  await page.screenshot({ path: path.join(OUT_DIR, '02_doubledabble_bin2bcd.png') });

  console.log('3. Cambiando a Double Dabble Inverso (BCD a Binario)...');
  const bcd2binBtn = await page.waitForSelector('xpath///button[contains(text(), "BCD → Binario")]');
  if (bcd2binBtn) await bcd2binBtn.click();
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, '03_doubledabble_reverse.png') });

  console.log('4. Cambiando a Módulo 2: Multiplicación de Booth...');
  const boothTab = await page.waitForSelector('xpath///div[contains(text(), "BOOTH")]');
  if (boothTab) await boothTab.click();
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '04_booth_signed.png') });

  console.log('5. Cambiando a Booth Sin Signo...');
  const unsignedBtn = await page.waitForSelector('xpath///button[contains(text(), "Sin Signo")]');
  if (unsignedBtn) await unsignedBtn.click();
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, '05_booth_unsigned.png') });

  console.log('6. Cambiando a Módulo 3: División Binaria...');
  const divTab = await page.waitForSelector('xpath///div[contains(text(), "DIVISIÓN")]');
  if (divTab) await divTab.click();
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '06_division_restoring.png') });

  console.log('7. Abriendo modal de informe LaTeX...');
  const latexBtn = await page.waitForSelector('xpath///button[contains(., "Generar Informe LaTeX")]');
  if (latexBtn) await latexBtn.click();
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '07_latex_report_modal.png') });

  // Cerrar modal haciendo clic en el botón X
  const closeBtn = await page.waitForSelector('xpath///button[contains(@class, "hover:bg-slate-800")]');
  if (closeBtn) await closeBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  console.log('8. Cambiando a Módulo 4: Marco Teórico...');
  const guideTab = await page.waitForSelector('xpath///div[contains(text(), "MARCO TEÓRICO")]');
  if (guideTab) await guideTab.click();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '08_guide_theory.png') });

  console.log('Todas las capturas se guardaron exitosamente en docs/images/');
  await browser.close();
  server.close();
  process.exit(0);
}

capture().catch((err) => {
  console.error('Error durante la captura:', err);
  process.exit(1);
});
