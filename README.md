AxeCode

AxeCode is an educational coding platform designed for students and developers. It enables users to practice programming challenges, build skills through structured lessons, and share knowledge with a community. The app fosters collaboration with posts, tutorials, questions, and social interactions like comments and likes. Users have personalized profiles with progress tracking (e.g. a contribution graph), and can follow local or regional tech events and updates.

Features

User Authentication: Secure registration and login flow with user profiles.

Rich Posting: Users can create and share posts or tutorials with media attachments (images, videos) and tags.

Courses & Lessons: Content is organized into courses with multiple lessons, allowing users to learn step-by-step.

Commenting: Users can comment on posts and course content, enabling discussion and feedback.

Community Filters: Browse content by categories (Trending, Latest, Tutorials, Questions, etc.) to find relevant posts quickly.

Profiles & Contribution Graph: Personal profile settings let users update their info and see a contribution graph that visualizes their activity and progress on the platform.

Tech Stack

Frontend: React (a JavaScript library for building user interfaces
legacy.reactjs.org
) with Redux Toolkit (an official, opinionated toolset for efficient Redux state management
redux-toolkit.js.org
) also React Router DOM for client-side routing
w3schools.com
and vite for Production Build and (HMR)
.

Utilities: qs is used for parsing and stringifying URL query strings (it’s a popular querystring library
npmjs.com
).

Backend (APIs): The backend is assumed to use Strapi (an open-source Node.js–based headless CMS
scaleupally.io
) with a PostgreSQL database (an advanced, free and open-source relational DBMS
adenhq.com
).

Getting Started

Clone the repository:

git clone <https://github.com/mohamed-ctrl878/AxeCode.git>


cd AXE_CODE

Install dependencies:

npm install

Run scripts:

Start the development server:

npm run dev

(This runs the app locally, typically on http://localhost:3000.)

Build for production:

npm run build

(Optional) Preview the production build:

npm run preview

Environment Variables: Create a .env file (or .env.local) in the project root and define the required variables. For example:

VITE_BACKEND_URL=http://localhost:1338

Replace the values with your actual API endpoints or tokens as needed.

Folder Structure

At a high level, the project is organized into key directories:

core/ – Global configuration, services, and utility functions.

data/ – Data layer including API client code, Redux slices, and data-fetching logic.

domain/ – Business logic and data models.

presentation/ – UI components, pages, and styling for the user interface.

Each directory encapsulates a distinct part of the application (e.g. core utilities vs. UI components), following a clear separation of concerns.

Screenshots

AxeCode Home Page. The landing page greets users with a mission statement (e.g. “Develop Your Skills with AxeCode”), and features clear call-to-action buttons like Start Practicing or Explore Courses. The navigation bar provides quick access to major sections such as Courses, Practices, and Community. The design is clean and inviting, encouraging new learners to get started and explore the platform.

Community Page. This screenshot shows the community feed where users can discover shared content. Filters like Trending, Latest, Questions, and Tutorials help users find relevant posts quickly. Each post displays media (images or videos), author info, and social actions (likes, comments). Community stats (total members and posts) are also visible, highlighting the platform’s engagement. Users can scroll to see more posts and interact by commenting or liking.

Profile Settings Page. In this view, a user can manage their personal information and account settings. The page includes fields for changing profile photo, name, and email, as well as a password change option. Below the settings, a Contribution Graph (similar to GitHub’s) shows the user’s activity over the past year (e.g. number of posts or lessons completed each day). This visual progress tracker gamifies learning and keeps users motivated by highlighting their contributions.

Future Plans

Live Streaming: Integrate live video sessions or webinars so experts and instructors can broadcast coding workshops or Q&A sessions in real time.

Competitive Challenges: Add time-bound coding contests and leaderboards to encourage friendly competition and skill-building.

Advanced Gamification: Introduce achievements, badges, and a ranking system to reward active contributors and learners.

Expanded Content: Grow the library of courses and tutorials, and possibly add features like pair programming or mentoring to support collaboration.

Contribution

Author: Mohamed El Eskander (sole developer)

Contact: mohamedeleskanderwow@gmail.com

Contributions: This project is currently developed by a single author and is not accepting external contributions at this time.

License

This project does not yet have a specified license (TBD).

References: AxeCode is built on modern web technologies including React
legacy.reactjs.org
, Redux Toolkit
redux-toolkit.js.org
, React Router
w3schools.com
, and qs
npmjs.com
. The backend stack (Strapi + PostgreSQL) is based on popular open-source solutions
scaleupally.io
adenhq.com
.
