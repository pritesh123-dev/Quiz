# Quiz Management System Plan

## Assumptions

* **Environment constraints:** This development environment does not allow downloading additional packages from the public internet (e.g. npm registry is not reachable).  Therefore, all code must rely only on Node.js built‑in modules or simple HTML/JavaScript that can run in the browser without external dependencies.  Under normal circumstances I would use Next.js or a similar framework with a database such as Postgres via Prisma, but those tools cannot be installed here.
* **Data storage:**  In a real production system I would use NeonDB (Postgres) or MongoDB for persistent storage.  Given the constraints above, I will persist quiz data in a local JSON file.  The JSON file acts as a simple key–value database storing quizzes and their questions.
* **Authentication:**  The brief does not require user accounts or authentication.  The “Admin” interface is accessible by anyone who knows the admin URL.  In a real application this would be protected.
* **Scope of questions:**  The application will support multiple choice (single answer), true/false, and short text questions.  Other question types (e.g. multi‑select or numeric ranges) are outside the initial scope.
* **Deployment:**  A deployment link is a “nice to have.”  Given the offline environment I cannot deploy to a cloud platform.  The resulting project will be able to run locally via `node server.js`.
* **Tech stack:**  The backend will be a single `server.js` using Node.js and the built‑in `http` and `fs` modules.  The frontend will consist of static HTML pages with minimal JavaScript for dynamic behaviour (e.g. adding questions in the admin form and submitting quizzes).  Tailwind CSS or React cannot be used because they are not available offline.

## Scope

The goal is to build a **production‑ready** minimal quiz platform that implements the core workflow:

1. **Admin interface**
   * A form to create a new quiz with a title and any number of questions.
   * Each question can be one of:
     * **Multiple choice** – the admin supplies the question text, a list of options, and marks one option as correct.
     * **True/False** – the admin supplies the statement, and selects whether the correct answer is true or false.
     * **Short text** – the admin supplies the question text and the expected answer.
   * On submission, the quiz is stored in a JSON file (`db.json`) with a unique identifier.

2. **Public quiz page**
   * A page that lists available quizzes with a “Take quiz” link for each.
   * When taking a quiz, the questions are displayed one after another with appropriate input controls (radio buttons for MCQ and True/False, and a text box for short text).
   * On submission, the system evaluates the answers, computes the score and presents the result (e.g. “You scored 3/5”) along with the correct answers.

3. **Result page**
   * After a user completes a quiz, they see their score and the correct answers.

4. **Project organisation**
   * The project will be organised as a simple Node.js app under the `quiz-system` folder.
   * Static assets (CSS and client‑side JavaScript) will be placed in a `public` folder.
   * Templates for HTML pages will be stored under a `views` folder.
   * The data file `db.json` will live at the project root and hold an array of quizzes.
   * A small script to generate unique identifiers (using a timestamp) will be included.

## High‑Level Architecture

### Server

* The server is a single Node.js process (`server.js`).  It handles HTTP requests on different routes:
  * `GET /` – lists all quizzes with links to take them; also links to the admin page.
  * `GET /admin` – serves the admin page containing the form to create a quiz.  Client‑side JavaScript on this page allows dynamically adding questions and options.
  * `POST /api/create-quiz` – receives form data from the admin page, parses the quiz title and questions and writes them into `db.json`.
  * `GET /quiz/:id` – serves the quiz taking page for the quiz with identifier `id`.  The page shows each question with appropriate input controls.
  * `POST /api/quiz/:id` – receives answers for the quiz, compares them against the stored correct answers, calculates the score and returns a result page.
  * Static files (CSS/JS/images) are served from `/public/*`.

### Data Schema

The JSON file `db.json` will contain an object with a single property `quizzes` which is an array of quiz objects.  Each quiz object has the following structure:

```json
{
  "id": "quiz_1234567890",   // unique identifier (string)
  "title": "Quiz Title",     // title of the quiz
  "questions": [
    {
      "id": "q1",            // question identifier (for internal use)
      "type": "mcq",        // 'mcq' | 'tf' | 'text'
      "question": "What is 2 + 2?",
      "options": ["2", "3", "4", "5"], // only for MCQ
      "answer": "4"         // correct answer (string)
    },
    {
      "id": "q2",
      "type": "tf",
      "question": "The earth is flat.",
      "answer": "false"
    },
    {
      "id": "q3",
      "type": "text",
      "question": "Name the capital of France.",
      "answer": "Paris"
    }
  ]
}
```

### Approach

1. **Initial scaffolding:**  Create the repository, initialise git, and set up the folder structure (`server.js`, `public/`, `views/`, `db.json`).  Commit this initial state.
2. **Implement the server:**  Write `server.js` to handle routing and static file serving.  Use `fs.readFile` and `fs.writeFile` for reading/writing `db.json`.
3. **Build admin interface:**  Create `views/admin.html` containing a form for entering the quiz title and dynamic question fields.  Write client‑side JavaScript (`public/admin.js`) to add and remove question sections and to serialize the form data into a JSON payload for submission.
4. **Build public pages:**  Create `views/index.html` to list quizzes.  Create `views/quiz.html` to display a quiz and handle answer submission via `public/quiz.js`.  Create `views/result.html` for displaying the final score.
5. **Testing and iteration:**  Test the application end‑to‑end locally, fix any bugs, and perform at least four commits, making sure to commit at least once every 30 minutes.
6. **Reflection:**  At the end of development, add a section to this plan describing what could be improved with more time (e.g. adding authentication, using a real database, or migrating to React/Next.js when network access is available).

## Future Improvements (Reflection)

* **Database Integration:**  Switch from a JSON file to a proper database such as Postgres or MongoDB to support concurrent access, query efficiency and data integrity.
* **Authentication & Authorization:**  Protect the admin interface behind login credentials and allow users to create accounts and track their quiz history.
* **Better UI:**  Use a modern frontend framework (e.g. Next.js with Tailwind CSS) to build a more responsive and polished interface once dependency installation is possible.
* **Question Types:**  Add support for multi‑select, numeric, and free‑form questions with fuzzy matching.
* **API Design:**  Expose REST or GraphQL endpoints for quiz management and consumption, enabling future mobile apps or third‑party integrations.
* **Deployment:**  Containerize the application using Docker and deploy it to a cloud service such as Vercel, Heroku or AWS.
