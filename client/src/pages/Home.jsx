import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/api/analyze", formData);
      setResponse(res.data.message);
    } catch (err) {
      console.error(err);
      setResponse("Error analyzing resume.");
    }
    setLoading(false);
  };

  return (
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

        {response && (
          <div className="alert alert-info mt-4" style={{ whiteSpace: 'pre-wrap' }}>
            {response}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;