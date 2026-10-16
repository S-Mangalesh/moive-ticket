// EmailJS settings (get these from emailjs.com)
var PUBLIC_KEY = "YOUR_PUBLIC_KEY";
var SERVICE_ID = "YOUR_SERVICE_ID";
var TEMPLATE_ID = "YOUR_TEMPLATE_ID";
 
var movies = [
  { name: "JAILER 2", price: 300 },
  { name: "DUDE", price: 200 },
  { name: "RAMAYANAM", price: 250 }
];

var bookings = [];
var nextId = 1;
 
var movieSelect = document.getElementById("movie");
var timeSelect = document.getElementById("time");
var qtyInput = document.getElementById("qty");
var emailInput = document.getElementById("email");
var totalText = document.getElementById("total");
var message = document.getElementById("message");
var list = document.getElementById("list");
var countText = document.getElementById("count");
var searchInput = document.getElementById("search");
var bookBtn = document.getElementById("bookBtn");
 
movieSelect.innerHTML = "";
for (var i = 0; i < movies.length; i++) {
  var option = document.createElement("option");
  option.value = i;
  option.textContent = movies[i].name + " - ₹" + movies[i].price;
  movieSelect.appendChild(option);
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}
 
function getQuantity() {
  var text = qtyInput.value.trim();
  var number = Number(text);
  if (text === "" || !Number.isInteger(number) || number < 1 || number > 100) {
    return 0;  
  }
  return number;
}

function emailIsValid(email) {
  return email.includes("@") && email.includes(".") && !email.includes(" ") &&
         email.indexOf("@") > 0 && email.lastIndexOf(".") > email.indexOf("@") + 1 &&
         email.lastIndexOf(".") < email.length - 1;
}
function updateTotal() {
  var qty = getQuantity();
  var movie = movies[movieSelect.value];
  totalText.textContent = "₹" + (movie.price * qty);
}
 
function showBookings() {
  var searchText = searchInput.value.toLowerCase();
  list.innerHTML = "";
  countText.textContent = bookings.length;
 
  for (var i = 0; i < bookings.length; i++) {
    var b = bookings[i];
    var allText = (b.movie + " " + b.time + " " + b.email).toLowerCase();
    if (!allText.includes(searchText)) continue;  
 
    var div = document.createElement("div");
    div.className = "ticket";
    div.textContent = b.movie + " | " + b.time + " | " + b.qty + " ticket(s) | ₹" + b.total + " | " + b.email;
 
    var cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.setAttribute("data-id", b.id);
    cancelBtn.addEventListener("click", cancelBooking);
 
    div.appendChild(document.createElement("br"));
    div.appendChild(cancelBtn);
    list.appendChild(div);
  }
 
  if (bookings.length === 0) {
    list.textContent = "No bookings yet.";
  }
}

function cancelBooking(event) {
  var id = Number(event.target.getAttribute("data-id"));
  bookings = bookings.filter(function (b) { return b.id !== id; });
  showBookings();
  showMessage("Booking cancelled.", "good");
}
 
function bookTicket() {
  var qty = getQuantity();
  var email = emailInput.value.trim();
  var movie = movies[movieSelect.value];
 
  if (qty === 0) {
    showMessage("Please enter a whole number of tickets (1 to 100).", "bad");
    return;
  }
  if (!emailIsValid(email)) {
    showMessage("Please enter a valid email address.", "bad");
    return;
  }
 
  var booking = {
    id: nextId,
    movie: movie.name,
    time: timeSelect.value,
    qty: qty,
    total: movie.price * qty,
    email: email
  };
 
  bookBtn.disabled = true;
  showMessage("Sending confirmation email...", "good");
 
  emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    to_email: email,
    movie: booking.movie,
    showtime: booking.time,
    quantity: booking.qty,
    total: "₹" + booking.total
  }, { publicKey: PUBLIC_KEY })
  .then(function () {
    bookings.push(booking);
    nextId = nextId + 1;
    showBookings();
    resetForm();
    showMessage("Booked! A confirmation email was sent to " + email, "good");
    bookBtn.disabled = false;
  })
  .catch(function () {
    showMessage("Email could not be sent, so the booking was not saved.", "bad");
    bookBtn.disabled = false;
  });
}
 
function resetForm() {
  qtyInput.value = "";
  emailInput.value = "";
  movieSelect.selectedIndex = 0;
  timeSelect.selectedIndex = 0;
  message.textContent = "";
  updateTotal();
}
 
bookBtn.addEventListener("click", bookTicket);
document.getElementById("resetBtn").addEventListener("click", resetForm);
movieSelect.addEventListener("change", updateTotal);
qtyInput.addEventListener("input", updateTotal);
searchInput.addEventListener("input", showBookings);
updateTotal();
showBookings();