import React from "react"
import { Box, Container, Link, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const FooterWrapper = styled(Box)(
  ({ theme }) => `
        border-radius: 0;
        margin: ${theme.spacing(3)} 0;
`
)

function Footer() {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Box py={3} display={{ xs: "block", md: "flex" }} alignItems="center" textAlign={{ xs: "center", md: "left" }} justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1">&copy; 2022 - MeroEdu</Typography>
          </Box>
          <Typography sx={{ pt: { xs: 2, md: 0 } }} variant="subtitle1">
            Crafted by{" "}
            <Link href="https://meroedu.io" target="_blank" rel="noopener noreferrer">
              meroedu.io
            </Link>
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  )
}

export default Footer
