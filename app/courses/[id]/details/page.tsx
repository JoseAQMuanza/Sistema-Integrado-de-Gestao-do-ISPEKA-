interface CourseDetailProps {
params: {
  id: string
},
}

import CourseDetailPage from "../../course-detail-page"
export default async function CourseDetail({params}: CourseDetailProps) {
  const {id} = await params
  const courseId = parseInt(id)

  console.log()
  return(  
    <CourseDetailPage courseId={courseId}/>
  )
}