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

  // Add smooth scrolling enhancement for in-page anchors
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

/**
 * Route contact form to Featurebase.
 * Opens the feedback board in a new tab with URL params,
 * copies the user's message to clipboard for easy paste,
 * shows a light confirmation, and resets the form.
 */
function submitToFeaturebase(event) {
  event.preventDefault();
  const form = event.target;
  const name = (form.elements['name']?.value || '').trim();
  const email = (form.elements['email']?.value || '').trim();
  const message = (form.elements['message']?.value || '').trim();

  // Build a helpful payload for pasting on the board if needed
  const compiled = [
    `From: ${name || 'Anonymous'}`,
    email ? `Email: ${email}` : '',
    '',
    message
  ].filter(Boolean).join('\n');

  // Try to copy details for the user (fallbacks silently)
  if (navigator.clipboard && compiled) {
    navigator.clipboard.writeText(compiled).catch(() => {});
  }

  // Open Featurebase board with query params (in case they are supported)
  const base = 'https://feedback.lyds.me/dashboard/posts';
  const params = new URLSearchParams({
    source: 'website',
    name,
    email
    // deliberately not sending the full message as a query if it’s long;
    // user can paste from clipboard on the board.
  });
  window.open(`${base}?${params.toString()}`, '_blank');

  // UX feedback
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Opening Featurebase...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    form.reset();
    alert('We opened the feedback board in a new tab and copied your message to the clipboard. Paste it there to submit.');
  }, 600);
}
