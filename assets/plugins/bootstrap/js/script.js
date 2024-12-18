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
                      .then(response => response.text())
                      .then(xmlText => {
                         const parser = new DOMParser();
                         const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                         const urls = Array.from(xmlDoc.querySelectorAll('loc')).map(loc => loc.textContent);
                            
                         Promise.all(urls.map(url=>fetch(url).then(response=>response.text())))
                           .then(responses => {
                              const pagesContent = responses.map(response=> {
                                  const tempDiv = document.createElement('div');
                                      tempDiv.innerHTML = response;
                                       const title = getTextContent(tempDiv.querySelector("h1"));
                                       const text = getTextContent(tempDiv.querySelector("body"));
                                       return { url, title, text };
                                  })
                                const filteredPages = pagesContent.filter(page=> page.title.toLowerCase().includes(searchTerm.toLowerCase()) || page.text.toLowerCase().includes(searchTerm.toLowerCase()));
                                
                                if (filteredPages.length > 0){
                                    const html = filteredPages.map(page =>
                                       `<div class="search-result">
                                              <h3><a href="${page.url}">${page.title}</a></h3>
                                          </div>`
                                          ).join('');
                                        resultsContainer.innerHTML = html;
                                }else{
                                   resultsContainer.innerHTML = `<p>No results found for "${searchTerm}".</p>`;
                                }
                           })
                         })
                         
             } else if (resultsContainer)
             {
                 resultsContainer.innerHTML = `<p>Please enter a search query.</p>`;
             }
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