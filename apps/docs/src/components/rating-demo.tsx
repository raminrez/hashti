"use client"

import { Rating, RatingItem } from "@hashti/react"

function Star() {
  return (
    <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true">
      <path d="M8 1.5 10 6l4.5.5-3.3 3 .9 4.5L8 11.6 3.9 14l.9-4.5-3.3-3L6 6Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

export function RatingDemo() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Rating aria-label="Your rating" defaultValue={3}>
        <RatingItem><Star /></RatingItem>
      </Rating>
      <Rating aria-label="Average rating" defaultValue={4} readOnly>
        <RatingItem><Star /></RatingItem>
      </Rating>
      <Rating aria-label="Half-star rating" step={0.5} defaultValue={3.5}>
        <RatingItem>
          <Star />
          <span className="hashti-rating-item__fill" aria-hidden="true"><Star /></span>
        </RatingItem>
      </Rating>
      <Rating aria-label="Average rating with half stars" value={4.2} readOnly getValueLabel={(value, max) => `Rated ${value} out of ${max}`}>
        <RatingItem>
          <Star />
          <span className="hashti-rating-item__fill" aria-hidden="true"><Star /></span>
        </RatingItem>
      </Rating>
    </div>
  )
}
