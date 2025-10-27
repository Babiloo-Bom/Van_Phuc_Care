import { Router } from 'express'
import MongoDbCourses from '../../../mongodb/courses'

const router = Router()

// Update video data for a specific lesson
router.post('/update-video', async (req, res) => {
  try {
    const { courseId, chapterIndex, lessonIndex, videoUrl, thumbnail, fileSize, quality } = req.body

    if (!courseId || chapterIndex === undefined || lessonIndex === undefined) {
      return res.status(400).json({
        status: false,
        message: 'Missing required parameters'
      })
    }

    const course = await MongoDbCourses.model.findById(courseId) as any
    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found'
      })
    }

    // Update the specific lesson with video data
    if (course.chapters && course.chapters[chapterIndex] && course.chapters[chapterIndex].lessons) {
      const lesson = course.chapters[chapterIndex].lessons[lessonIndex]
      if (lesson) {
        lesson.videoUrl = videoUrl
        lesson.thumbnail = thumbnail
        lesson.fileSize = fileSize
        lesson.quality = quality
        
        await course.save()
        
        return res.json({
          status: true,
          message: 'Video data updated successfully',
          data: { lesson }
        })
      }
    }

    return res.status(404).json({
      status: false,
      message: 'Lesson not found'
    })

  } catch (error) {
    console.error('Error updating video data:', error)
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    })
  }
})

export default router
