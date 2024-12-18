document.addEventListener("DOMContentLoaded", () => {
    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll(".faq-item");
    const viewAllLink = document.getElementById("view-all-link");
    let allExpanded = false; // Tracks whether all FAQs are expanded or collapsed

    // Function to toggle all FAQs
    const toggleAllFAQs = () => {
        faqItems.forEach((item) => {
            if (allExpanded) {
                item.classList.remove("active"); // Collapse all
            } else {
                item.classList.add("active"); // Expand all
            }
        });

        // Update the text of the "View All" link
        if (viewAllLink) {
            viewAllLink.textContent = allExpanded ? "View All" : "Collapse All";
        }

        // Toggle the allExpanded state
        allExpanded = !allExpanded;
    };

    // Attach event listener to View All link
    if (viewAllLink) {
        viewAllLink.addEventListener("click", toggleAllFAQs);
    }

    // Attach individual toggle functionality to each FAQ item
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", () => {
                item.classList.toggle("active");
            });
        }
    });

    // Hamburger Menu Toggle Functionality
    const ham = document.querySelector(".ham");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (ham && mobileMenu) {
        ham.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
        });
    }

    // Feedback Widget Integration
    const injectFeedbackWidget = () => {
        // Use absolute path to ensure compatibility across directory levels
        const basePath = '/feedback-widget.html';

        fetch(basePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load feedback widget');
                }
                return response.text();
            })
            .then((html) => {
                // Inject the feedback widget into the body
                document.body.insertAdjacentHTML('beforeend', html);

                // Attach event listener to Feedback Button
                const openFeedbackButton = document.getElementById("open-feedback");
                const feedbackForm = document.getElementById("feedback-form");

                if (openFeedbackButton && feedbackForm) {
                    openFeedbackButton.addEventListener("click", () => {
                        feedbackForm.style.display =
                            feedbackForm.style.display === "block" ? "none" : "block";
                    });
                }
            })
            .catch((error) => console.error('Error loading the Feedback Widget:', error));
    };

    injectFeedbackWidget(); // Inject the widget into all pages
});