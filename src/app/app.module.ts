import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material-module';
import { AppRoutingModule } from './app-routing.module';
import { AcademicComponent } from './academic/academic.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { UserComponent } from './user/user.component';
import { EditComponent } from './edit/edit.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { SkillsComponent } from './skills/skills.component';
import { PersonalComponent } from './personal/personal.component';
import { AdmineducationComponent } from './admineducation/admineducation.component';
import { AdminexperienceComponent } from './adminexperience/adminexperience.component';
import { EditeducationComponent } from './editeducation/editeducation.component';
import { EditexperienceComponent } from './editexperience/editexperience.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AcademicComponent,
    AdminComponent,
    ProfileComponent,
    SidenavComponent,
    UserComponent,
    EditComponent,
    EducationComponent,
    ExperienceComponent,
    SkillsComponent,
    PersonalComponent,
    AdmineducationComponent,
    AdminexperienceComponent,
    EditeducationComponent,
    EditexperienceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
