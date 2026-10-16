// Stars as plain text, e.g. ★★★★☆ 4/5. Filled and empty stars differ in SHAPE, not only in colour,
// and the number is written next to them. Screen readers get "4 out of 5 stars".
export default function StarsDisplay({ value }) {
  return (
    <span className="whitespace-nowrap">
      <span role="img" aria-label={value + ' out of 5 stars'} className="text-lg tracking-wide">
        {'★'.repeat(value)}
        {'☆'.repeat(5 - value)}
      </span>{' '}
      <span className="font-mono text-xs">{value}/5</span>
    </span>
  )
}
