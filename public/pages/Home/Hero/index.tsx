import React, { FC } from "react"
import { Box, Button, ButtonGroup, Container, Grid, Typography } from "@mui/material"

import { styled } from "@mui/material/styles"

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
)

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
)

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
)
// const MuiAvatar = styled(Box)(
//   ({ theme }) => `
//     width: ${theme.spacing(8)};
//     height: ${theme.spacing(8)};
//     border-radius: ${theme.general.borderRadius};
//     background-color: #e5f7ff;
//     flex-shrink: 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin: 0 auto ${theme.spacing(2)};

//     img {
//       width: 60%;
//       height: 60%;
//       display: block;
//     }
// `
// );

// const TsAvatar = styled(Box)(
//   ({ theme }) => `
//     width: ${theme.spacing(8)};
//     height: ${theme.spacing(8)};
//     border-radius: ${theme.general.borderRadius};
//     background-color: #dfebf6;
//     flex-shrink: 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin: 0 auto ${theme.spacing(2)};

//     img {
//       width: 60%;
//       height: 60%;
//       display: block;
//     }
// `
// );

const Hero:FC<any> = (props) =>{
  return (
    
    <Container maxWidth="lg" sx={{ textAlign: "center" }}>
      <Grid spacing={{ xs: 6, md: 10 }} justifyContent="center" alignItems="center" container>
        <Grid item md={10} lg={8} mx="auto">
          <LabelWrapper color="success">Version 1.0.0</LabelWrapper>
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            Mero Edu
          </TypographyH1>
          <TypographyH2 sx={{ lineHeight: 1.5, pb: 4 }} variant="h4" color="text.secondary" fontWeight="normal">
            Mero Edu is a software application for the administration, documentation, tracking, reporting, automation and delivery of educational courses, training programs, or learning and development programs for school.
          </TypographyH2>
         <ButtonGroup>
            <Button component="a" onClick={props.showModal} size="large" variant="contained" >
              Sign In
            </Button>
            
            {/* <Button component="a" href="/signup" size="large" variant="outlined">
              Sign Up
            </Button>

            <Button component="a" target="_blank" rel="noopener" href="https://demo.meroedu.io" size="large" variant="contained">
              Browse Live Preview
            </Button> */}

            <Button
              sx={{ ml: 2 }}
              component="a"
              target="_blank"
              rel="noopener"
              href="https://github.com/merolms/meroedu/blob/master/meroedu.roadmap.md"
              size="large"
              variant="outlined"
            >
              Our Public Roadmap
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Hero
