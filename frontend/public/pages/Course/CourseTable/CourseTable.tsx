import React from "react"
import { Table } from "semantic-ui-react"
interface CourseProps {
  rows: any
}
const CourseTable = (props: CourseProps) => {
  return (
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Course Name</Table.HeaderCell>
          <Table.HeaderCell>Category</Table.HeaderCell>
          <Table.HeaderCell>Lessons</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Author</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {props.rows}
      <Table.Body />
    </Table>
  )
}
export default CourseTable
