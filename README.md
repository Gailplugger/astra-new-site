# AstraForensics Website

A modern, responsive cybersecurity website built from extracted content of astraforensics.in

## 🚀 Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Modern UI** - Cybersecurity-themed design with gradient effects and animations
- **5 Complete Pages**:
  - Home - Hero section, features, testimonials
  - About - Mission, vision, journey timeline, core values
  - Courses - 6 cybersecurity courses with details
  - Services - Coming soon page with service previews
  - Contact - Contact form and information

## 📁 Project Structure

```
astraforensics-website/
├── index.html          # Home page
├── about.html          # About us page
├── courses.html        # Courses listing
├── services.html       # Services (coming soon)
├── contact.html        # Contact page with form
├── styles.css          # Complete styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Design Features

- **Dark Theme** - Cybersecurity-inspired dark color scheme
- **Gradient Accents** - Modern gradients throughout
- **Smooth Animations** - Scroll animations and hover effects
- **Mobile Navigation** - Hamburger menu for mobile devices
- **Interactive Elements** - Buttons, forms, and cards
- **Code-themed Typography** - Monospace fonts for tech feel

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript** - Vanilla JS for interactivity
- **Font Awesome** - Icons (via CDN)

## 🚀 How to Use

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Use Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Then open: http://localhost:8000
```

## 📝 Key Components

### Navigation
- Fixed header with smooth scroll
- Mobile-responsive hamburger menu
- Active page indicators

### Hero Section
- Animated code rain background
- Gradient text effects
- CTA buttons

### Feature Cards
- Hover animations
- Icon integration
- Responsive grid layout

### Timeline (About Page)
- Visual journey representation
- Circular year markers
- Gradient connecting line

### Course Cards
- Level indicators (Beginner/Intermediate/Advanced)
- Duration badges
- Feature lists with icons
- Enroll buttons

### Contact Form
- Form validation
- Success/error messages
- Animated inputs
- Icon-enhanced fields

### Footer
- Multi-column layout
- Social media links
- Quick navigation
- Dynamic copyright year

## 🎯 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #00d4ff;    /* Main accent color */
    --secondary-color: #ff006e;  /* Secondary accent */
    --accent-color: #8338ec;     /* Gradient accent */
    --dark-bg: #0a0e27;          /* Background */
}
```

### Content
- Edit HTML files directly for text content
- Update contact information in `contact.html`
- Modify course details in `courses.html`
- Add/remove services in `services.html`

### Contact Form
Currently uses simulated submission. To connect to a real backend:

1. Replace the setTimeout in `script.js` with actual API call:
```javascript
fetch('your-api-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    // Handle success
})
.catch(error => {
    // Handle error
});
```

## 📱 Responsive Breakpoints

- **Desktop**: > 968px
- **Tablet**: 600px - 968px
- **Mobile**: < 600px

## ✨ JavaScript Features

- Mobile navigation toggle
- Smooth scroll for anchor links
- Dynamic navbar on scroll
- Contact form handling
- Scroll-triggered animations
- Back to top button
- Form validation enhancement
- Console welcome message

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📦 External Dependencies

- Font Awesome 6.4.0 (CDN)
- No other external dependencies!

## 🌟 Features to Add

Potential enhancements:
- [ ] Blog section
- [ ] User authentication
- [ ] Course enrollment system
- [ ] Payment integration
- [ ] Live chat support
- [ ] Newsletter subscription
- [ ] Search functionality
- [ ] Dark/Light mode toggle
- [ ] Multi-language support

## 📞 Contact Information

As per the website:
- **Email**: info@astraforensics.com, support@astraforensics.com
- **Phone**: +1 (234) 567-890
- **Address**: 123 Cyber Security Lane, Digital City, DC 12345
- **Support**: 24/7 Available

## 📄 License

Content based on AstraForensics website. This is a redesign/recreation.

## 🙏 Credits

- **Original Content**: AstraForensics (https://astraforensics.in/)
- **Founder**: Kartik Goyal
- **CTO**: Nitin Kumar
- **Redesign**: Created as a modern implementation

## 🐛 Known Issues

- Code rain effect may slow down on older devices (can be disabled)
- Form submission is simulated (needs backend integration)
- Social media links are placeholders

## 💡 Tips

1. **Performance**: Remove code rain effect if performance is an issue
2. **SEO**: Add meta tags and descriptions for each page
3. **Analytics**: Add Google Analytics or similar tracking
4. **Security**: Implement HTTPS when deploying
5. **Accessibility**: Test with screen readers and improve ARIA labels

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings > Pages
3. Select branch and folder
4. Save and wait for deployment

### Netlify
1. Drag and drop folder to Netlify
2. Configure custom domain if needed
3. Site is live!

### Traditional Hosting
1. Upload all files via FTP
2. Ensure proper file permissions
3. Configure domain DNS

## 📚 Documentation

For more information about the original site content, see:
`astraforensics_website_content.md`

---

**Built with ❤️ for the cybersecurity community**

*Making cybersecurity knowledge accessible, real, and fun.*
