import "./Home.page.scss"
import NoDataIllustration from "@meroedu/assets/images/undraw-no-data.svg"

import React, { useState } from "react"
import { Post, Tag, PostStatus } from "@meroedu/models"
import { Markdown, Hint, PoweredByMeroedu, Icon, Header } from "@meroedu/components"
import { SimilarPosts } from "./components/SimilarPosts"
import { PostInput } from "./components/PostInput"
import { PostsContainer } from "./components/PostsContainer"
import { useMeroedu } from "@meroedu/hooks"
import { VStack } from "@meroedu/components/layout"

import { t, Trans } from "@lingui/macro"

export interface HomePageProps {
  posts: Post[]
  tags: Tag[]
  countPerStatus: { [key: string]: number }
}

export interface HomePageState {
  title: string
}

const Lonely = () => {
  const meroedu = useMeroedu()

  return (
    <div className="text-center">
      <Hint permanentCloseKey="at-least-3-posts" condition={meroedu.session.isAuthenticated && meroedu.session.user.isAdministrator}>
        <p>
          <Trans id="home.lonely.suggestion">
            It&apos;s recommended that you create <strong>at least 3</strong> suggestions here before sharing this site. The initial content is important to
            start engaging your audience.
          </Trans>
        </p>
      </Hint>
      <Icon sprite={NoDataIllustration} height="120" className="mt-6 mb-2" />
      <p className="text-muted">
        <Trans id="home.lonely.text">No posts have been created yet.</Trans>
      </p>
    </div>
  )
}

const HomePage = (props: HomePageProps) => {
  const meroedu = useMeroedu()
  const [title, setTitle] = useState("")

  const defaultWelcomeMessage = t({
    id: "home.form.defaultwelcomemessage",
    message: `We'd love to hear what you're thinking about.

What can we do better? This is the place for you to vote, discuss and share ideas.`,
  })

  const defaultInvitation = t({
    id: "home.form.defaultinvitation",
    message: "Enter your suggestion here...",
  })

  const isLonely = () => {
    const len = Object.keys(props.countPerStatus).length
    if (len === 0) {
      return true
    }

    if (len === 1 && PostStatus.Deleted.value in props.countPerStatus) {
      return true
    }

    return false
  }

  return (
    <>
      <Header />
      <div id="p-home" className="page container">
        <div className="p-home__welcome-col">
          <VStack spacing={2}>
            <Markdown text={meroedu.session.tenant.welcomeMessage || defaultWelcomeMessage} style="full" />
            <PostInput placeholder={meroedu.session.tenant.invitation || defaultInvitation} onTitleChanged={setTitle} />
            <PoweredByMeroedu slot="home-input" className="sm:hidden md:hidden lg:block" />
          </VStack>
        </div>
        <div className="p-home__posts-col">
          {isLonely() ? (
            <Lonely />
          ) : title ? (
            <SimilarPosts title={title} tags={props.tags} />
          ) : (
            <PostsContainer posts={props.posts} tags={props.tags} countPerStatus={props.countPerStatus} />
          )}
          <PoweredByMeroedu slot="home-footer" className="lg:hidden xl:hidden mt-8" />
        </div>
      </div>
    </>
  )
}

export default HomePage
