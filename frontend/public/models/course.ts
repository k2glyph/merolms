import { User } from "./identity"

export interface Course {
  id: number
  number: number
  slug: string
  title: string
  description: string
  createdAt: string
  status: string
  user: User
  hasVoted: boolean
  response: CourseResponse | null
  votesCount: number
  commentsCount: number
  tags: string[]
}

export class CourseStatus {
  constructor(public title: string, public value: string, public show: boolean, public closed: boolean, public filterable: boolean) {}

  public static Open = new CourseStatus("Open", "open", false, false, false)
  public static Planned = new CourseStatus("Planned", "planned", true, false, true)
  public static Started = new CourseStatus("Started", "started", true, false, true)
  public static Completed = new CourseStatus("Completed", "completed", true, true, true)
  public static Declined = new CourseStatus("Declined", "declined", true, true, true)
  public static Duplicate = new CourseStatus("Duplicate", "duplicate", true, true, false)
  public static Deleted = new CourseStatus("Deleted", "deleted", false, true, false)

  public static Get(value: string): CourseStatus {
    for (const status of CourseStatus.All) {
      if (status.value === value) {
        return status
      }
    }
    throw new Error(`CourseStatus not found for value ${value}.`)
  }

  public static All = [CourseStatus.Open, CourseStatus.Planned, CourseStatus.Started, CourseStatus.Completed, CourseStatus.Duplicate, CourseStatus.Declined]
}

export interface CourseResponse {
  user: User
  text: string
  respondedAt: Date
  original?: {
    number: number
    title: string
    slug: string
    status: string
  }
}

// export interface Comment {
//   id: number
//   content: string
//   createdAt: string
//   user: User
//   attachments?: string[]
//   editedAt?: string
//   editedBy?: User
// }

// export interface Tag {
//   id: number
//   slug: string
//   name: string
//   color: string
//   isPublic: boolean
// }

// export interface Vote {
//   createdAt: Date
//   user: {
//     id: number
//     name: string
//     email: string
//     avatarURL: string
//   }
// }
