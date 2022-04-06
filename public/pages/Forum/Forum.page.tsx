import React from "react"
import { Helmet } from "react-helmet-async"
import PageHeader from "./PageHeader"
import PageTitleWrapper from "@meroedu/components/PageTitleWrapper"
import { Grid, Container } from "@mui/material"

import RecentOrders from "./RecentOrders"

function ForumPage() {
  return (
    <>
      <Helmet>
        <title>Forum</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ForumPage
