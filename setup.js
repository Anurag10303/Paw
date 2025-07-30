// ========================================
// PHOTO UPLOAD AND PREVIEW FUNCTIONALITY
// ========================================

/**
 * Handle photo upload and display preview
 * When user selects a file, read it and display as preview image
 */
document.getElementById("petPhoto").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    // When file is loaded, update the preview container
    reader.onload = function (e) {
      const preview = document.getElementById("photoPreview");
      // Replace the plus icon with the uploaded image
      preview.innerHTML = `<img src="${e.target.result}" alt="Pet photo" class="w-full h-full object-cover rounded-full">`;
    };
    // Read the file as data URL for preview
    reader.readAsDataURL(file);
  }
});

// ========================================
// CHARACTER COUNTER FOR DESCRIPTION
// ========================================

/**
 * Update character count and enforce 500 character limit
 * for the pet description textarea
 */
document.getElementById("description").addEventListener("input", function (e) {
  const count = e.target.value.length;
  document.getElementById("charCount").textContent = count;

  // Enforce maximum character limit
  if (count > 500) {
    e.target.value = e.target.value.substring(0, 500);
    document.getElementById("charCount").textContent = 500;
  }
});

// ========================================
// PHONE NUMBER AUTO-FORMATTING
// ========================================

/**
 * Format phone number input as user types
 * Converts "1234567890" to "(123) 456-7890"
 */
document.getElementById("ownerPhone").addEventListener("input", function (e) {
  // Remove all non-digit characters
  let value = e.target.value.replace(/\D/g, "");

  // Limit to 10 digits
  if (value.length > 10) value = value.slice(0, 10);

  // Apply formatting based on length
  if (value.length >= 6) {
    // Full format: (123) 456-7890
    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
  } else if (value.length >= 3) {
    // Partial format: (123) 456
    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
  }
  // Update the input value with formatted phone number
  e.target.value = value;
});

// ========================================
// FORM VALIDATION FUNCTIONS
// ========================================

/**
 * Validate individual form field and show/hide error messages
 * @param {HTMLElement} field - The form field to validate
 * @returns {boolean} - True if field is valid, false otherwise
 */
function validateField(field) {
  const errorDiv = field.parentNode.querySelector(".error-message");
  let isValid = true;
  let errorMessage = "";

  // Check if required field is empty
  if (field.hasAttribute("required") && !field.value.trim()) {
    isValid = false;
    errorMessage = "This field is required";
  }
  // Validate email format
  else if (
    field.type === "email" &&
    field.value &&
    !isValidEmail(field.value)
  ) {
    isValid = false;
    errorMessage = "Please enter a valid email address";
  }
  // Validate phone number format
  else if (field.type === "tel" && field.value && !isValidPhone(field.value)) {
    isValid = false;
    errorMessage = "Please enter a valid phone number";
  }
  // Validate age range
  else if (
    field.name === "age" &&
    field.value &&
    (field.value < 0 || field.value > 50)
  ) {
    isValid = false;
    errorMessage = "Please enter a valid age";
  }

  // Update UI based on validation result
  if (errorDiv) {
    if (isValid) {
      // Hide error message and reset border color
      errorDiv.classList.add("hidden");
      field.classList.remove("border-red-500");
      field.classList.add("border-gray-300");
    } else {
      // Show error message and highlight field in red
      errorDiv.textContent = errorMessage;
      errorDiv.classList.remove("hidden");
      field.classList.add("border-red-500");
      field.classList.remove("border-gray-300");
    }
  }

  return isValid;
}

/**
 * Validate email address format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone number format (expects formatted phone like "(123) 456-7890")
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone format is valid
 */
function isValidPhone(phone) {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
}

// ========================================
// REAL-TIME VALIDATION SETUP
// ========================================

/**
 * Add real-time validation to all required fields
 * Validate on blur (when user leaves field) and on input (if field has errors)
 */
const requiredFields = document.querySelectorAll(
  "input[required], select[required]"
);
requiredFields.forEach((field) => {
  // Validate when user leaves the field
  field.addEventListener("blur", () => validateField(field));

  // If field has errors, validate on each keystroke to provide immediate feedback
  field.addEventListener("input", () => {
    if (field.classList.contains("border-red-500")) {
      validateField(field);
    }
  });
});

// ========================================
// FORM SUBMISSION HANDLING
// ========================================

/**
 * Handle form submission with validation and loading states
 */
document
  .getElementById("petProfileForm")
  .addEventListener("submit", function (e) {
    // Prevent default form submission
    e.preventDefault();

    let isFormValid = true;
    // Get all form fields for validation
    const allFields = document.querySelectorAll("input, select, textarea");

    // Validate all fields
    allFields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Form is valid - simulate submission process
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      // Show loading state with spinner
      submitButton.innerHTML = `
                    <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Profile...
                `;
      submitButton.disabled = true;

      // Simulate API call delay (2 seconds)
      setTimeout(() => {
        // Restore button to original state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        // Show success modal
        document.getElementById("successModal").classList.remove("hidden");
      }, 2000);
    } else {
      // Form has errors - scroll to first error field
      const firstError = document.querySelector(".border-red-500");
      if (firstError) {
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  });

// ========================================
// MODAL FUNCTIONALITY
// ========================================

/**
 * Close success modal and reset form
 */
function closeModal() {
  // Hide the modal
  document.getElementById("successModal").classList.add("hidden");

  // Reset the entire form to initial state
  document.getElementById("petProfileForm").reset();

  // Reset photo preview to show plus icon
  document.getElementById("photoPreview").innerHTML = `
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            `;

  // Reset character counter
  document.getElementById("charCount").textContent = "0";
}

/**
 * Close modal when clicking outside the modal content
 */
document.getElementById("successModal").addEventListener("click", function (e) {
  // Only close if clicking the backdrop (not the modal content)
  if (e.target === this) {
    closeModal();
  }
});
