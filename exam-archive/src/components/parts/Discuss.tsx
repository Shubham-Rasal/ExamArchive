"use client"

import { DiscussionEmbed } from 'disqus-react'
import React from 'react'

function DisqusComments() {
  const pageUrl = typeof window !== 'undefined'? window.location.href : ""
  console.log(pageUrl)
  const disqusConfig = {
    url: pageUrl,
    identifier: "article-id",
    title: "Title of Your Article"
  }
  return (
    <DiscussionEmbed shortname='examarchive' config={disqusConfig} />
  )
}

export default DisqusComments