// import { Banner } from "@meroedu/components"
import { Box, Container} from "@mui/material"
import React from "react"
import CourseListGrid from "./components/course-grid-list"
import { CourseListToolbar } from "./components/course-list-toolbar"

const CoursePage = () => {
  return (
    <>
      {/* <Banner title="Courses" /> */}
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={false}>
          <CourseListToolbar onCourseCreateClick={"/user/courses/create"} />
          <Box sx={{ mt: 3 }}>
            <CourseListGrid />
          </Box>
        </Container>
      </Box>
    {/* <CreateCourseModal open={open} handleClose={handleClose} scroll={scroll}/> */}
    </>
  )
}

export default CoursePage
