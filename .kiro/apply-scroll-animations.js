// Helper script to document the scroll animation pattern
// This pattern should be applied to all service pages

const scrollAnimationCode = `
  useEffect(() => {
    window.scrollTo(0, 0);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
`;

const cssPattern = `
.animate-on-scroll {
  opacity: 0;
}
.animate-on-scroll.animate-visible.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
}
// ... etc for each animation type
`;

console.log('Apply this pattern to all service pages');
