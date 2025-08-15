'use client'

import Markdown from 'react-markdown';

const Answer = ({ answer }) => {
  if(!answer) {
    return (
      <div>
        Oops! Couldn't find a relevant information based on your question... let's try again
      </div>
    )
  }

  return (
    <div className='border border-primary rounded text-sm p-2'>
      <Markdown>{answer}</Markdown>
    </div>
  )
}

export default Answer