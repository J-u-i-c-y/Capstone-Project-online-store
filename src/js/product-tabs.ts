export const initProductTabs = (): void => {
  const tabBtns = document.querySelectorAll(".tabs-nav__btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`tab-${targetTab}`)?.classList.add("active");
    });
  });

  const form = document.getElementById("review-form") as HTMLFormElement | null;
  const statusDiv = document.getElementById("review-status");

  if (!form || !statusDiv) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    statusDiv.className = "form-status";
    statusDiv.textContent = "";

    form
      .querySelectorAll(".review-form-control")
      .forEach((el) => el.classList.remove("input-error"));

    const rating = (
      form.querySelector('input[name="rating"]:checked') as HTMLInputElement
    )?.value;
    const text = (
      document.getElementById("review-text") as HTMLTextAreaElement
    ).value.trim();
    const name = (
      document.getElementById("review-name") as HTMLInputElement
    ).value.trim();
    const email = (
      document.getElementById("review-email") as HTMLInputElement
    ).value.trim();

    let isValid = true;

    if (!rating) {
      isValid = false;
    }
    if (!text) {
      isValid = false;
      (
        document.getElementById("review-text") as HTMLTextAreaElement
      ).classList.add("input-error");
    }
    if (!name) {
      isValid = false;
      (
        document.getElementById("review-name") as HTMLInputElement
      ).classList.add("input-error");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      isValid = false;
      (
        document.getElementById("review-email") as HTMLInputElement
      ).classList.add("input-error");
    }

    if (isValid) {
      statusDiv.textContent = "Submitting...";

      setTimeout(() => {
        statusDiv.textContent =
          "Thank you! Your review has been submitted successfully.";
        statusDiv.classList.add("form-status_success");

        form.reset();
        form
          .querySelectorAll('input[type="radio"]')
          .forEach((input) => ((input as HTMLInputElement).checked = false));
      }, 1000);
    } else {
      statusDiv.textContent = "Please fill in all required fields correctly.";
      statusDiv.classList.add("form-status_error");
    }
  });
};
