const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to decode URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Directory to store form submissions
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const dataFile = path.join(dataDir, 'submissions.json');

// Show page with a form
app.get('/', (req, res) => {
    res.send(`
        <form method="POST" action="/submit">
            Enter username:<input type="text" name="username" placeholder="username">
            </br></br>
            Enter phone number:<input type="text" name="phone" placeholder="phone">
            </br></br>
            Enter email:<input type="text" name="email" placeholder="email">
            </br></br>
            Enter City:<input type="text" name="city" placeholder="city">
            </br></br>
            <input type="submit">
        </form>
    `);
});

// Process POST request and store form data in a JSON file
app.post('/submit', (req, res) => {
    // Read existing submissions
    let submissions = [];
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf-8');
        if (data) {
            submissions = JSON.parse(data);
        }
    }

    // Add new submission
    submissions.push(req.body);

    // Write updated submissions to the file
    fs.writeFileSync(dataFile, JSON.stringify(submissions, null, 2));

    res.send('<script>alert("Form Submitted Successfully!"); window.location.href = "/";</script>');
});

// Show page with stored submissions
app.get('/submissions', (req, res) => {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf-8');
        const submissions = JSON.parse(data);

        let submissionList = submissions.map(submission => `
            <li>
                <strong>Username:</strong> ${submission.username}<br>
                <strong>Phone:</strong> ${submission.phone}<br>
                <strong>Email:</strong> ${submission.email}<br>
                <strong>City:</strong> ${submission.city}<br>
            </li>
        `).join('');

        res.send(`
            <h1>Submitted Data</h1>
            <ul>
                ${submissionList}
            </ul>
        `);
    } else {
        res.send('No submissions found.');
    }
});

// Run the app
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
