const form = document.getElementById("contact-form") as HTMLFormElement | null;
const statusDiv = document.getElementById(
  "form-status",
) as HTMLDivElement | null;

if (form && statusDiv) {
  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateField = (
    input: HTMLInputElement | HTMLTextAreaElement,
  ): boolean => {
    const errorSpan = document.getElementById(
      `${input.id}-error`,
    ) as HTMLSpanElement | null;

    if (errorSpan) errorSpan.textContent = "";
    input.classList.remove("form__input_error");

    if (!input.value.trim()) {
      if (errorSpan) errorSpan.textContent = "This field is required.";
      input.classList.add("form__input_error");
      return false;
    }

    if (input.id === "email" && !isValidEmail(input.value)) {
      if (errorSpan)
        errorSpan.textContent = "Please enter a valid email address.";
      input.classList.add("form__input_error");
      return false;
    }

    return true;
  };

  const inputs = Array.from(form.querySelectorAll(".form__input")) as (
    | HTMLInputElement
    | HTMLTextAreaElement
  )[];

  inputs.forEach((input) => {
    input.addEventListener("input", () => validateField(input));
    input.addEventListener("blur", () => validateField(input));
  });

  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    let isFormValid = true;

    inputs.forEach((input) => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      statusDiv.textContent = "Sending...";
      statusDiv.className = "form__status form__status_loading";

      setTimeout(() => {
        statusDiv.textContent = "Your message has been sent successfully!";
        statusDiv.className = "form__status form__status_success";

        form.reset();

        inputs.forEach((input) => input.classList.remove("form__input_error"));
        setTimeout(() => {
          statusDiv.textContent = "";
        }, 3000);
      }, 1000);
    } else {
      statusDiv.textContent = "Please fill in all required fields correctly.";
      statusDiv.className = "form__status form__status_error";
    }
  });
}
