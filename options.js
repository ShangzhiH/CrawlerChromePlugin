// Saves options to chrome.storage
function save_options() {


  var mail = document.getElementById('mail').value;
  var client_name = document.getElementById('client_name').value;

  chrome.storage.sync.set({
    mail: mail,
    client_name: client_name
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    mail: 'E-Mail',
    client_name: 'client_name'
  }, function(items) {
    document.getElementById('mail').value = items.mail;
    document.getElementById('client_name').value = items.client_name;
    
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);