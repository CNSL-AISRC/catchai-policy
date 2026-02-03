const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Configuration
const DOCS_BASE_DIR = path.join(__dirname, '../docs');
const OUTPUT_DIR = path.join(__dirname, '../output');
const LOCALES = ['en', 'kr'];

// Ensure output directory and locale subdirectories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

LOCALES.forEach(locale => {
  const localeDir = path.join(OUTPUT_DIR, locale);
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }
});

// HTML template for wrapping markdown content
const htmlTemplate = (title, content, locale = 'en') => `<!DOCTYPE html>
<html lang="${locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${title}">
    <title>${title} - CatchAI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 40px;
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            font-size: 2.5em;
        }

        h2 {
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.8em;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }

        h3 {
            color: #34495e;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 1.4em;
        }

        p {
            margin-bottom: 15px;
            text-align: justify;
        }

        ul, ol {
            margin-left: 30px;
            margin-bottom: 15px;
        }

        li {
            margin-bottom: 8px;
        }

        strong {
            color: #2c3e50;
            font-weight: 600;
        }

        code {
            background: #ecf0f1;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }

        pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 15px 0;
        }

        pre code {
            background: none;
            padding: 0;
            color: inherit;
        }

        a {
            color: #3498db;
            text-decoration: none;
            transition: color 0.3s;
        }

        a:hover {
            color: #2980b9;
            text-decoration: underline;
        }

        .last-updated {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
        }

        .nav-links {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .nav-links a {
            display: inline-block;
            padding: 10px 20px;
            background: #3498db;
            color: white;
            border-radius: 5px;
            transition: background 0.3s;
        }

        .nav-links a:hover {
            background: #2980b9;
            text-decoration: none;
        }

        blockquote {
            border-left: 4px solid #3498db;
            margin: 15px 0;
            padding: 10px 15px;
            background: #ecf0f1;
            border-radius: 3px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        th, td {
            border: 1px solid #bdc3c7;
            padding: 10px;
            text-align: left;
        }

        th {
            background: #3498db;
            color: white;
        }

        tr:nth-child(even) {
            background: #ecf0f1;
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }

            h1 {
                font-size: 1.8em;
            }

            h2 {
                font-size: 1.4em;
            }

            .nav-links {
                flex-direction: column;
            }

            .nav-links a {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
        <div class="nav-links">
            <a href="index.html">← Back to Home</a>
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms-of-use.html">Terms of Use</a>
            <a href="privacy-statement.html">Privacy Statement</a>
            <a href="california-notice.html">California Notice</a>
        </div>
    </div>
</body>
</html>`;

// Function to convert markdown to HTML
function convertMarkdownToHTML() {
  try {
    console.log('Starting markdown to HTML conversion...\n');

    LOCALES.forEach(locale => {
      const DOCS_DIR = path.join(DOCS_BASE_DIR, locale);
      
      // Check if locale docs directory exists
      if (!fs.existsSync(DOCS_DIR)) {
        console.warn(`⚠ Warning: ${locale} docs directory not found at ${DOCS_DIR}`);
        return;
      }

      // Get all markdown files
      const files = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));
      
      console.log(`Building for locale: ${locale}`);
      console.log(`Found ${files.length} markdown files\n`);
      
      files.forEach(file => {
        const filePath = path.join(DOCS_DIR, file);
        const filename = path.basename(file, '.md');
        const localeOutputDir = path.join(OUTPUT_DIR, locale);
        const outputPath = path.join(localeOutputDir, `${filename}.html`);

        // Read markdown file
        const markdown = fs.readFileSync(filePath, 'utf-8');

        // Convert to HTML
        const htmlContent = marked.parse(markdown);

        // Get the title from the first h1 tag
        const titleMatch = markdown.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename;

        // Wrap in HTML template with locale
        const fullHTML = htmlTemplate(title, htmlContent, locale);

        // Write output file
        fs.writeFileSync(outputPath, fullHTML);
        console.log(`✓ Converted: ${file} → ${locale}/${filename}.html`);
      });
      
      console.log('');
    });

    // Create index pages for each locale
    createIndexPages();

    console.log('✓ Build completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during build:', error.message);
    process.exit(1);
  }
}

// Create index pages for each locale
function createIndexPages() {
  LOCALES.forEach(locale => {
    const indexHTML = `<!DOCTYPE html>
<html lang="${locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="CatchAI Policy Documents">
    <title>Policy Documents - CatchAI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 40px;
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            font-size: 2.5em;
        }

        .subtitle {
            color: #7f8c8d;
            font-size: 1.1em;
            margin-bottom: 30px;
        }

        .documents-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .document-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            color: white;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .document-card:nth-child(2) {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .document-card:nth-child(3) {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .document-card:nth-child(4) {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .document-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .document-card h2 {
            font-size: 1.5em;
            margin-bottom: 10px;
        }

        .document-card p {
            font-size: 0.95em;
            opacity: 0.9;
            margin-bottom: 15px;
            flex-grow: 1;
        }

        .document-card .link-btn {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 15px;
            border-radius: 5px;
            transition: background 0.3s;
            width: fit-content;
            margin-top: auto;
        }

        .document-card .link-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            text-align: center;
            color: #7f8c8d;
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }

            h1 {
                font-size: 1.8em;
            }

            .documents-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CatchAI Policy Documents</h1>
        <p class="subtitle">Legal documents and policies that govern our services</p>

        <div class="documents-grid">
            <a href="privacy-policy.html" class="document-card">
                <div>
                    <h2>Privacy Policy</h2>
                    <p>Learn how we collect, use, and protect your personal information.</p>
                </div>
                <span class="link-btn">Read More →</span>
            </a>

            <a href="terms-of-use.html" class="document-card">
                <div>
                    <h2>Terms of Use</h2>
                    <p>Understand the terms and conditions governing your use of our services.</p>
                </div>
                <span class="link-btn">Read More →</span>
            </a>

            <a href="privacy-statement.html" class="document-card">
                <div>
                    <h2>Privacy Statement</h2>
                    <p>Detailed information about how we handle your data and privacy rights.</p>
                </div>
                <span class="link-btn">Read More →</span>
            </a>

            <a href="california-notice.html" class="document-card">
                <div>
                    <h2>California Notice</h2>
                    <p>California Consumer Privacy Act (CCPA) disclosures and financial incentive programs.</p>
                </div>
                <span class="link-btn">Read More →</span>
            </a>
        </div>

        <div class="footer">
            <p>&copy; 2026 CatchAI. All rights reserved. | Last updated: February 03, 2026</p>
        </div>
    </div>
</body>
</html>`;

    const localeOutputDir = path.join(OUTPUT_DIR, locale);
    fs.writeFileSync(path.join(localeOutputDir, 'index.html'), indexHTML);
    console.log(`✓ Created: ${locale}/index.html`);
  });

  // Create root index page with language selection
  createRootIndexPage();
}

// Create root index page with language selection
function createRootIndexPage() {
  const rootIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="CatchAI Policy Documents - Select Language">
    <title>CatchAI - Select Language</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            max-width: 600px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 60px 40px;
            text-align: center;
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 2.5em;
        }

        p {
            color: #7f8c8d;
            font-size: 1.1em;
            margin-bottom: 40px;
        }

        .language-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 40px 0;
        }

        .language-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            border-radius: 8px;
            text-decoration: none;
            color: white;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .language-card:nth-child(2) {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .language-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .language-card h2 {
            font-size: 1.8em;
            margin-bottom: 10px;
        }

        .language-card p {
            margin: 0;
            color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 768px) {
            .container {
                padding: 40px 20px;
            }

            h1 {
                font-size: 1.8em;
            }

            .language-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CatchAI Policies</h1>
        <p>Select your preferred language</p>

        <div class="language-grid">
            <a href="en/index.html" class="language-card">
                <h2>English</h2>
                <p>View in English</p>
            </a>

            <a href="kr/index.html" class="language-card">
                <h2>한국어</h2>
                <p>한국어로 보기</p>
            </a>
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), rootIndexHTML);
  console.log('✓ Created: index.html (language selection)');
}

// Run the build
convertMarkdownToHTML();
