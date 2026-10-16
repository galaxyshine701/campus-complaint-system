// A student rates a repair with 1 to 5 stars, once, after the complaint is Resolved.
// The rating is stored on the complaint as a whole number (complaint.rating) with ratedAt.

export function isRated(complaint) {
  return Number.isInteger(complaint?.rating) && complaint.rating >= 1 && complaint.rating <= 5
}

// Why a rating is refused. Returns null when it is allowed.
// (The screen already hides the rating form in these cases; this is the safety net.)
export function ratingProblem(complaint, stars, deviceId) {
  if (!complaint) return 'missing'
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return 'invalid'
  if (complaint.reporterId !== deviceId) return 'not-yours'
  if (complaint.status !== 'resolved') return 'not-resolved'
  if (isRated(complaint)) return 'already-rated'
  return null
}
