````markdown
# 📊 DataProSimX

**DataProSimX** is an interactive, role-based data science simulation platform built with React and PostgreSQL. It guides users through the complete data science lifecycle—from data ingestion and cleaning to machine learning and deployment—while offering gamification, real-time mentoring, and career tracking. Ideal for aspiring Data Analysts, Data Engineers, ML Engineers, and AI Researchers.

---

## 🚀 Demo

Live Demo: [https://your-domain.com](https://your-domain.com)  
Demo Credentials:  
`Username: demo@dataprosimx.ai`  
`Password: dataprosim2025`

---

## 🌟 Key Features

- 🎯 **Role-Based Tracks**: Choose your career simulation path (Data Analyst, Data Engineer, ML Engineer, AI Researcher).
- 🧠 **AI Mentor**: Real-time chat-based assistant powered by Gemini for guidance at every stage.
- 📂 **End-to-End Workflow**:
  - Select Role → Data Collection → Cleaning → Feature Engineering → EDA → Modeling → Deployment → Business Insights → AI Feedback → Career Progress
- 📊 **No-Code Chart Builder**: Gemini-powered Text-to-Chart tool for intelligent visualizations.
- 📁 **Mock Datasets**: Pre-loaded datasets like Telecom Churn for real-world practice.
- 🧪 **AutoML & Custom Modeling**: Model builder with AutoML support and REST API generator.
- 🎮 **Gamification**: XP, levels, badges, and skill tracking.
- 🧭 **Progress Tracker**: Monitor workflow stage, project status, and performance.

---

## 🧱 Tech Stack

### Frontend
- `React + TypeScript`
- `Tailwind CSS` for styling
- `Recharts` for visualization
- `ShadCN` UI components

### Backend
- `FastAPI` (optional for REST deployment)
- `PostgreSQL` hosted via `Neon`
- `Prisma ORM`

### AI Integrations
- Gemini API for Text-to-Chart, Insights, and AI Mentor

---

## 🗃️ Database Schema Overview

```plaintext
users
 └─ id, name, email, password, role, level, xp

projects
 └─ id, user_id, title, dataset_id, stage, score

datasets
 └─ id, name, description, source_url, sample_schema

achievements
 └─ id, user_id, title, badge_icon, earned_on
````

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/DataProSimX.git
cd DataProSimX

# Install dependencies
npm install

# Set up your PostgreSQL DB (Neon, Supabase, or local)
# Add your DATABASE_URL in a .env file
cp .env.example .env

# Start the app
npm run dev
```

---

## 🧪 Seed Data

Run the following command to populate demo users and projects:

```bash
npm run seed
```

---

## 📁 Project Structure

```
/src
 ├── components     # Reusable UI components
 ├── pages          # Page-based routing (Next.js-style)
 ├── modules        # Each simulation module (EDA, Cleaning, etc.)
 ├── utils          # Helper functions
 ├── prisma         # DB schema and migrations
 └── styles         # Global and custom Tailwind styles
```

---

## 🧠 Suggested Next Features

* 🔐 OAuth + JWT Authentication
* 🗂️ User-uploaded dataset support
* 🧩 Live coding assessment module
* 📊 Skill-based resume generator
* 📚 More real-world case studies (Finance, Retail, Healthcare)

---

## 💡 Contribution Guidelines

1. Fork this repo
2. Create your branch (`git checkout -b feature-x`)
3. Commit your changes (`git commit -m 'Add feature x'`)
4. Push to your branch (`git push origin feature-x`)
5. Open a Pull Request

---

## 📜 License

MIT License © 2025 Charan Karthik Nayakanti
Feel free to use, fork, and enhance the project for educational and personal use.

---

## 📬 Contact

Got suggestions or want to collaborate?

* 📧 Email: [charankarthik609@gmail.com](mailto:charankarthik609@gmail.com)
* 🌐 Portfolio: [https://charankarthik.dev](https://charankarthik.dev)
* 🐙 GitHub: [@charankarthik](https://github.com/charankarthik)

---

```

---

Would you like me to convert this into a downloadable `.md` file or help push it to your GitHub repo directly?
```
