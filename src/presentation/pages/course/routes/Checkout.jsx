import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetContent from "@presentation/shared/hooks/useGetContent";
// import  getOneItemExe  from "@domain/usecases/course/getOneItemExe";
import  {GetOneCourse}  from "@data/repositories/courseImps/GetOneCourse";
// import { courseQuery } from "@data/repositories/courseImps/courseQuery";

// Styles
import style from "@presentation/styles/pages/checkout.module.css";
import { getOneItemExe } from "@domain/usecases/shared/getOneItemExe";
import { courseQuery } from "@core/queries/courseQuery";

const Checkout = () => {
  const { id } = useParams();
  const theme = useSelector((state) => state.themeSlice.theme);
  const themeClass = theme ? "dark-theme" : "light-theme";
  const navigate = useNavigate();

  async function caseUse() {
    return await getOneItemExe(new GetOneCourse(), id, courseQuery());
  }

  const { load, data, error } = useGetContent({ caseUse });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  if (load) return <div className={style.loadingState}>Preparing Checkout...</div>;
  if (error) return <div className={style.errorState}>Error loading course for checkout.</div>;

  const handlePayment = () => {
    // Basic simulator
    alert("Payment feature integration coming soon! Redirecting to course...");
    navigate(`/courses/${data.documentId || data.id}/content`);
  };

  return (
    <div className={`${style.checkoutContainer} ${themeClass}`}>
      <div className={style.checkoutWrapper}>
        <div className={style.checkoutHeader}>
          <Link to={`/courses/preview/${id}`} className={style.backLink}>
            ← Back to Preview
          </Link>
          <h1 className={style.checkoutTitle}>Checkout</h1>
        </div>

        <div className={style.checkoutGrid}>
          {/* Main Content - Payment Details */}
          <div className={style.paymentSection}>
            <div className={style.brutalistCard}>
              <h2 className={style.cardHeading}>1. Payment Method</h2>
              <div className={style.methodsGrid}>
                <div 
                  className={`${style.methodBox} ${paymentMethod === "credit-card" ? style.active : ""}`}
                  onClick={() => setPaymentMethod("credit-card")}
                >
                  <div className={style.methodIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <span>Credit Card</span>
                </div>
                <div 
                  className={`${style.methodBox} ${paymentMethod === "paypal" ? style.active : ""}`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <div className={style.methodIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                      <path d="M18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                      <path d="M13 18h3.5l3.5-7H6l.2-1"></path>
                    </svg>
                  </div>
                  <span>PayPal</span>
                </div>
              </div>

              {paymentMethod === "credit-card" && (
                <div className={style.cardForm}>
                  <div className={style.inputGroup}>
                    <label>Card Number</label>
                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" className={style.brutalistInput} />
                  </div>
                  <div className={style.rowInputs}>
                    <div className={style.inputGroup}>
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className={style.brutalistInput} />
                    </div>
                    <div className={style.inputGroup}>
                      <label>CVV</label>
                      <input type="password" placeholder="***" className={style.brutalistInput} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={style.brutalistCard}>
              <h2 className={style.cardHeading}>2. Billing Address</h2>
              <div className={style.inputGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" className={style.brutalistInput} />
              </div>
              <div className={style.inputGroup}>
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" className={style.brutalistInput} />
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className={style.summarySection}>
            <div className={style.summaryCard}>
              <h2 className={style.cardHeading}>Order Summary</h2>
              <div className={style.coursePreviewSmall}>
                <div className={style.courseImgBox}>
                  <img src={data?.picture?.url ? `http://localhost:1338${data.picture.url}` : "https://via.placeholder.com/100x60"} alt={data?.title} />
                </div>
                <div className={style.courseInfoSmall}>
                  <h3 className={style.courseTitleSmall}>{data?.title}</h3>
                  <p className={style.courseAuthorSmall}>By AxeCode Expert</p>
                </div>
              </div>

              <div className={style.priceDetails}>
                <div className={style.priceRow}>
                  <span>Course Price</span>
                  <span>${data?.price || "0.00"}</span>
                </div>
                <div className={style.priceRow}>
                  <span>Discount</span>
                  <span className={style.discountValue}>-$0.00</span>
                </div>
                <div className={`${style.priceRow} ${style.totalRow}`}>
                  <span>Total</span>
                  <span>${data?.price || "0.00"}</span>
                </div>
              </div>

              <button className={style.payButton} onClick={handlePayment}>
                Complete Purchase
              </button>
              <p className={style.secureText}>✓ Secure & Encrypted Payment</p>
            </div>

            <div className={style.needHelpBox}>
              <h3>Need Help?</h3>
              <p>Contact our support team if you have any questions about your purchase.</p>
              <Link to="/support" className={style.supportLink}>Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
