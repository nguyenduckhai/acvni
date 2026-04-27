# ACVNI Website

This is the repository for the ACVNI (Association de la communauté Vietnamienne de Nice) website.

The website uses a Node.js backend proxy to securely fetch dynamic news and blog posts from a Notion Database.

## 🚀 Getting Started for Developers

Follow these instructions to set up the project locally.

### 1. Prerequisites
- You must have **Node.js** installed on your machine.
- You must have access to the Notion Integration Token and the Database ID.

### 2. Setup & Installation
Clone the repository and install the required Node dependencies:
```bash
npm install
```
*(This installs `express`, `cors`, `dotenv`, and `@notionhq/client`)*

### 3. Environment Variables (IMPORTANT)
The Notion API strictly requires credentials that **should never** be committed to Git. You must create a `.env` file in the root directory.

Create a file named `.env` and add your Notion credentials:
```env
NOTION_SECRET=ntn_your_notion_integration_token_here
NOTION_PORTFOLIO_DATABASE_ID=your_database_id_here
```
> **Note:** The `.env` file is safely ignored by Git via `.gitignore`. Do not expose your `NOTION_SECRET` publicly.

### 4. Running the Local Server
Because the Notion API blocks direct browser requests (CORS), you must run the local Node proxy server to view the dynamic news section.

Run the following command in your terminal:
```bash
node server.js
```
The console should display: `Server running at http://localhost:3000`

### 5. View the Site
Open your browser and navigate to:
- **Main Website**: [http://localhost:3000/](http://localhost:3000/)
- **News/Blog Section**: [http://localhost:3000/news.html](http://localhost:3000/news.html)

---

## 📝 Notion Database Architecture
If you are modifying the frontend Javascript (`notion-client.js`), ensure your Notion Database strictly contains these property names:
- `Title` (Title type)
- `Published Date` (Date type)
- `Author` (Text/People type)
- `Thumnail` (Files & media type)
- `Category` (Select/Multi-select type)
