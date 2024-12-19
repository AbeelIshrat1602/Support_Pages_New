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

    // Search Functionality
    const searchForm = document.querySelector(".search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const searchInput = document.querySelector(".search-input");
            const searchTerm = searchInput.value.trim();

            if (searchTerm) {
                window.location.href = `/search-results.html?query=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Function to extract text content from HTML elements
    const getTextContent = (element) => {
        if (!element) return "";
        return element.textContent || element.innerText || "";
    };

    // Search results page logic
    if (window.location.pathname.includes("search-results.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get("query");
        const resultsContainer = document.getElementById("search-results-container");

        if (searchTerm && resultsContainer) {
            fetch("./sitemap.xml")
                .then((response) => response.text())
                .then((xmlText) => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                    const urls = Array.from(xmlDoc.querySelectorAll("loc")).map((loc) => loc.textContent);

                    Promise.all(
                        urls.map((url) => fetch(url).then((response) => response.text()))
                    ).then((responses) => {
                        const pagesContent = responses.map((response, index) => {
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = response;
                            const title = getTextContent(tempDiv.querySelector("h1"));
                            const text = getTextContent(tempDiv.querySelector("body"));
                            return { url: urls[index], title, text };
                        });

                        const filteredPages = pagesContent.filter(
                            (page) =>
                                page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                page.text.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        if (filteredPages.length > 0) {
                            const html = filteredPages
                                .map(
                                    (page) =>
                                        `<div class="search-result">
                                            <h3><a href="${page.url}">${page.title}</a></h3>
                                        </div>`
                                )
                                .join("");
                            resultsContainer.innerHTML = html;
                        } else {
                            resultsContainer.innerHTML = `<p>No results found for "${searchTerm}".</p>`;
                        }
                    });
                });
        } else if (resultsContainer) {
            resultsContainer.innerHTML = `<p>Please enter a search query.</p>`;
        }
    }

    // Feedback Widget Integration
    const injectFeedbackWidget = () => {
        // Define the Feedback Widget as an HTML string
        const feedbackWidgetHTML = `
        <!-- Feedback Widget -->
        <div id="feedback-widget">
            <button id="open-feedback">
                Did not Find What You Were Looking For?
            </button>
            <div id="feedback-form" style="display: none; width: 400px; height: 400px; background-color: white;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25); border-radius: 10px; overflow: hidden;">
                <iframe 
                    src="https://forms.gle/MxEmyoLz9VJF11f2A" 
                    frameborder="0" 
                    style="width: 100%; height: 100%;" 
                    allowfullscreen>
                </iframe>
            </div>
        </div>

        <!-- Feedback Widget CSS -->
        <style>
            #feedback-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            #open-feedback {
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 16px;
                margin-bottom: 10px;
                transition: background-color 0.3s ease;
            }

            #open-feedback:hover {
                background-color: #0056b3;
            }
        </style>
        `;

        // Dynamically inject feedback widget into the page
        document.body.insertAdjacentHTML("beforeend", feedbackWidgetHTML);

        // Add functionality for toggling the feedback form
        const openFeedbackButton = document.getElementById("open-feedback");
        const feedbackForm = document.getElementById("feedback-form");

        if (openFeedbackButton && feedbackForm) {
            openFeedbackButton.addEventListener("click", () => {
                feedbackForm.style.display =
                    feedbackForm.style.display === "block" ? "none" : "block";
            });
        }
    };

    // Inject Feedback Widget into the page
    injectFeedbackWidget();
});