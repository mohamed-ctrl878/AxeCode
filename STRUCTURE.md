Folder PATH listing
Volume serial number is 46F0-0950
D:\NEWVITEAPP\AXE_CODE\SRC
|   App.css
|   App.jsx
|   index.css
|   LiveStream.jsx
|   LiveViewer.jsx
|   main.jsx
|   modules.d.ts
|   routes.jsx
|   SocketChatTest.jsx
|   
+---core
|   +---apienv
|   |       apiClient.js
|   |       Apifaliure.js
|   |       ApiResult.js
|   |       ApiSucsess.js
|   |       
|   +---queries
|   |       basicFilterationQuery.js
|   |       checkNameAndEmailUsed.js
|   |       courseQuery.js
|   |       
|   \---utils
|       +---problemUploader
|       |       executionValidType.js
|       |       handellers.js
|       |       parsers.js
|       |       validation.js
|       |       
|       +---userhelpers
|       |       getOutIdintifires.js
|       |       getVideoDuration.js
|       |       
|       \---validationFroms
|               validationLog.js
|               validationReg.js
|               
+---data
|   +---models
|   |       commentDTO.js
|   |       courseDTO.js
|   |       EntitlementDTO.js
|   |       lessonDTO.js
|   |       ProblemDTO.js
|   |       ProblemtypeDTO.js
|   |       UserDTO.js
|   |       weekDTO.js
|   |       
|   +---repositories
|   |   +---community
|   |   |       GetArticle.js
|   |   |       GetConvirsation.js
|   |   |       GetOneArticle.js
|   |   |       GetOneConversation.js
|   |   |       GetOnePost.js
|   |   |       GetPost.js
|   |   |       PostArticle.js
|   |   |       PostConvirsation.js
|   |   |       PostPosts.js
|   |   |       
|   |   +---courseImps
|   |   |       GetCourse.js
|   |   |       GetCoursesType.js
|   |   |       GetOneCourse.js
|   |   |       GetWeeks.js
|   |   |       PostCourses.js
|   |   |       
|   |   +---entitlement
|   |   |       PostUserEntitlement.js
|   |   |       
|   |   +---event
|   |   +---helpCenter
|   |   +---lessonImps
|   |   |       GetLessons.js
|   |   |       GetOneLesson.js
|   |   |       PostLesson.js
|   |   |       
|   |   +---media
|   |   |       PostMedia.js
|   |   |       
|   |   +---problemImps
|   |   |       GetOneProblem.js
|   |   |       GetProblem.js
|   |   |       GetProblem_types.js
|   |   |       PostProblem.js
|   |   |       
|   |   +---sharedImps
|   |   |       PostEntitlement.js
|   |   |       
|   |   +---storageImps
|   |   |       LocalstorageServImp.js
|   |   |       
|   |   +---userImps
|   |   |       CheckerForIdintify.js
|   |   |       ForgetPasswordClass.js
|   |   |       GetMyData.js
|   |   |       LoginImp.js
|   |   |       Logout.js
|   |   |       RegesterConfirm.js
|   |   |       RegesterImp.js
|   |   |       ResetPasswordClass.js
|   |   |       
|   |   \---weekImps
|   |           PostWeek.js
|   |           
|   \---storage
|       \---storeRx
|           +---Course&LessonStore
|           |       uploadCourse&LessonStore.js
|           |       
|           +---coursesSlices
|           |       coursesData.js
|           |       
|           +---globalStore
|           |       registerDataSteps.js
|           |       store.js
|           |       themeSlice.js
|           |       userAuthSlice.js
|           |       userData.js
|           |       
|           +---lessonSlices
|           |       lessonData.js
|           |       
|           +---problemSlices
|           |       problemStepState.js
|           |       sliceForfillTestCases.js
|           |       sliceForValid.js
|           |       sliceProblemDataPost.js
|           |       uploadProblemStore.js
|           |       
|           +---sharedSlices
|           |       entitlementSlice.js
|           |       validStarter.js
|           |       
|           \---weeksSlices
|                   weeksData.js
|                   
+---domain
|   +---entities
|   |   +---comment
|   |   |       Comment.js
|   |   |       
|   |   +---course
|   |   |       Course.js
|   |   |       
|   |   +---lesson
|   |   |       Lesson.js
|   |   |       
|   |   +---problem
|   |   |       ProblemType.js
|   |   |       UploadProlemEntity.js
|   |   |       
|   |   \---user
|   |           Userifno.js
|   |           
|   +---interfaces
|   |   +---MethodzUser
|   |   |       UserAuth.js
|   |   |       
|   |   +---storageAccess
|   |   |       CacheService.js
|   |   |       
|   |   \---user
|   |           ApiContentMethodz.js
|   |           
|   +---reqs_dtos
|   |       CourseUploadDTO.js
|   |       EntitlementData.js
|   |       entitlement_id.js
|   |       LessonUploadDTO.js
|   |       ProblemUploadDTO.js
|   |       RegisterDTO.js
|   |       UserAhthDTO.js
|   |       WeekUploadDTO.js
|   |       
|   \---usecases
|       +---course
|       |       getCourseLearningExe.js
|       |       getCoursePreviewExe.js
|       |       getCoursesExe.js
|       |       getCoursesInfoExe.js
|       |       getCourseTypesExe.js
|       |       postCourseExe.js
|       |       
|       +---entitlement
|       |       postEntitlementExe.js
|       |       
|       +---lesson
|       |       getLessonsExe.js
|       |       postLessonExe.js
|       |       
|       +---problem
|       |       getProblemTypeExe.js
|       |       postProblemExe.js
|       |       
|       +---shared
|       |       getOneItemExe.js
|       |       
|       +---user
|       |       baseLoginExe.js
|       |       basicRegisterExe.js
|       |       forgetPassExe.js
|       |       getMyDataExe.js
|       |       logoutExe.js
|       |       postUserEntitlementExe.js
|       |       resetPassExe.js
|       |       useCheckUserIdentifierFound.jsx
|       |       useEmailConfirmation.jsx
|       |       
|       \---week
|               postWeekExe.js
|               
\---presentation
    +---assets
    |   +---icons
    |   |       axe.svg
    |   |       
    |   +---images
    |   |       cat.webp
    |   |       error.webp
    |   |       
    |   \---videos
    +---pages
    |   |   VideoPlayerDemo.jsx
    |   |   VideoPlayerDemo.module.css
    |   |   
    |   +---auth
    |   |   +---components
    |   |   |       AuthLayout.jsx
    |   |   |       RegisterStepBasicInfo.jsx
    |   |   |       RegisterStepPassword.jsx
    |   |   |       RegisterStepProfile.jsx
    |   |   |       RegisterStepReview.jsx
    |   |   |       
    |   |   \---routes
    |   |           EmailConfirmation.jsx
    |   |           ForgetPassword.jsx
    |   |           Login.jsx
    |   |           Register.jsx
    |   |           RegisterMultiStep.jsx
    |   |           ResetPassword.jsx
    |   |           
    |   +---chat
    |   |   |   index.js
    |   |   |   README.md
    |   |   |   
    |   |   \---routes
    |   |           Chat.jsx
    |   |           
    |   +---community
    |   |   +---components
    |   |   |       PostArticle.jsx
    |   |   |       
    |   |   \---routes
    |   |           Community.jsx
    |   |           
    |   +---course
    |   |   +---components
    |   |   |       CourseCard.jsx
    |   |   |       uploadCoursesSteps.jsx
    |   |   |       
    |   |   \---routes
    |   |           AddCourse.jsx
    |   |           Checkout.jsx
    |   |           CourseContent.jsx
    |   |           CoursePreview.jsx
    |   |           Courses.jsx
    |   |           
    |   +---dashboard
    |   |   +---components
    |   |   |       CourseCartContainer.jsx
    |   |   |       LessonCartContainer.jsx
    |   |   |       
    |   |   \---routes
    |   |           ContentDashboard.jsx
    |   |           CourseManager.jsx
    |   |           EntitlementManager.jsx
    |   |           RenderContentSection.jsx
    |   |           RenderCoursesSection.jsx
    |   |           RenderDashboardSection.jsx
    |   |           RenderPreferencesSection.jsx
    |   |           
    |   +---documents
    |   |   \---routes
    |   |           Documents.jsx
    |   |           
    |   +---events
    |   |   \---routes
    |   |           EventsListing.jsx
    |   |           TechEvent.jsx
    |   |           
    |   +---home
    |   |   +---components
    |   |   |       HeroSec.jsx
    |   |   |       PinedPosts.jsx
    |   |   |       
    |   |   \---routes
    |   |           DemoHome.jsx
    |   |           Home.jsx
    |   |           
    |   +---lesson
    |   |   +---components
    |   |   |       uploadLessonSteps.jsx
    |   |   |       
    |   |   \---routes
    |   |           AddLesson.jsx
    |   |           Lesson.jsx
    |   |           
    |   +---livestream
    |   |   |   index.js
    |   |   |   README.md
    |   |   |   
    |   |   \---routes
    |   |           LiveDetail.jsx
    |   |           LiveSchedule.jsx
    |   |           LiveStream.jsx
    |   |           
    |   +---problem
    |   |   +---components
    |   |   |       CrudTstCases.jsx
    |   |   |       InputTstCase.jsx
    |   |   |       PracticenActivitesInfo.jsx
    |   |   |       PracticeProblemTable.jsx
    |   |   |       ProblemTable.jsx
    |   |   |       ProblemUnit.jsx
    |   |   |       StepBasicInfo.jsx
    |   |   |       StepDescInForm.jsx
    |   |   |       StepDescription.jsx
    |   |   |       StepDificulty.jsx
    |   |   |       StepFuncType.jsx
    |   |   |       StepFunNamInForm.jsx
    |   |   |       StepLinks.jsx
    |   |   |       StepNOfInputs.jsx
    |   |   |       StepParams.jsx
    |   |   |       StepReview.jsx
    |   |   |       StepSetTstCases.jsx
    |   |   |       StepShowDetails.jsx
    |   |   |       StepTitleInForm.jsx
    |   |   |       StepTstCases.jsx
    |   |   |       TestCases.jsx
    |   |   |       TestCasesNameParams.jsx
    |   |   |       TestDetails.jsx
    |   |   |       useParsingExe.jsx
    |   |   |       VectorInput.jsx
    |   |   |       
    |   |   \---routes
    |   |           Practice.jsx
    |   |           ProblemModern.jsx
    |   |           UploadProblem.jsx
    |   |           
    |   +---profile
    |   |   +---components
    |   |   |       ContriputionGraph.jsx
    |   |   |       ProfileBar.jsx
    |   |   |       
    |   |   \---routes
    |   |           RenderProfileSection.jsx
    |   |           
    |   +---roadmaps
    |   |   \---routes
    |   |           Roadmaps.jsx
    |   |           
    |   +---settings
    |   |   \---routes
    |   |           Settings.jsx
    |   |           
    |   \---week
    |       +---components
    |       |       uploadWeekSteps.jsx
    |       |       
    |       \---routes
    |               AddWeek.jsx
    |               
    +---shared
    |   +---components
    |   |   +---calendar
    |   |   |       Clender.jsx
    |   |   |       MyCalendar.jsx
    |   |   |       
    |   |   +---code
    |   |   |       CodeBlock.jsx
    |   |   |       CodeEditorRep.jsx
    |   |   |       
    |   |   +---editor
    |   |   |       CodeEditor.jsx
    |   |   |       LinkDialog.jsx
    |   |   |       StrapiRichEditor.jsx
    |   |   |       Toolbar.jsx
    |   |   |       
    |   |   +---feedback
    |   |   |       Feedback.jsx
    |   |   |       
    |   |   +---form
    |   |   |       BaseCourseContentSteps.jsx
    |   |   |       CourseAndLessonBoard.jsx
    |   |   |       CourseSelector.jsx
    |   |   |       DataMapping.jsx
    |   |   |       FetchingStep.jsx
    |   |   |       Form.jsx
    |   |   |       LessonSelector.jsx
    |   |   |       MultibleFrom.jsx
    |   |   |       ProblemTypeMapper.jsx
    |   |   |       StepCourseSelection.jsx
    |   |   |       StepEntitlement.jsx
    |   |   |       StepMediaUpload.jsx
    |   |   |       SwitchersBtnsMForm.jsx
    |   |   |       useOPTAndPGN.jsx
    |   |   |       useOptmozationSetter.jsx
    |   |   |       VectorInput.jsx
    |   |   |       WeekMappingElement.jsx
    |   |   |       WeekSelector.jsx
    |   |   |       
    |   |   +---layout
    |   |   |       ForOutlet.jsx
    |   |   |       Layout.jsx
    |   |   |       LinkHeader.jsx
    |   |   |       MainContent.jsx
    |   |   |       ReCapatcha.jsx
    |   |   |       ScrollReveal.jsx
    |   |   |       ScrollToTop.jsx
    |   |   |       Sidebar.jsx
    |   |   |       
    |   |   +---loading
    |   |   |       LoadingPortal.jsx
    |   |   |       ProgressBar.jsx
    |   |   |       
    |   |   +---media
    |   |   |       ShowImage.jsx
    |   |   |       ShowVideo.jsx
    |   |   |       
    |   |   +---ui
    |   |   |   |   DifficultyBadge.jsx
    |   |   |   |   GenericFilters.jsx
    |   |   |   |   SharedUI.module.css
    |   |   |   |   StatusHandler.jsx
    |   |   |   |   UniformHeader.jsx
    |   |   |   |   
    |   |   |   +---error
    |   |   |   |       ErrComponent.jsx
    |   |   |   |       
    |   |   |   +---loader
    |   |   |   |       Loader.css
    |   |   |   |       Loader.jsx
    |   |   |   |       
    |   |   |   +---messages
    |   |   |   |       FailureMessage.jsx
    |   |   |   |       SuccessMessage.jsx
    |   |   |   |       
    |   |   |   \---themes&other
    |   |   |           RichTextRenderer.jsx
    |   |   |           ThemeTest.jsx
    |   |   |           UserEntitlement.jsx
    |   |   |           
    |   |   \---video
    |   |           README.md
    |   |           VideoPlayer.jsx
    |   |           VideoPlayer.module.css
    |   |           
    |   \---hooks
    |           useActionHook.jsx
    |           useBaseLogin.jsx
    |           useClearChkStateEffect.jsx
    |           useEditorCommands.jsx
    |           useElementChanger.jsx
    |           useFillTestCasesEffect.jsx
    |           useFirstRenderForFillCases.jsx
    |           useGetContent.jsx
    |           useHndillerRigisterInfo.jsx
    |           useLastFilltrationTestCases.jsx
    |           useLogout.jsx
    |           usePaginationContent.jsx
    |           useParseAndValidTstCs.jsx
    |           useParsingExe.jsx
    |           useRegisterProcess.jsx
    |           useResetPasswordProccess.jsx
    |           useSetMediaSrc.jsx
    |           useSetMediaToIndexedDB.jsx
    |           useUpdateStoper.jsx
    |           useUploadProblem.jsx
    |           useUploadRelatedMedia.jsx
    |           useValidateInputEffect.jsx
    |           useValidationCourseAndLesson.jsx
    |           useVideoPlayer.jsx
    |           
    \---styles
        |   design-system-reference.json
        |   design-system.css
        |   DESIGN_SYSTEM_GUIDE.md
        |   MIGRATION_GUIDE.md
        |   README.md
        |   theme.css
        |   
        +---components
        |       clender.module.css
        |       header-new.module.css
        |       ProgressBar.module.css
        |       showImage.module.css
        |       showVideo.module.css
        |       sidebar.module.css
        |       StrapiRichEditor.module.css
        |       SuccessMessage.module.css
        |       
        +---examples
        |       design-system-usage-example.module.css
        |       simple-example.module.css
        |       
        \---pages
                add-lesson-course.module.css
                animations.css
                auth-utils.module.css
                auth.module.css
                chat.module.css
                checkout.module.css
                community.module.css
                content-dashboard.module.css
                course-content.module.css
                course-preview.module.css
                courses.module.css
                demo-home.module.css
                documents.module.css
                events-listing.module.css
                home-new.module.css
                live-detail.module.css
                live-schedule.module.css
                livestream.module.css
                login.module.css
                practice.module.css
                problem-modern.module.css
                register-multi-step.module.css
                register.module.css
                roadmaps.module.css
                settings.module.css
                tech-events.module.css
                upload-problem.module.css
                
