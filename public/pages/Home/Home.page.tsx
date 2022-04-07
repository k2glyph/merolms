import "./Home.page.scss"
import React, { useState } from "react"
import { Box, Container, Card } from "@mui/material"
import { Helmet } from "react-helmet-async"

import { styled } from "@mui/material/styles"
import Logo from "@meroedu/components/LogoSign"
import Hero from "./Hero"
import Footer from "@meroedu/components/Footer"
import { SignInModal } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"
import Pricing from "./Pricing/PricingContent"

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
  const meroedu = useMeroedu()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const hideModal = () => setIsSignInModalOpen(false)
  const showModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignInModalOpen(true)
  }
  const showUserDashboard = () => {
    window.location.href = "/user/dashboard"
  }
  return (
    <>
      {!meroedu.session.isAuthenticated && (
        <HomePageWrapper>
          <Helmet>
            <title>Mero Edu</title>
          </Helmet>
          <Container maxWidth="lg">
            <Box display="flex" justifyContent="center" py={5} alignItems="center">
              <Logo />
            </Box>
            <Card sx={{ p: 10, mb: 10, borderRadius: 12 }}>
              <Hero showModal={showModal} />
            </Card>
            <Pricing />
          </Container>
          <Footer />
          <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
        </HomePageWrapper>
      )}
      {meroedu.session.isAuthenticated && showUserDashboard()}
    </>
  )
}

export default HomePage
