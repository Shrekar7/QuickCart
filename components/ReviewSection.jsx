"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useClerk, useUser } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";

const INITIAL_VISIBLE = 4;

// ======================================================
// STAR ICON
// ======================================================

const Star = ({ filled = false, size = 16, interactive = false, onClick }) => (
  <button
    type={interactive ? "button" : undefined}
    onClick={interactive ? onClick : undefined}
    disabled={!interactive}
    aria-label={interactive ? "Select rating" : undefined}
    className={`
      ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}
      transition-transform duration-150
      disabled:cursor-default
    `}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#C9973E" : "none"}
      aria-hidden="true"
    >
      <path
        d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.36L12 17.36l-5.7 3.01 1.09-6.36-4.62-4.5 6.38-.93L12 2.8Z"
        stroke="#C9973E"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

// ======================================================
// REVIEW SECTION
// ======================================================

const ReviewSection = ({ productId }) => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const { getToken, isSeller } = useAppContext();

  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] =
    useState(INITIAL_VISIBLE);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ====================================================
  // FETCH REVIEWS
  // ====================================================

  const fetchReviews = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/review/list?productId=${productId}`
      );

      if (data.success) {
        setReviews(data.reviews || []);
        setAverage(data.average || 0);
        setCount(data.count || 0);
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // LOAD REVIEWS
  // ====================================================

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // ====================================================
  // RESET
  // ====================================================

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [productId]);

  // ====================================================
  // SIGN IN
  // ====================================================

  const handleSignIn = () => {
    openSignIn({
      afterSignInUrl: window.location.href,
    });
  };

  // ====================================================
  // SUBMIT REVIEW
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      handleSignIn();
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
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
          userName:
            user.fullName ||
            user.username ||
            "Anonymous",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Review submitted");

        setComment("");
        setRating(0);
        setHoverRating(0);

        await fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submit review error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // DELETE REVIEW
  // ====================================================

  const handleDelete = async (reviewId) => {
    if (!user) {
      handleSignIn();
      return;
    }

    setDeletingId(reviewId);

    try {
      const token = await getToken();

      const { data } = await axios.delete(
        "/api/review/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            reviewId,
          },
        }
      );

      if (data.success) {
        toast.success("Review deleted");

        await fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete review error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete review"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ====================================================
  // DATA
  // ====================================================

  const visibleReviews = reviews.slice(
    0,
    visibleCount
  );

  const hasMore = reviews.length > visibleCount;

  const isExpanded =
    visibleCount > INITIAL_VISIBLE;

  const roundedAverage = Math.round(average);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <section className="mt-16 md:mt-20">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-10">

        <p
          className="
            text-[11px]
            uppercase
            tracking-[0.22em]
            font-semibold
            text-[#A58A61]
            mb-3
          "
        >
          Customer feedback
        </p>

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-3
          "
        >

          <div>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-medium
                tracking-[-0.02em]
                text-[#211C18]
              "
            >
              Ratings & Reviews
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#756B61]
              "
            >
              See what customers think about this product.
            </p>

          </div>

          {count > 0 && (
            <p
              className="
                text-sm
                text-[#756B61]
                shrink-0
              "
            >
              {count}{" "}
              {count === 1 ? "review" : "reviews"}
            </p>
          )}

        </div>
      </div>

      {/* ==================================================
          RATING SUMMARY
      ================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-6
          pb-8
          border-b
          border-[#E9E4DC]
        "
      >

        {/* BIG NUMBER */}

        <div className="flex items-center gap-4">

          <span
            className="
              text-5xl
              md:text-6xl
              font-medium
              tracking-[-0.04em]
              text-[#211C18]
            "
          >
            {average ? average.toFixed(1) : "—"}
          </span>

          <div>

            <div className="flex items-center gap-0.5 mb-1">

              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={17}
                  filled={n <= roundedAverage}
                />
              ))}

            </div>

            <p
              className="
                text-xs
                text-[#756B61]
              "
            >
              Overall rating
            </p>

          </div>

        </div>

        {/* DIVIDER */}

        <div
          className="
            hidden
            sm:block
            w-px
            h-10
            bg-[#E9E4DC]
          "
        />

        {/* DESCRIPTION */}

        <p
          className="
            max-w-md
            text-sm
            leading-6
            text-[#756B61]
          "
        >
          Honest feedback from customers helps others
          make better decisions.
        </p>

      </div>

      {/* ==================================================
          WRITE REVIEW
      ================================================== */}

      <div
        className="
          py-8
          border-b
          border-[#E9E4DC]
        "
      >

        {!user ? (

          /* ----------------------------------------------
             SIGNED OUT
          ---------------------------------------------- */

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-5
            "
          >

            <div>

              <h3
                className="
                  text-base
                  font-medium
                  text-[#211C18]
                "
              >
                Have you tried this product?
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-[#756B61]
                "
              >
                Sign in to share your experience.
              </p>

            </div>

            <button
              type="button"
              onClick={handleSignIn}
              className="
                inline-flex
                items-center
                justify-center
                px-5
                py-2.5
                rounded-full
                bg-[#211C18]
                text-white
                text-sm
                font-medium
                hover:bg-[#342C25]
                transition-colors
                shrink-0
              "
            >
              Sign in to review
            </button>

          </div>

        ) : (

          /* ----------------------------------------------
             SIGNED IN
          ---------------------------------------------- */

          <form onSubmit={handleSubmit}>

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-start
                md:justify-between
                gap-6
              "
            >

              <div className="flex-1">

                <div className="mb-4">

                  <h3
                    className="
                      text-base
                      font-medium
                      text-[#211C18]
                    "
                  >
                    Write a review
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#756B61]
                    "
                  >
                    How was your experience?
                  </p>

                </div>

                {/* STARS */}

                <div
                  className="
                    flex
                    items-center
                    gap-1
                    mb-4
                  "
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                >

                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      onMouseEnter={() =>
                        setHoverRating(n)
                      }
                    >
                      <Star
                        size={21}
                        interactive
                        filled={
                          n <=
                          (hoverRating || rating)
                        }
                        onClick={() =>
                          setRating(n)
                        }
                      />
                    </div>
                  ))}

                  {rating > 0 && (
                    <span
                      className="
                        ml-2
                        text-xs
                        text-[#756B61]
                      "
                    >
                      {rating}/5
                    </span>
                  )}

                </div>

                {/* COMMENT */}

                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  placeholder="Share your experience with this product..."
                  className="
                    w-full
                    max-w-2xl
                    rounded-xl
                    border
                    border-[#DED8CF]
                    bg-white
                    px-4
                    py-3.5
                    text-sm
                    text-[#211C18]
                    placeholder:text-[#9A9187]
                    outline-none
                    resize-none
                    transition-all
                    focus:border-[#B9A78B]
                    focus:ring-4
                    focus:ring-[#B9A78B]/10
                  "
                />

              </div>

              {/* SUBMIT */}

              <div
                className="
                  md:pt-7
                  shrink-0
                "
              >

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    w-full
                    md:w-auto
                    min-w-[150px]
                    px-5
                    py-2.5
                    rounded-full
                    bg-[#211C18]
                    text-white
                    text-sm
                    font-medium
                    hover:bg-[#342C25]
                    transition-all
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit review"}
                </button>

              </div>

            </div>

          </form>

        )}

      </div>

      {/* ==================================================
          REVIEWS
      ================================================== */}

      <div className="pt-8">

        {loading ? (

          <div className="py-8">

            <p
              className="
                text-sm
                text-[#8C8379]
              "
            >
              Loading reviews...
            </p>

          </div>

        ) : reviews.length === 0 ? (

          <div
            className="
              py-10
              text-center
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-[#4A4037]
              "
            >
              No reviews yet
            </p>

            <p
              className="
                mt-1
                text-sm
                text-[#8C8379]
              "
            >
              Be the first to share your experience.
            </p>

          </div>

        ) : (

          <>

            {/* REVIEW LIST */}

            <div>

              {visibleReviews.map((review, index) => {

                const canDelete =
                  isSeller ||
                  review.userId === user?.id;

                return (
                  <article
                    key={review._id}
                    className={`
                      py-7
                      ${
                        index !==
                        visibleReviews.length - 1
                          ? "border-b border-[#E9E4DC]"
                          : ""
                      }
                    `}
                  >

                    {/* TOP */}

                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                        gap-3
                      "
                    >

                      {/* USER */}

                      <div>

                        <p
                          className="
                            text-sm
                            font-medium
                            text-[#211C18]
                          "
                        >
                          {review.userName}
                        </p>

                        <div
                          className="
                            flex
                            items-center
                            gap-1
                            mt-2
                          "
                        >

                          {[1, 2, 3, 4, 5].map(
                            (n) => (
                              <Star
                                key={n}
                                size={14}
                                filled={
                                  n <=
                                  review.rating
                                }
                              />
                            )
                          )}

                        </div>

                      </div>

                      {/* DATE / DELETE */}

                      <div
                        className="
                          flex
                          items-center
                          gap-4
                        "
                      >

                        <time
                          className="
                            text-xs
                            text-[#9A9187]
                          "
                        >
                          {new Date(
                            review.date
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </time>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                review._id
                              )
                            }
                            disabled={
                              deletingId ===
                              review._id
                            }
                            className="
                              text-xs
                              text-[#A35D68]
                              hover:underline
                              disabled:opacity-50
                            "
                          >
                            {deletingId ===
                            review._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}

                      </div>

                    </div>

                    {/* COMMENT */}

                    <p
                      className="
                        mt-4
                        max-w-3xl
                        text-sm
                        leading-7
                        text-[#5F554C]
                      "
                    >
                      {review.comment}
                    </p>

                  </article>
                );
              })}

            </div>

            {/* ==================================================
                SEE MORE
            ================================================== */}

            {(hasMore || isExpanded) && (
              <div
                className="
                  flex
                  justify-center
                  pt-8
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      hasMore
                        ? reviews.length
                        : INITIAL_VISIBLE
                    )
                  }
                  className="
                    px-5
                    py-2.5
                    rounded-full
                    border
                    border-[#D8D0C5]
                    text-sm
                    font-medium
                    text-[#4A4037]
                    hover:bg-[#F8F6F2]
                    transition-colors
                  "
                >
                  {hasMore
                    ? `See more reviews (${
                        reviews.length -
                        visibleCount
                      })`
                    : "Show less"}
                </button>

              </div>
            )}

          </>

        )}

      </div>

    </section>
  );
};

export default ReviewSection;