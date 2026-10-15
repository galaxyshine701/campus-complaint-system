import { CATEGORIES } from '../../config/categories.js'

// Big icon buttons for choosing what is broken. They are real radio buttons underneath,
// so the keyboard (arrow keys) and screen readers work. The chosen one turns solid ink.
export default function CategoryPicker({ value, onChange }) {
  return (
    <div id="field-category" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {CATEGORIES.map((category) => (
        <label
          key={category.id}
          className="flex cursor-pointer flex-col items-center gap-1 rounded-md border-2 border-ink px-2 py-3 text-center text-sm font-semibold has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
        >
          <input
            type="radio"
            name="category"
            value={category.id}
            checked={value === category.id}
            onChange={() => onChange(category.id)}
            className="sr-only"
          />
          <span aria-hidden="true" className="text-2xl">
            {category.icon}
          </span>
          {category.label}
        </label>
      ))}
    </div>
  )
}
