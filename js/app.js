(() => {
  const config = window.FORSALES_CONFIG || {};
  const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  const supabaseClient = hasSupabaseConfig && window.supabase
    ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
    : null;

  const reviewList = document.querySelector("#review-list");
  const reviewForm = document.querySelector("#review-form");
  const formMessage = document.querySelector("#form-message");
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", {
      day: "numeric", month: "short", year: "numeric"
    }).format(date);
  };

  function renderReviews(reviews) {
    if (!reviewList) return;
    if (!reviews.length) {
      reviewList.innerHTML = '<article class="empty-state card"><span class="empty-flower">✿</span><p>Our review garden is waiting to bloom.</p><small>Be the first to leave a little note.</small></article>';
      return;
    }
    reviewList.innerHTML = reviews.map((review) => {
      const rating = Math.min(5, Math.max(1, Number(review.rating) || 5));
      return `<article class="review-card card">
        <div class="review-card-head"><strong class="review-author">${escapeHtml(review.customer_name)}</strong><time class="review-date">${escapeHtml(formatDate(review.created_at))}</time></div>
        <div class="review-stars" aria-label="${rating} out of 5 stars">${"★".repeat(rating)}<span style="opacity:.25">${"★".repeat(5-rating)}</span></div>
        <p class="review-body">${escapeHtml(review.review_text)}</p>
      </article>`;
    }).join("");
  }

  async function loadReviews() {
    if (!supabaseClient) return;
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("id, customer_name, rating, review_text, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Unable to load reviews:", error.message);
      return;
    }
    renderReviews(data || []);
  }

  async function submitReview(event) {
    event.preventDefault();
    if (!reviewForm || !formMessage) return;
    if (!supabaseClient) {
      formMessage.textContent = "Review submission will be available after the Supabase project is connected.";
      formMessage.classList.add("error");
      return;
    }

    const formData = new FormData(reviewForm);
    const payload = {
      customer_name: String(formData.get("customer_name") || "").trim(),
      rating: Number(formData.get("rating") || 5),
      review_text: String(formData.get("review_text") || "").trim(),
      published: false
    };
    if (!payload.customer_name || !payload.review_text || payload.rating < 1 || payload.rating > 5) return;

    const button = reviewForm.querySelector('button[type="submit"]');
    button.disabled = true;
    formMessage.classList.remove("error");
    formMessage.textContent = "Sending your lovely note…";
    const { error } = await supabaseClient.from("reviews").insert(payload);
    button.disabled = false;

    if (error) {
      console.error("Unable to submit review:", error.message);
      formMessage.textContent = "We couldn't send your review just now. Please try again later.";
      formMessage.classList.add("error");
      return;
    }
    reviewForm.reset();
    formMessage.textContent = "Thank you! Your review has been sent for approval. ♡";
  }

  if (reviewForm) reviewForm.addEventListener("submit", submitReview);
  loadReviews();
})();