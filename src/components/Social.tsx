import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'
import { TWITTER_COLOR, GITHUB_COLOR } from '@/utils/constants'

export const Social: React.FC = () => {
  return (
    <ul className="flex space-x-4">
      <li className="hover:opacity-50 transition">
        <a href="https://twitter.com/keynyaan/">
          <FontAwesomeIcon icon={faTwitter} style={{ color: TWITTER_COLOR }} />
          <span className="sr-only">Twitter</span>
        </a>
      </li>
      <li className="hover:opacity-50 transition">
        <a href="https://github.com/keynyaan/hayabusatrip-frontend/">
          <FontAwesomeIcon icon={faGithub} style={{ color: GITHUB_COLOR }} />
          <span className="sr-only">GitHub</span>
        </a>
      </li>
    </ul>
  )
}
