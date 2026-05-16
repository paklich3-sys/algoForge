/**
 * AlgoForge — shared navigation JS for sub-pages (blog, cases, news).
 * Handles: navbar scroll effect, mobile menu toggle, close on link click.
 */
(function () {
    'use strict';

    // --- Navbar scroll effect ---
    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // --- Mobile menu toggle ---
    // Support both id variants used across pages
    var btn  = document.getElementById('mobile-btn') || document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', function () {
            menu.classList.toggle('hidden');
        });

        // Close when any link inside the mobile menu is clicked
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.classList.add('hidden');
            });
        });
    }
})();
