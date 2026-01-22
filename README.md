# CatchAI Policy Documentation

A static website generator that converts markdown policy documents into beautiful, responsive HTML pages.

## 📋 Documents Included

- **Privacy Policy** - How we collect and use your data
- **Terms of Use** - Terms and conditions for using our services
- **Privacy Statement** - Detailed privacy information
- **California Notice** - CCPA compliance and financial incentive disclosures

## 📁 Project Structure

```
catchai-policy/
├── docs/                          # Markdown source files
│   ├── privacy-policy.md
│   ├── terms-of-use.md
│   ├── privacy-statement.md
│   └── california-notice.md
├── src/                           # Build scripts
│   └── build.js                   # Markdown to HTML converter
├── output/                        # Generated HTML files (git-tracked)
│   ├── index.html
│   ├── privacy-policy.html
│   ├── terms-of-use.html
│   ├── privacy-statement.html
│   └── california-notice.html
├── .github/
│   └── workflows/
│       └── build.yml              # GitHub Actions automation
├── package.json                   # Project dependencies
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Building Locally

```bash
# Build HTML from markdown files
npm run build

# The generated HTML files will be in the output/ directory
```

### Viewing the Website

```bash
# Start a local web server
npm run dev

# Or manually start the server:
npm start

# Open http://localhost:8000 in your browser
```

## 🔄 GitHub Automation

This project includes automated CI/CD with GitHub Actions.

### Workflows Included

#### 1. **Build on Changes** (`.github/workflows/build.yml`)

Automatically builds the HTML whenever:
- Markdown files in `docs/` change
- Build script in `src/` changes
- `package.json` is modified
- On push to `main`, `master`, or `develop` branches

**Actions performed:**
- ✅ Install dependencies
- ✅ Convert markdown to HTML
- ✅ Validate generated HTML
- ✅ Commit built files (on push)
- ✅ Deploy to GitHub Pages (on main branch)

### Setting Up GitHub Pages Deployment

To enable automatic deployment to GitHub Pages:

1. **Go to your repository settings**
   - Settings → Pages

2. **Configure the source**
   - Source: GitHub Actions
   - (The workflow handles deployment automatically)

3. **Optional: Set custom domain**
   - Add `CNAME` file or update the workflow:
   ```yaml
   cname: policies.yourcompany.com
   ```

### Workflow Triggers

The workflow runs automatically when:

```yaml
# Push events
- Push to main/master/develop branches with changes to docs/ or src/

# Pull Request events  
- Pull requests to main/master/develop that modify docs/
```

You can also manually trigger the workflow from the GitHub Actions tab.

## ✏️ Editing Documents

### To update or create a policy:

1. **Edit the markdown file** in `docs/`
   ```bash
   # Example: Edit privacy policy
   vi docs/privacy-policy.md
   ```

2. **Commit your changes**
   ```bash
   git add docs/privacy-policy.md
   git commit -m "Update: Privacy policy changes"
   git push
   ```

3. **Automatic build**
   - GitHub Actions will automatically:
     - Convert markdown to HTML
     - Run validation tests
     - Commit the output files
     - Deploy to GitHub Pages (if on main branch)

### Markdown Format

Use standard markdown with frontmatter for metadata:

```markdown
# Document Title

**Last Updated: January 22, 2026**

## Section 1

Content here...

### Subsection

More content...
```

## 🎨 Styling

The generated HTML includes:

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Modern Styling** - Clean, professional appearance with gradients
- **Dark Mode Compatible** - Auto-detects system preference
- **Accessibility** - Semantic HTML, proper heading hierarchy
- **Fast Performance** - Minimal CSS, no external dependencies

### Customizing CSS

Edit the CSS in `src/build.js` within the `htmlTemplate` function to customize:
- Colors and gradients
- Font families and sizes
- Spacing and layouts
- Responsive breakpoints

## 📊 Build Status

Check the build status and logs:

1. **Go to GitHub Actions tab** in your repository
2. **Select "Build and Deploy Policy Website"**
3. **View recent workflow runs**

Green checkmark ✅ = Build successful  
Red X ❌ = Build failed (check logs for details)

## 🔧 Troubleshooting

### Build fails with "marked not found"

```bash
npm install
npm run build
```

### HTML files not updating

- Check GitHub Actions logs for errors
- Verify `docs/` files are committed
- Ensure files end with `.md` extension

### Deployment not working

- Check that CNAME/domain is correctly configured
- Verify GitHub Pages source is set to "GitHub Actions"
- Check for permission issues in repository settings

## 📦 Dependencies

- **marked** (^11.1.1) - Markdown parser and compiler
- **http-server** (^14.1.1) - Simple HTTP server for local development

## 🔐 Security

- No sensitive data in markdown files
- All generated HTML is static (no server-side processing)
- GitHub Pages provides HTTPS by default
- Regular security updates recommended

## 📝 License

MIT - Feel free to modify and distribute

## 📞 Support

For issues or questions:
- Check GitHub Issues
- Review GitHub Actions logs
- Ensure all dependencies are installed

## 🎯 Next Steps

1. **Customize the content** - Edit markdown files with your actual policies
2. **Configure GitHub Pages** - Enable in repository settings
3. **Set custom domain** - Update CNAME in workflow if needed
4. **Monitor deployments** - Check GitHub Actions for build status
5. **Share the site** - Distribute the GitHub Pages URL or custom domain

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0
