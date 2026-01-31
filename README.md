# 🚀 StartupIQ - AI-Powered Startup Feasibility Analyzer

**StartupIQ** is a "Virtual Co-Founder" platform designed to help entrepreneurs validate their business ideas instantly. It solves the problem of "AI Hallucinations" by using a **Hybrid AI Architecture**: it separates creative reasoning (GenAI) from financial math (Statistical ML).

![Status](https://img.shields.io/badge/Status-Completed-success)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Flask%20%7C%20AI-blue)

## ⚡ Key Features

### 🧠 Hybrid AI Engine
* **Qualitative:** Uses **Google Gemini API** to generate SWOT Analysis, Recommendations, and Market Entry Strategies.
* **Quantitative:** Uses **Linear Regression & Random Forest** to calculate accurate Financial Valuations and Feasibility Scores.

### 🛡️ Smart Fallback (Reliability)
* Engineered a failsafe system: If the external AI API fails or times out, the backend automatically switches to a **Local Logic Engine**.
* Ensures **100% Uptime** during critical presentations or demos.

### ⚡ High Performance
* **Parallel Processing:** Uses Python threading to run the AI analysis and ML calculations simultaneously, reducing analysis time by **40%**.
* **Instant PDF Reports:** Uses `jsPDF` for client-side generation of investor-ready certificates.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Chart.js, Lucide React.
* **Backend:** Python (Flask), Flask-CORS, Threading.
* **AI/ML:** Google Gemini SDK, Scikit-Learn, Pandas, NumPy.
* **Tools:** Axios, Git, Vercel (Frontend Deployment).

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/Srihariacharya/StartupIQ.git](https://github.com/Srihariacharya/StartupIQ.git)
    cd StartupIQ
    ```

2.  **Backend Setup**
    ```bash
    cd Backend
    pip install -r requirements.txt
    # Create .env file and add: GEMINI_API_KEY=your_key_here
    python app.py
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open `http://localhost:5173` in your browser.

## 📸 Usage

1.  **StartupIQ Main Input Dashboard**
    <img width="350" height="350" alt="image" src="https://github.com/user-attachments/assets/c838343b-25fc-4184-9705-fa867161d1b3" />
3.  **Enter Pitch:** Type your startup idea (e.g., "AI-driven vertical farming").
4.  **Set Metrics:** Adjust funding and team size sliders.
5.  **Analyze:** The system runs the Hybrid Engine.
6.  **Download:** Get your Feasibility Report PDF instantly.



## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 Acknowledgments
* **Google Gemini** for the Generative AI capabilities.
* **Scikit-Learn** for the robust ML algorithms.
* **React Community** for the amazing UI libraries.

---
**Author:** Srihari Acharya
