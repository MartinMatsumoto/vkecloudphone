import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgetPwdPage } from '../pages/forgetpwd/forgetpwd';
import { MainPage } from '../pages/main/main';
import { MyCoursePage } from '../pages/mycourse/mycourse';
import { AllCoursePage } from '../pages/allcourse/allcourse';
import { CourseSearchParamPage } from '../pages/allcourse/course_search_param/course_search_param';
import { FollowSearchParamPage } from '../pages/follow/follow_search_param/follow_search_param';
import { CourseUnbuyDetailPage } from '../pages/allcourse/course_unbuy_detail/course_unbuy_detail';
import { ChatPage } from '../pages/message/chat/chat';
import { MessagePage } from '../pages/message/message';
import { FollowPage } from '../pages/follow/follow';
import { NotesPage } from '../pages/notes/notes';
import { NotesDetailPage } from '../pages/notes/notes_detail/notes_detail';
import { NotesCreatePage } from '../pages/notes/notes_create/notes_create';
import { NotesModifyDialogPage } from '../pages/notes/notes_modify_dialog/notes_modify_dialog';
import { QuestionsPage } from '../pages/questions/questions';
import { QuestionsDetailPage } from '../pages/questions/questions_detail/questions_detail';
import { QuestionReplyDialogPage } from '../pages/questions/question_reply_dialog/question_reply_dialog';
import { QuestionCreatePage } from '../pages/questions/question_create/question_create';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsMyinfoPage } from '../pages/settings/settings_myinfo/settings_myinfo';
import { SettingsPasswordPage } from '../pages/settings/settings_password/settings_password';
import { CourseDetailPage } from '../pages/course_detail/course_detail';
import { CourseViewPraxis } from '../pages/praxis/course_view_praxis';
import { CourseViewPraxisMenu } from '../pages/praxis/course_view_praxis_menu/course_view_praxis_menu';
import { PraxisResolvePage } from '../pages/praxis/praxis_resolve/praxis_resolve';
import { Vkeplay } from '../pages/vkeplay/vkeplay';
import { Docview } from '../pages/docview/docview';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    ForgetPwdPage,
    MainPage,
    MyCoursePage,
    AllCoursePage,
    MessagePage,
    ChatPage,
    FollowPage,
    NotesPage,
    NotesDetailPage,
    NotesModifyDialogPage,
    QuestionsPage,
    QuestionsDetailPage,
    QuestionReplyDialogPage,
    SettingsPage,
    SettingsMyinfoPage,
    SettingsPasswordPage,
    CourseDetailPage,
    CourseViewPraxis,
    CourseViewPraxisMenu,
    PraxisResolvePage,
    Vkeplay,
    QuestionCreatePage,
    NotesCreatePage,
    Docview,
    FollowSearchParamPage,
    CourseUnbuyDetailPage,
    CourseSearchParamPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    ForgetPwdPage,
    MainPage,
    MyCoursePage,
    AllCoursePage,
    MessagePage,
    ChatPage,
    FollowPage,
    NotesPage,
    NotesDetailPage,
    NotesModifyDialogPage,
    QuestionsPage,
    QuestionsDetailPage,
    QuestionReplyDialogPage,
    SettingsPage,
    SettingsMyinfoPage,
    SettingsPasswordPage,
    CourseDetailPage,
    CourseViewPraxis,
    CourseViewPraxisMenu,
    PraxisResolvePage,
    Vkeplay,
    QuestionCreatePage,
    NotesCreatePage,
    Docview,
    FollowSearchParamPage,
    CourseUnbuyDetailPage,
    CourseSearchParamPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
