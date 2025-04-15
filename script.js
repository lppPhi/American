document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-navigation a[data-target]');
    const contentSections = document.querySelectorAll('.content-section');
    const headerWrapper = document.querySelector('.fixed-header-wrapper'); // Get header height dynamically

    // Function to activate a section
    function activateSection(targetId) {
        // Deactivate all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Deactivate all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Activate the target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
             // Optional: Scroll to the top of the content area slightly below nav
             // Recalculate header height here for accuracy
             const headerHeight = headerWrapper?.offsetHeight || 135; // Provide fallback
             // Adjust scroll position to be slightly below the fixed header
             const scrollPosition = targetSection.offsetTop - headerHeight - 20; // 20px buffer
             window.scrollTo({ top: scrollPosition > 0 ? scrollPosition : 0, behavior: 'smooth' });

        } else {
            // Fallback to featured if target not found
            const defaultSection = document.getElementById('featured-content');
            if (defaultSection) {
                defaultSection.classList.add('active');
            }
        }

        // Activate the corresponding nav link
        const activeLink = document.querySelector(`.main-navigation a[data-target="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
             // Highlight the 'Featured' link if showing the default section
             const featuredLink = document.querySelector('.main-navigation a[data-target="featured-content"]');
             if (featuredLink && document.getElementById('featured-content')?.classList.contains('active')) {
                 featuredLink.classList.add('active');
             }
        }
    }

    // Event Listeners for Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('data-target');

            if (targetId) {
                event.preventDefault(); // Prevent default anchor jump
                activateSection(targetId);
                 // Update URL hash without jumping (optional, useful for sharing/bookmarking)
                 // Use replaceState to avoid filling browser history
                 // history.replaceState(null, null, `#${targetId.replace('-content', '')}`);
            } else {
                // If it's an external link, let it behave normally
                 navLinks.forEach(nav => nav.classList.remove('active'));
            }
        });
    });

    // Activate Section based on URL Hash on Load or Refresh
    function activateSectionFromHash() {
        // Use location.hash directly
        const hash = window.location.hash;
        const targetId = hash ? `${hash.substring(1)}-content` : 'featured-content'; // Default to featured if no hash

        // Check if the element exists before activating
        const elementExists = document.getElementById(targetId);

        if (elementExists) {
            activateSection(targetId);
            // Ensure correct scrolling occurs after initial load potentially completes rendering
            setTimeout(() => {
                const headerHeight = headerWrapper?.offsetHeight || 135;
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                   const scrollPosition = targetElement.offsetTop - headerHeight - 20;
                   // Only scroll if hash points to a section other than the default top one
                   if(targetId !== 'featured-content') {
                        window.scrollTo({ top: scrollPosition > 0 ? scrollPosition : 0, behavior: 'auto' }); // 'auto' for instant jump on load
                   }
                }
            }, 100); // Small delay to ensure layout is stable
        } else {
            activateSection('featured-content'); // Fallback if hash target doesn't exist
        }
    }

    // Activate initial section on load
    activateSectionFromHash();

    // Listen for hash changes (e.g., browser back/forward buttons)
    // Note: Manually clicking links already handles activation via the click listener.
    // This is primarily for back/forward or direct hash navigation.
    window.addEventListener('hashchange', activateSectionFromHash);


    console.log("Amex Gallery Initialized - Fixed Header");
});