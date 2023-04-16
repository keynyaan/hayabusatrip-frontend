import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'
export const Social: React.FC = () => {
  return (
    <ul className="flex space-x-4">
      <li className="hover:opacity-50 transition-opacity">
        <a href="https://twitter.com/keynyaan/">
          <FontAwesomeIcon icon={faTwitter} />
          <span className="sr-only">Twitter</span>
        </a>
      </li>
      <li className="hover:opacity-50 transition-opacity">
        <a href="https://github.com/keynyaan/hayabusatrip-frontend/">
          <FontAwesomeIcon icon={faGithub} />
          <span className="sr-only">GitHub</span>
        </a>
      </li>
    </ul>
  )
}
