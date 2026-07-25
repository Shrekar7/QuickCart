"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";

const INITIAL_VISIBLE = 4;

const Star = ({ filled, onClick, interactive }) => (
  <svg
    onClick={onClick}
    width={interactive ? 26 : 16}
    height={interactive ? 26 : 16}
    viewBox="0 0 24 24"
    className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
    fill={filled ? "#F5B700" : "none"}
  >
    <path
      d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7L12 2z"
      stroke={filled ? "#F5B700" : "#2E1A47"}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const ReviewSection = ({ productId }) => {
  const { user } = useUser();
  const { getToken, isSeller } = useAppContext();

  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/review/list?productId=${productId}`);
      if (data.success) {
        setReviews(data.reviews);
        setAverage(data.average);
        setCount(data.count);
      }
    } catch (error) {
      // reviews just won't show if this fails; not worth a toast on page load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/review/add",
        {
          productId,
          rating,
          comment: comment.trim(),
          userName: user.fullName || user.username || "Anonymous",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Review submitted");
        setComment("");
        setRating(0);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    setDeletingId(reviewId);
    try {
      const token = await getToken();
      const { data } = await axios.delete("/api/review/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { reviewId },
      });

      if (data.success) {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = reviews.length > visibleCount;
  const isExpanded = visibleCount > INITIAL_VISIBLE;

  return (
    <div className="mt-20 md:mt-24 max-w-3xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
        Customer feedback
      </span>
      <h2 className="text-2xl md:text-3xl font-serif tracking-tight text-[#2E1A47] mb-6">
        Ratings & Reviews
      </h2>

      {/* Summary */}
      <div className="flex items-center gap-5 mb-8 rounded-2xl border border-[#EDEBFB] bg-[#FAF9FF]/60 p-5">
        <p className="text-4xl font-serif text-[#2E1A47]">{average || "—"}</p>
        <div>
          <div className="flex gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} filled={n <= Math.round(average)} />
            ))}
          </div>
          <p className="text-sm text-[#5B4B75]/60">
            Based on {count} {count === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {/* Write a review */}
      <form onSubmit={handleSubmit} className="mb-10 rounded-2xl border border-[#EDEBFB] p-5">
        <p className="text-sm font-semibold text-[#2E1A47] mb-3">Write a review</p>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              interactive
              filled={n <= (hoverRating || rating)}
              onClick={() => setRating(n)}
            />
          ))}
        </div>

        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={user ? "Share your experience with this product..." : "Sign in to write a review"}
          disabled={!user}
          className="w-full outline-none rounded-lg border border-[#2E1A47]/15 px-3.5 py-2.5 text-sm text-[#2E1A47] placeholder:text-[#5B4B75]/40 focus:border-[#8B5CF6] transition-colors resize-none disabled:bg-[#FAF9FF]/60 disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={!user || submitting}
          className="mt-3 px-6 py-2.5 rounded-full font-semibold text-white text-sm shadow-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }}
        >
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </form>

      {/* Review list */}
      {loading ? (
        <p className="text-sm text-[#5B4B75]/50">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-[#5B4B75]/50">No reviews yet — be the first to share your thoughts.</p>
      ) : (
        <>
          <div className="space-y-6">
            {visibleReviews.map((r) => {
              const canDelete = isSeller || r.userId === user?.id;
              return (
                <div key={r._id} className="border-b border-[#EDEBFB] pb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-medium text-[#2E1A47] text-sm">{r.userName}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-[#5B4B75]/40">
                        {new Date(r.date).toLocaleDateString()}
                      </p>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(r._id)}
                          disabled={deletingId === r._id}
                          className="text-xs font-medium text-[#E8578E] hover:underline disabled:opacity-50"
                        >
                          {deletingId === r._id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} filled={n <= r.rating} />
                    ))}
                  </div>
                  <p className="text-sm text-[#5B4B75]/70 leading-relaxed">{r.comment}</p>
                </div>
              );
            })}
          </div>

          {(hasMore || isExpanded) && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() =>
                  setVisibleCount(hasMore ? reviews.length : INITIAL_VISIBLE)
                }
                className="px-6 py-2 rounded-full text-sm font-semibold text-[#8B5CF6] border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-colors"
              >
                {hasMore ? `See more (${reviews.length - visibleCount})` : "Show less"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection;