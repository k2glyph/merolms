import "./Course.page.scss"
import "@meroedu/assets/styles/tailwind.css"
import React, { useState, useRef } from "react"
import Card from "@meroedu/components/common/Card"
// @ts-ignore
import courses from "./course.json"
import Pager from "@meroedu/components/Pager/Pager"
import { Banner } from "@meroedu/components/Banner"
// import { Course } from "@meroedu/models"

export interface CoursePageProps {
  // courses: Course[]
  countPerStatus: { [key: string]: number }
}

const CoursePage: React.FC<CoursePageProps> = ({ countPerStatus }) => {
  const [active, setActive] = useState(false)
  const [height, setHeight] = useState("0px")

  const contentSpace = useRef(null)

  function toggleAccordion() {
    setActive(active === false ? true : false)
    // @ts-ignore
    setHeight(active ? "0px" : `${contentSpace.current.scrollHeight}px`)
  }
  console.log("Logs all courses comming from databases")
  console.log(courses, countPerStatus)
  const courseList = courses.map((course: any, index: React.Key) => {
    return (
      <div className="hover:scale-105" key={index}>
        <Card title={course.title} description={course.description.substring(0, 250)} image={course.image_url}>
          <div className="flex justify-between flex-row text-sm space-x-4 px-4 mb-4">
            <div className="flex justify-around  flex-row text-sm ml-2 mr-2">
              <svg
                className="h-6 w-6 text-red-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="12 4 4 8 12 12 20 8 12 4" /> <polyline points="4 12 12 16 20 12" />{" "}
                <polyline points="4 16 12 20 20 16" />
              </svg>
              <div>Chapters: {course.chapters_count}</div>
            </div>
            <div className="flex justify-around  flex-row text-sm">
              <svg
                className="h-6 w-6 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <circle cx="12" cy="12" r="10" /> <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>{course.duration}</div>
            </div>
          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
          </div>
          <button onClick={toggleAccordion} className="w-full" type="button">
            Expand Details
          </button>
          <div
            ref={contentSpace}
            style={{ maxHeight: `${height}`, visibility: `${active ? "visible" : "hidden"}` }}
            className={`overflow-auto transition-max-height duration-700 ease-in-out px-4 mb-4`}
          >
            {course.long_description}
          </div>
        </Card>
      </div>
    )
  })

  return (
    <Pager>
      <div className="md:container md:mx-auto">
        <Banner title="Courses" />
        <div className="flex justify-between  flex-row">
          <input
            type="text"
            id="course-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create New Course</button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">{courseList}</div>
      </div>
    </Pager>
  )
}

export default CoursePage
