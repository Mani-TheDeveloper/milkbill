document.addEventListener("DOMContentLoaded", function () {
    // Get current date and format it
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const date = `${String(now.getDate()).padStart(2, '0')} / ${String(now.getMonth() + 1).padStart(2, '0')} / ${now.getFullYear()}, ${dayName}`;

    // Insert date into HTML
    document.getElementById("datetime").textContent = date;

    // Handle form submission
    document.getElementById('milkForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const date = document.getElementById('datetime').textContent;
        const milkStatus = document.getElementById('milk').value;
        const elseStatus = document.getElementById('else').value;

        if (!milkStatus || milkStatus === 'Select Any One') {
            alert("దయచేసి పాల స్టేటస్ ఎంచుకోండి");
            return;
        }

        let status = milkStatus;
        if (milkStatus === 'Something else') {
            status = elseStatus;
        }

        // Retrieve existing data from local storage
        let milkData = JSON.parse(localStorage.getItem('milkData')) || [];

        // Check if an entry already exists for the current date
        const existingEntry = milkData.find(entry => entry.date === date);

        if (existingEntry) {
            // Confirm if the user wants to overwrite the existing entry
            const overwrite = confirm("రోజుకు ఒక ఎంపిక మాత్రమే చేయవచ్చు. మీరు కొనసాగించాలనుకుంటున్నారా?");
            if (!overwrite) {
                return;
            }

            // Update the existing entry
            existingEntry.status = status;
        } else {
            // Add new entry
            milkData.push({ date: date, status: status });
        }

        // Save updated data to local storage
        localStorage.setItem('milkData', JSON.stringify(milkData));

        document.getElementById('message').textContent = "డేటా విజయవంతంగా సేవ్ చేయబడింది!";
    });
});

// Toggle the visibility of the 'else' input field
function toggleElseInput() {
    const milkSelect = document.getElementById('milk');
    const elseInput = document.getElementById('else');
    if (milkSelect.value === 'Something else') {
        elseInput.style.display = 'inline';
    } else {
        elseInput.style.display = 'none';
    }
}

// View statement in a new tab
function viewStatement() {
    const milkData = JSON.parse(localStorage.getItem('milkData')) || [];
    let statementWindow = window.open("", "Milk Statement", "width=600,height=400");
    statementWindow.document.write(`
        <style>
             h1{
                text-align: center;
            }

            td,th {
                text-align: center;
                padding: 1rem;
                border: 5px solid #ddd;
            }

            table {
                border-collapse: collapse;
                width: 60%;
                margin: 20px auto;
                border: 5px solid #ddd;
                font-size: 1.2rem;
            }
        </style>
        <h1>Milk Delivery Statement</h1>
        <table border='1'>
            <tr>
                <th>Date</th>
                <th>Milk Status</th>
                <th>Cost (Rs)</th>
            </tr>
    `);

    let totalCost = 0;

    milkData.forEach(entry => {
        let cost = 0;
        switch (entry.status) {
            case "Full Milk":
                cost = 87.5;
                break;
            case "Only Cow Milk":
                cost = 35;
                break;
            case "Only Buffalo":
                cost = 52.5;
                break;
            case "No Milk":
                cost = 0;
                break;
            default:
                cost = 0;
        }
        totalCost += cost;
        statementWindow.document.write(`<tr><td>${entry.date}</td><td>${entry.status}</td><td>${cost}</td></tr>`);
    });

    statementWindow.document.write(`
        <tr>
            <td colspan="2"><strong>Total Cost</strong></td>
            <td><strong>${totalCost}</strong></td>
        </tr>
    `);
    statementWindow.document.write("</table>");
}

// Reset data in local storage
function resetData() {
    const confirmReset = confirm("మీరు నిజంగా అన్ని డేటాను రీసెట్ చేయాలనుకుంటున్నారా?");
    if (confirmReset) {
        localStorage.removeItem('milkData');
        document.getElementById('message').textContent = "అన్ని డేటా విజయవంతంగా రీసెట్ చేయబడింది!";
    }
}
