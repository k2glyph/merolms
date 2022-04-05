import "./Home.page.scss"
import React from "react"
import { Box, Container, Card } from "@mui/material"
import { Helmet } from "react-helmet-async"

import { styled } from "@mui/material/styles"
import Logo from "@meroedu/components/LogoSign"
import Hero from "./Hero"

// const HomePage = () => {
//   return <h1 style={{ textAlign: "center", fontSize: 72, fontStyle: "bold" }}> Welcome to Mero Edu</h1>
// }

const HomePageWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
)

function HomePage() {
  return (
    <HomePageWrapper>
      <Helmet>
        <title>Mero Edu</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={5} alignItems="center">
          <Logo />
        </Box>
        <Card sx={{ p: 10, mb: 10, borderRadius: 12 }}>
          <Hero />
        </Card>
      </Container>
    </HomePageWrapper>
  )
}

export default HomePage
