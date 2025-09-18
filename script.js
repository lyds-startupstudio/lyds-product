document.addEventListener('DOMContentLoaded', () => {
  // Initialize animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  });

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in, [class*="fade-in-delay"]').forEach(el => {
    observer.observe(el);
  });

  // Add smooth scrolling enhancement
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

function scrollToFeatures() {
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    featuresSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Simulate form submission (replace with your backend integration)
  setTimeout(() => {
    alert(`Thanks, ${formData.get('name')}! We'll get back to you soon.`);
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1000);

  // For real implementation, replace the above with:
  // fetch('/api/contact', {
  //   method: 'POST',
  //   body: formData
  // }).then(response => {
  //   // Handle response
  // });
}

// Add scroll-triggered animations
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero');
  if (parallax) {
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  }
});
