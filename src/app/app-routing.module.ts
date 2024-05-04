// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { AcademicComponent } from './academic/academic.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { EditComponent } from './edit/edit.component';
import { ExperienceComponent } from './experience/experience.component';
import { SkillsComponent } from './skills/skills.component';
import { PersonalComponent } from './personal/personal.component';
import { EducationComponent } from './education/education.component';
import { AdmineducationComponent } from './admineducation/admineducation.component';
import { EditeducationComponent } from './editeducation/editeducation.component';
import { AdminexperienceComponent } from './adminexperience/adminexperience.component';
import { EditexperienceComponent } from './editexperience/editexperience.component';


const routes: Routes = [
  // other routes
  {
    path: 'header', component: HeaderComponent
  },
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'academic', component: AcademicComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },
  { path: 'edit', component: EditComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'personal', component: PersonalComponent },
  { path: 'education', component: EducationComponent },
  { path: 'admineducation', component: AdmineducationComponent },
  { path: 'editeducation', component: EditeducationComponent },
  { path: 'editexperience', component: EditexperienceComponent },

  { path: 'adminexperience', component: AdminexperienceComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
