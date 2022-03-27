import "./Home.page.scss"

import React from "react"
import {  Header } from "@meroedu/components"

export interface HomePageProps {
  // posts: Post[]
  // tags: Tag[]
  // countPerStatus: { [key: string]: number }
}

export interface HomePageState {
  title: string
}

const HomePage = (props: HomePageProps) => {

  return (
    <>
      <Header />
      <h1> Welcome to Mero Edu</h1>
      {/* <div id="p-home" className="page container">
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
      </div> */}
    </>
  )
}

export default HomePage
