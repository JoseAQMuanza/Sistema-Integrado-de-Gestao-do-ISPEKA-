interface CourseEditPageProps {
params: {
  id: string
},
}

import CourseEditPage from "../../course-edit-page"

export default async function CourseEdit({params}: CourseEditPageProps) {
  const {id} = await params
  const courseId = parseInt(id)

  console.log()
  return(  
    <CourseEditPage/>
  )
}