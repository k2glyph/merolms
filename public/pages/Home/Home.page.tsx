import "./Home.page.scss"
import React from "react"
import { Header } from "@meroedu/components"

export interface HomePageProps {}

export interface HomePageState {
  title: string
}

const HomePage = (props: HomePageProps) => {
  return (
    <>
      <Header />
      <h1 style={{ textAlign: "center", fontSize: 72, fontStyle: "bold" }}> Welcome to Mero Edu</h1>
    </>
  )
}

export default HomePage
