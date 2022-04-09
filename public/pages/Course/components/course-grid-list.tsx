import React from "react"
// import "@meroedu/assets/styles/tailwind.css"
import { Grid } from "@mui/material"
import CourseGridItem from "./course-grid-item"

const CourseListGrid = () => {
  return (
    <>
      <Grid container spacing={1}>
        {Array.from(Array(20)).map((_, index) => (
          <Grid item lg={3} md={3} xs={12} key={index} style={{ display: "flex", justifyContent: "center" }}>
            <CourseGridItem />
          </Grid>
        ))}
      </Grid>
      {/* <CourseGridItem/> */}
    </>
  )
}

export default CourseListGrid
