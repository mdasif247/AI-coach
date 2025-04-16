import React, { useState } from "react";
import axios from "axios";
import '../Home.css';

function Home() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/api/analyze", formData);
      const data = JSON.parse(res.data.message);
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Error analyzing resume." });
    }
    setLoading(false);
  };

  return (
    <div className="home-background">
      <img
      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
      alt="Professional Banner"
      className="banner-image"
    />

    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h1 className="text-center text-primary">AI Career Coach</h1>
        <p className="text-center">Upload your resume and get personalized career guidance</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
              className="form-control"
            />
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || loading}
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
          </div>
        </form>

        {loading && <div className="text-center mt-3">Processing your resume, please wait...</div>}

        {response && !response.error && (
          <div className="mt-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">⭐ Resume Rating</h5>
                <p>{response.rating}/10</p>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Career Paths</h5>
                <ul>{response.career_paths?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Strengths</h5>
                <ul>{response.strengths?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Weak Areas</h5>
                <ul>{response.weaknesses?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Soft Skills Insight</h5>
                <ul>{response.soft_skills?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">ATS Match Rate</h5>
                <p>{response.ats_match}</p>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Project Recommendations</h5>
                <ul>{response.project_ideas?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">30-Day Learning Roadmap</h5>
                <ul>{response.roadmap?.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
            </div>
          </div>
        )}

        {response?.error && (
          <div className="alert alert-danger mt-4">{response.error}</div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Home;