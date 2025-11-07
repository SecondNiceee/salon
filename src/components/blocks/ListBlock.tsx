import type React from "react"

interface ListItem {
  text: string
}

interface ListBlockProps {
  items: ListItem[]
}

export const ListBlock: React.FC<ListBlockProps> = ({ items }) => {
  return (
    <div className="list-block">
      <ul className="beautiful-list">
        {items.map((item, index) => (
          <li key={index} className="list-item">
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
