  import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import StepEntitlement from "@presentation/shared/components/form/StepEntitlement";
import PostEntitlement from "@data/repositories/sharedImps/PostEntitlement";
import { setEntitlementProperty } from "@data/storage/storeRx/sharedSlices/entitlementSlice";
import style from "@presentation/styles/pages/upload-problem.module.css";
// Reuse existing styles logic or layout
// We can wrap this in a nice container style similar to UploadProblem
// Use inline or shared styles for wrapper
const EntitlementManager = ({ theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const entitlementData = useSelector((state) => state.entitlementData);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");
    try {
      const repository = new PostEntitlement();
      // Inject the ID from URL into the DTO/Payload
      const payload = { ...entitlementData, content_id: id };
      
      const result = await repository.postContent(payload);
      setMsg("Success! Entitlement Updated.");
      
      // Optional: Redirect back to dashboard after delay
      setTimeout(() => {
        navigate("/settings/content");
      }, 1500);

    } catch (error) {
      setMsg("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Configure Entitlement (Content ID: {id})</h2>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        Set pricing, access control, and other properties for this content item.
      </p>

      {/* Reusing the Step Component */}
      <StepEntitlement style={style} />

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          style={{
            padding: "1rem 2rem",
            backgroundColor: loading ? "#ccc" : "#000",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
        
        <button 
          onClick={() => navigate("/settings/content")}
          style={{
            padding: "1rem 2rem",
            backgroundColor: "transparent",
            color: "#000",
            border: "2px solid #ccc",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Cancel
        </button>
      </div>

      {msg && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem", 
          backgroundColor: msg.includes("Error") ? "#fee2e2" : "#dcfce7",
          color: msg.includes("Error") ? "#ef4444" : "#166534",
          border: `1px solid ${msg.includes("Error") ? "#ef4444" : "#166534"}`
        }}>
          {msg}
        </div>
      )}
    </div>
  );
};

export default EntitlementManager;
