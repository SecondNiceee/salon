import { Media } from "@/payload-types"
import { fixPayloadUrl } from "@/utils/fixPayloadUrl"
import Image from "next/image"
import type React from "react"

interface Contact {
  key: string
  valueType: "text" | "link"
  value: string
  icon?: Media
}

interface ContactsBlockProps {
  contacts: Contact[]
}

export const ContactsBlock: React.FC<ContactsBlockProps> = ({ contacts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 my-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {contact.icon ? <Image className="w-4" src={fixPayloadUrl(String(contact.icon.url))} alt={contact.icon.alt} fill /> : <></>}

            <div className="flex-1">
              <div className="font-medium text-gray-700 text-sm mb-1">{contact.key}</div>

              {contact.valueType === "link" ? (
                <a
                  href={contact.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium break-all transition-colors duration-200"
                >
                  {contact.value}
                </a>
              ) : (
                <div className="text-gray-900 font-medium break-all">{contact.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
