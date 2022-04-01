import React from "react"
import { Table } from "semantic-ui-react"
interface CourseTableItemProps {
  course: any
}
const CourseTableItem = (props: CourseTableItemProps) => {
  const course = props.course
  return (
    <Table.Row>
      <Table.Cell href={"courses/1"}>{course.Title}</Table.Cell>
      <Table.Cell>{course.Category}</Table.Cell>
      <Table.Cell>{course.Lesson}</Table.Cell>
      <Table.Cell>{course.Status}</Table.Cell>
      <Table.Cell>{course.Author}</Table.Cell>
    </Table.Row>
  )
}
export default CourseTableItem
